import React, { memo, useCallback } from 'react';
import type { FormField, FieldType } from '../types';
import { isNumberField, isGroupField } from '../types';
import { useFormBuilder } from '../context/FormBuilderContext';
import GroupEditor from './GroupEditor';

interface FieldEditorProps {
    field: FormField;
    index: number;
    totalFields: number;
    depth?: number;
}

const FieldEditor: React.FC<FieldEditorProps> = memo(({ field, index, totalFields, depth = 0 }) => {
    const { updateField, deleteField, moveField, addField } = useFormBuilder();

    const handleLabelChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateField(field.id, { label: e.target.value });
        },
        [field.id, updateField]
    );

    const handleRequiredChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateField(field.id, { required: e.target.checked });
        },
        [field.id, updateField]
    );

    const handleMinChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value === '' ? undefined : Number(e.target.value);
            updateField(field.id, { min: value });
        },
        [field.id, updateField]
    );

    const handleMaxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value === '' ? undefined : Number(e.target.value);
            updateField(field.id, { max: value });
        },
        [field.id, updateField]
    );

    const handleDelete = useCallback(() => {
        deleteField(field.id);
    }, [field.id, deleteField]);

    const handleMoveUp = useCallback(() => {
        moveField(field.id, 'up');
    }, [field.id, moveField]);

    const handleMoveDown = useCallback(() => {
        moveField(field.id, 'down');
    }, [field.id, moveField]);

    const handleAddChildField = useCallback(
        (type: FieldType) => {
            addField(field.id, type);
        },
        [field.id, addField]
    );

    const fieldTypeLabel = field.type.charAt(0).toUpperCase() + field.type.slice(1);
    const indentStyle = { marginLeft: `${depth * 20}px` };

    return (
        <div className="field-editor" style={indentStyle}>
            <div className="field-editor-header">
                <span className="field-type-badge">{fieldTypeLabel}</span>
                <div className="field-actions">
                    <button
                        onClick={handleMoveUp}
                        disabled={index === 0}
                        className="btn btn-small"
                        title="Move up"
                    >
                        ↑
                    </button>
                    <button
                        onClick={handleMoveDown}
                        disabled={index === totalFields - 1}
                        className="btn btn-small"
                        title="Move down"
                    >
                        ↓
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-small btn-danger"
                        title="Delete field"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="field-editor-body">
                <div className="form-group">
                    <label>Label:</label>
                    <input
                        type="text"
                        value={field.label}
                        onChange={handleLabelChange}
                        className="input"
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={field.required}
                            onChange={handleRequiredChange}
                        />
                        Required
                    </label>
                </div>

                {isNumberField(field) && (
                    <div className="number-constraints">
                        <div className="form-group">
                            <label>Min:</label>
                            <input
                                type="number"
                                value={field.min ?? ''}
                                onChange={handleMinChange}
                                className="input input-small"
                                placeholder="No min"
                            />
                        </div>
                        <div className="form-group">
                            <label>Max:</label>
                            <input
                                type="number"
                                value={field.max ?? ''}
                                onChange={handleMaxChange}
                                className="input input-small"
                                placeholder="No max"
                            />
                        </div>
                    </div>
                )}

                {isGroupField(field) && (
                    <GroupEditor
                        groupField={field}
                        onAddField={handleAddChildField}
                        depth={depth + 1}
                    />
                )}
            </div>
        </div>
    );
});

FieldEditor.displayName = 'FieldEditor';

export { FieldEditor };
export default FieldEditor;
