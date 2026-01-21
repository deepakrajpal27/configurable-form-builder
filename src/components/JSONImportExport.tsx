import React, { memo, useState, useCallback } from 'react';
import { useFormBuilder } from '../context/FormBuilderContext';
import type { FormConfig } from '../types';

const JSONImportExport: React.FC = memo(() => {
    const { config, importConfig } = useFormBuilder();
    const [importValue, setImportValue] = useState('');
    const [importError, setImportError] = useState<string | null>(null);
    const [showImport, setShowImport] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const exportedJson = JSON.stringify(config, null, 2);

    const handleExport = useCallback(() => {
        navigator.clipboard.writeText(exportedJson).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    }, [exportedJson]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([exportedJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [exportedJson]);

    const validateConfig = (obj: unknown): obj is FormConfig => {
        if (!obj || typeof obj !== 'object') return false;
        if (!('fields' in obj) || !Array.isArray((obj as FormConfig).fields)) return false;

        const validateField = (field: unknown): boolean => {
            if (!field || typeof field !== 'object') return false;
            const f = field as Record<string, unknown>;

            if (typeof f.id !== 'string' || typeof f.label !== 'string') return false;
            if (typeof f.required !== 'boolean') return false;
            if (!['text', 'number', 'group'].includes(f.type as string)) return false;

            if (f.type === 'number') {
                if (f.min !== undefined && typeof f.min !== 'number') return false;
                if (f.max !== undefined && typeof f.max !== 'number') return false;
            }

            if (f.type === 'group') {
                if (!Array.isArray(f.children)) return false;
                return (f.children as unknown[]).every(validateField);
            }

            return true;
        };

        return (obj as FormConfig).fields.every(validateField);
    };

    const handleImport = useCallback(() => {
        setImportError(null);

        if (!importValue.trim()) {
            setImportError('Please enter JSON configuration');
            return;
        }

        try {
            const parsed = JSON.parse(importValue);

            if (!validateConfig(parsed)) {
                setImportError('Invalid form configuration structure');
                return;
            }

            importConfig(parsed);
            setImportValue('');
            setShowImport(false);
            setImportError(null);
        } catch {
            setImportError('Invalid JSON format');
        }
    }, [importValue, importConfig]);

    const handleImportValueChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setImportValue(e.target.value);
            setImportError(null);
        },
        []
    );

    return (
        <div className="json-import-export">
            <div className="export-section">
                <h3>Export Configuration</h3>
                <div className="export-preview">
                    <pre>{exportedJson}</pre>
                </div>
                <div className="export-actions">
                    <button onClick={handleExport} className="btn btn-primary">
                        {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button onClick={handleDownload} className="btn">
                        Download JSON
                    </button>
                </div>
            </div>

            <div className="import-section">
                <h3>Import Configuration</h3>
                {!showImport ? (
                    <button onClick={() => setShowImport(true)} className="btn">
                        Import from JSON
                    </button>
                ) : (
                    <div className="import-form">
                        <textarea
                            value={importValue}
                            onChange={handleImportValueChange}
                            placeholder='Paste your JSON configuration here...'
                            className={`import-textarea ${importError ? 'input-error' : ''}`}
                            rows={10}
                        />
                        {importError && <span className="error-message">{importError}</span>}
                        <div className="import-actions">
                            <button onClick={handleImport} className="btn btn-primary">
                                Import
                            </button>
                            <button
                                onClick={() => {
                                    setShowImport(false);
                                    setImportValue('');
                                    setImportError(null);
                                }}
                                className="btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

JSONImportExport.displayName = 'JSONImportExport';

export default JSONImportExport;
