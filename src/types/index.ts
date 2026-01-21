export type FieldType = 'text' | 'number' | 'group';

export interface BaseField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
}

export interface TextField extends BaseField {
    type: 'text';
}

export interface NumberField extends BaseField {
    type: 'number';
    min?: number;
    max?: number;
}

export interface GroupField extends BaseField {
    type: 'group';
    children: FormField[];
}

export type FormField = TextField | NumberField | GroupField;

export interface FormConfig {
    fields: FormField[];
}

export interface FormValues {
    [fieldId: string]: string | number | FormValues;
}

export interface ValidationErrors {
    [fieldId: string]: string | ValidationErrors;
}

export interface FormBuilderContextType {
    config: FormConfig;
    addField: (parentId: string | null, type: FieldType) => void;
    updateField: (fieldId: string, updates: Partial<FormField>) => void;
    deleteField: (fieldId: string) => void;
    moveField: (fieldId: string, direction: 'up' | 'down') => void;
    importConfig: (config: FormConfig) => void;
    // Preview state
    previewValues: FormValues;
    setPreviewValues: React.Dispatch<React.SetStateAction<FormValues>>;
    isPreviewSubmitted: boolean;
    setIsPreviewSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    resetPreview: () => void;
}

export const generateId = (): string => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isTextField = (field: FormField): field is TextField => {
    return field.type === 'text';
};

export const isNumberField = (field: FormField): field is NumberField => {
    return field.type === 'number';
};

export const isGroupField = (field: FormField): field is GroupField => {
    return field.type === 'group';
};

export type LeftTab = 'editor' | 'json';
export type Tab = 'editor' | 'preview' | 'json';
export type LayoutMode = 'split' | 'tabs';

export interface LayoutToggleProps {
    mode: LayoutMode;
    onChange: (mode: LayoutMode) => void;
}
