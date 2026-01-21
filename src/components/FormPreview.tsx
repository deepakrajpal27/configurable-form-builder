import React, { memo, useCallback, useMemo } from 'react';
import type { FormField, FormValues, ValidationErrors } from '../types';
import { isGroupField, isNumberField } from '../types';
import { useFormBuilder } from '../context/FormBuilderContext';

interface FieldPreviewProps {
    field: FormField;
    values: FormValues;
    errors: ValidationErrors;
    onChange: (fieldId: string, value: string | number) => void;
    depth?: number;
}

const FieldPreview: React.FC<FieldPreviewProps> = memo(
    ({ field, values, errors, onChange, depth = 0 }) => {
        const indentStyle = { marginLeft: `${depth * 20}px` };
        const error = errors[field.id] as string | undefined;

        if (isGroupField(field)) {
            const groupErrors = (errors[field.id] as ValidationErrors) || {};
            const groupValues = (values[field.id] as FormValues) || {};

            return (
                <div className="preview-group" style={indentStyle}>
                    <fieldset className="preview-fieldset">
                        <legend>
                            {field.label}
                            {field.required && <span className="required-marker">*</span>}
                        </legend>
                        {field.children.length === 0 ? (
                            <div className="empty-preview">No fields in this group</div>
                        ) : (
                            field.children.map((child) => (
                                <FieldPreview
                                    key={child.id}
                                    field={child}
                                    values={groupValues}
                                    errors={groupErrors}
                                    onChange={onChange}
                                    depth={depth + 1}
                                />
                            ))
                        )}
                    </fieldset>
                </div>
            );
        }

        const value = values[field.id] ?? '';

        return (
            <div className="preview-field" style={indentStyle}>
                <label className="preview-label">
                    {field.label}
                    {field.required && <span className="required-marker">*</span>}
                </label>
                {field.type === 'text' && (
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className={`preview-input ${error ? 'input-error' : ''}`}
                    />
                )}
                {isNumberField(field) && (
                    <input
                        type="number"
                        value={value as string | number}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        min={field.min}
                        max={field.max}
                        className={`preview-input ${error ? 'input-error' : ''}`}
                    />
                )}
                {error && <span className="error-message">{error}</span>}
            </div>
        );
    }
);

FieldPreview.displayName = 'FieldPreview';

// Validation helper functions
const validateField = (
    field: FormField,
    value: string | number | FormValues | undefined
): string | null => {
    if (field.required) {
        if (value === undefined || value === '' || value === null) {
            return 'This field is required';
        }
    }

    if (isNumberField(field) && value !== '' && value !== undefined) {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(numValue as number)) {
            return 'Please enter a valid number';
        }

        if (field.min !== undefined && (numValue as number) < field.min) {
            return `Value must be at least ${field.min}`;
        }

        if (field.max !== undefined && (numValue as number) > field.max) {
            return `Value must be at most ${field.max}`;
        }
    }

    return null;
};

const validateFields = (
    fields: FormField[],
    values: FormValues
): ValidationErrors => {
    const errors: ValidationErrors = {};

    fields.forEach((field) => {
        if (isGroupField(field)) {
            const groupValues = (values[field.id] as FormValues) || {};
            const childErrors = validateFields(field.children, groupValues);
            if (Object.keys(childErrors).length > 0) {
                errors[field.id] = childErrors;
            }
        } else {
            const error = validateField(field, values[field.id]);
            if (error) {
                errors[field.id] = error;
            }
        }
    });

    return errors;
};

const FormPreview: React.FC = memo(() => {
    const { config, previewValues, setPreviewValues, isPreviewSubmitted, setIsPreviewSubmitted, resetPreview } = useFormBuilder();

    const errors = useMemo(() => {
        if (!isPreviewSubmitted) return {};
        return validateFields(config.fields, previewValues);
    }, [config.fields, previewValues, isPreviewSubmitted]);

    const handleChange = useCallback((fieldId: string, value: string | number) => {
        setPreviewValues((prev) => {
            // Need to find the correct nesting level for this field
            const updateNestedValue = (
                currentValues: FormValues,
                fields: FormField[],
                targetId: string,
                newValue: string | number
            ): FormValues => {
                for (const field of fields) {
                    if (field.id === targetId) {
                        return { ...currentValues, [targetId]: newValue };
                    }
                    if (isGroupField(field)) {
                        const groupValues = (currentValues[field.id] as FormValues) || {};
                        const updatedGroupValues = updateNestedValue(
                            groupValues,
                            field.children,
                            targetId,
                            newValue
                        );
                        if (updatedGroupValues !== groupValues) {
                            return { ...currentValues, [field.id]: updatedGroupValues };
                        }
                    }
                }
                return currentValues;
            };

            return updateNestedValue(prev, config.fields, fieldId, value);
        });
    }, [config.fields, setPreviewValues]);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setIsPreviewSubmitted(true);

            const validationErrors = validateFields(config.fields, previewValues);
            if (Object.keys(validationErrors).length === 0) {
                alert('Form submitted successfully!\n\n' + JSON.stringify(previewValues, null, 2));
            }
        },
        [config.fields, previewValues, setIsPreviewSubmitted]
    );

    if (config.fields.length === 0) {
        return (
            <div className="preview-empty">
                <p>No fields configured yet.</p>
                <p>Add fields using the editor panel on the left.</p>
            </div>
        );
    }

    return (
        <form className="form-preview" onSubmit={handleSubmit}>
            {config.fields.map((field) => (
                <FieldPreview
                    key={field.id}
                    field={field}
                    values={previewValues}
                    errors={errors}
                    onChange={handleChange}
                />
            ))}

            <div className="preview-actions">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
                <button type="button" onClick={resetPreview} className="btn">
                    Reset
                </button>
            </div>
        </form>
    );
});

FormPreview.displayName = 'FormPreview';

export default FormPreview;
