import React, { memo } from 'react';
import type { LayoutToggleProps } from '../types';

const LayoutToggle: React.FC<LayoutToggleProps> = memo(({ mode, onChange }) => {
    return (
        <div className="layout-toggle">
            <span className="layout-toggle-label">Layout:</span>
            <div className="toggle-switch">
                <button
                    className={`toggle-option ${mode === 'tabs' ? 'active' : ''}`}
                    onClick={() => onChange('tabs')}
                    title="Tab Layout"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                    </svg>
                </button>
                <button
                    className={`toggle-option ${mode === 'split' ? 'active' : ''}`}
                    onClick={() => onChange('split')}
                    title="Split Layout"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                    </svg>
                </button>
            </div>
        </div>
    );
});

LayoutToggle.displayName = 'LayoutToggle';

export { LayoutToggle };
export default LayoutToggle;
