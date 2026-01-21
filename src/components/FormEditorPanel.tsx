import React, { memo, useCallback } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import { FieldEditor } from './FieldEditor';
import type { FieldType } from '../types';

const FormEditorPanel: React.FC = memo(() => {
    const { config, addField } = useFormBuilder();

    const handleAddField = useCallback(
        (type: FieldType) => {
            addField(null, type);
        },
        [addField]
    );

    return (
        <div className="editor-panel">
            <div className="panel-header">
                <h2>Form Editor</h2>
                <div className="add-field-buttons">
                    <button
                        onClick={() => handleAddField('text')}
                        className="btn btn-primary"
                    >
                        + Text Field
                    </button>
                    <button
                        onClick={() => handleAddField('number')}
                        className="btn btn-primary"
                    >
                        + Number Field
                    </button>
                    <button
                        onClick={() => handleAddField('group')}
                        className="btn btn-primary"
                    >
                        + Group
                    </button>
                </div>
            </div>

            <div className="fields-list">
                {config.fields.length === 0 ? (
                    <div className="empty-state">
                        <p>No fields yet. Click the buttons above to add fields.</p>
                    </div>
                ) : (
                    config.fields.map((field, index) => (
                        <FieldEditor
                            key={field.id}
                            field={field}
                            index={index}
                            totalFields={config.fields.length}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

FormEditorPanel.displayName = 'FormEditorPanel';

export { FormEditorPanel };
export default FormEditorPanel;
