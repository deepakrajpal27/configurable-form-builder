import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
    FormConfig,
    FormField,
    FormBuilderContextType,
    FieldType,
    GroupField,
    FormValues,
} from '../types';
import { generateId, isGroupField } from '../types';

const FormBuilderContext = createContext<FormBuilderContextType | null>(null);

const createField = (type: FieldType): FormField => {
    const baseField = {
        id: generateId(),
        label: `New ${type} field`,
        required: false,
    };

    switch (type) {
        case 'text':
            return { ...baseField, type: 'text' };
        case 'number':
            return { ...baseField, type: 'number' };
        case 'group':
            return { ...baseField, type: 'group', children: [] };
    }
};

const addFieldToParent = (
    fields: FormField[],
    parentId: string | null,
    newField: FormField
): FormField[] => {
    if (parentId === null) {
        return [...fields, newField];
    }

    return fields.map((field) => {
        if (field.id === parentId && isGroupField(field)) {
            return {
                ...field,
                children: [...field.children, newField],
            };
        }
        if (isGroupField(field)) {
            return {
                ...field,
                children: addFieldToParent(field.children, parentId, newField),
            };
        }
        return field;
    });
};

const updateFieldInTree = (
    fields: FormField[],
    fieldId: string,
    updates: Partial<FormField>
): FormField[] => {
    return fields.map((field) => {
        if (field.id === fieldId) {
            return { ...field, ...updates } as FormField;
        }
        if (isGroupField(field)) {
            return {
                ...field,
                children: updateFieldInTree(field.children, fieldId, updates),
            };
        }
        return field;
    });
};

const deleteFieldFromTree = (fields: FormField[], fieldId: string): FormField[] => {
    return fields
        .filter((field) => field.id !== fieldId)
        .map((field) => {
            if (isGroupField(field)) {
                return {
                    ...field,
                    children: deleteFieldFromTree(field.children, fieldId),
                };
            }
            return field;
        });
};

const findFieldLocation = (
    fields: FormField[],
    fieldId: string,
    _parent: FormField[] | null = null
): { parentArray: FormField[]; index: number } | null => {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].id === fieldId) {
            return { parentArray: fields, index: i };
        }
        if (isGroupField(fields[i])) {
            const result = findFieldLocation((fields[i] as GroupField).children, fieldId, fields);
            if (result) return result;
        }
    }
    return null;
};

const moveFieldInTree = (
    fields: FormField[],
    fieldId: string,
    direction: 'up' | 'down'
): FormField[] => {
    const location = findFieldLocation(fields, fieldId);
    if (!location) return fields;

    const { parentArray, index } = location;
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= parentArray.length) {
        return fields;
    }

    const isRootLevel = parentArray === fields;

    if (isRootLevel) {
        const newFields = [...fields];
        [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
        return newFields;
    }

    return fields.map((field) => {
        if (isGroupField(field)) {
            const childLocation = findFieldLocation(field.children, fieldId);
            if (childLocation && childLocation.parentArray === field.children) {
                const newChildren = [...field.children];
                [newChildren[index], newChildren[newIndex]] = [newChildren[newIndex], newChildren[index]];
                return { ...field, children: newChildren };
            }
            return {
                ...field,
                children: moveFieldInTree(field.children, fieldId, direction),
            };
        }
        return field;
    });
};

interface FormBuilderProviderProps {
    children: ReactNode;
}

export const FormBuilderProvider: React.FC<FormBuilderProviderProps> = ({ children }) => {
    const [config, setConfig] = useState<FormConfig>({ fields: [] });
    const [previewValues, setPreviewValues] = useState<FormValues>({});
    const [isPreviewSubmitted, setIsPreviewSubmitted] = useState(false);

    const resetPreview = useCallback(() => {
        setPreviewValues({});
        setIsPreviewSubmitted(false);
    }, []);

    const addField = useCallback((parentId: string | null, type: FieldType) => {
        const newField = createField(type);
        setConfig((prev) => ({
            ...prev,
            fields: addFieldToParent(prev.fields, parentId, newField),
        }));
    }, []);

    const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
        setConfig((prev) => ({
            ...prev,
            fields: updateFieldInTree(prev.fields, fieldId, updates),
        }));
    }, []);

    const deleteField = useCallback((fieldId: string) => {
        setConfig((prev) => ({
            ...prev,
            fields: deleteFieldFromTree(prev.fields, fieldId),
        }));
    }, []);

    const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
        setConfig((prev) => ({
            ...prev,
            fields: moveFieldInTree(prev.fields, fieldId, direction),
        }));
    }, []);

    const importConfig = useCallback((newConfig: FormConfig) => {
        setConfig(newConfig);
        setPreviewValues({});
        setIsPreviewSubmitted(false);
    }, []);

    const contextValue = useMemo(
        () => ({
            config,
            addField,
            updateField,
            deleteField,
            moveField,
            importConfig,
            previewValues,
            setPreviewValues,
            isPreviewSubmitted,
            setIsPreviewSubmitted,
            resetPreview,
        }),
        [config, addField, updateField, deleteField, moveField, importConfig, previewValues, isPreviewSubmitted, resetPreview]
    );

    return (
        <FormBuilderContext.Provider value={contextValue}>
            {children}
        </FormBuilderContext.Provider>
    );
};

export const useFormBuilder = (): FormBuilderContextType => {
    const context = useContext(FormBuilderContext);
    if (!context) {
        throw new Error('useFormBuilder must be used within a FormBuilderProvider');
    }
    return context;
};
