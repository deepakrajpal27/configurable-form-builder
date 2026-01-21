import React, { memo } from 'react';
import type { GroupField, FieldType } from '../types';
import { FieldEditor } from './FieldEditor';

interface GroupEditorProps {
    groupField: GroupField;
    onAddField: (type: FieldType) => void;
    depth: number;
}

const GroupEditor: React.FC<GroupEditorProps> = memo(({ groupField, onAddField, depth }) => {
    return (
        <div className="group-editor">
            <div className="group-children-header">
                <span className="group-label">Child Fields ({groupField.children.length})</span>
                <div className="add-field-buttons">
                    <button
                        onClick={() => onAddField('text')}
                        className="btn btn-small btn-primary"
                    >
                        + Text
                    </button>
                    <button
                        onClick={() => onAddField('number')}
                        className="btn btn-small btn-primary"
                    >
                        + Number
                    </button>
                    <button
                        onClick={() => onAddField('group')}
                        className="btn btn-small btn-primary"
                    >
                        + Group
                    </button>
                </div>
            </div>

            <div className="group-children">
                {groupField.children.length === 0 ? (
                    <div className="empty-group">No fields in this group. Add some above!</div>
                ) : (
                    groupField.children.map((child, index) => (
                        <FieldEditor
                            key={child.id}
                            field={child}
                            index={index}
                            totalFields={groupField.children.length}
                            depth={depth}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

GroupEditor.displayName = 'GroupEditor';

export { GroupEditor };
export default GroupEditor;
