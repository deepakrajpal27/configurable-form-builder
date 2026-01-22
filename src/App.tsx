import React, { useState } from 'react';
import { FormBuilderProvider } from './context/FormBuilderContext';
import { FormEditorPanel, FormPreview, JSONImportExport, LayoutToggle } from './components';
import type { LeftTab, Tab, LayoutMode } from './types';
import './App.css';

const ConfigurableFormBuilder: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [activeLeftTab, setActiveLeftTab] = useState<LeftTab>('editor');
  const [activeTab, setActiveTab] = useState<Tab>('editor');

  if (layoutMode === 'tabs') {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div>
              <h1>Configurable Form Builder</h1>
              <p>Build, preview, and export custom forms</p>
            </div>
            <LayoutToggle mode={layoutMode} onChange={setLayoutMode} />
          </div>
        </header>

        <nav className="tab-nav">
          <button
            className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`tab-button ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            Import/Export
          </button>
        </nav>

        <main className="main-content">
          {activeTab === 'editor' && <FormEditorPanel />}
          {activeTab === 'preview' && (
            <div className="preview-panel">
              <div className="panel-header">
                <h2>Live Preview</h2>
              </div>
              <FormPreview />
            </div>
          )}
          {activeTab === 'json' && (
            <div className="json-panel">
              <div className="panel-header">
                <h2>Import / Export</h2>
              </div>
              <JSONImportExport />
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Configurable Form Builder</h1>
            <p>Build, preview, and export custom forms</p>
          </div>
          <LayoutToggle mode={layoutMode} onChange={setLayoutMode} />
        </div>
      </header>

      <div className="split-layout">
        <div className="left-panel">
          <nav className="tab-nav">
            <button
              className={`tab-button ${activeLeftTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveLeftTab('editor')}
            >
              Editor
            </button>
            <button
              className={`tab-button ${activeLeftTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveLeftTab('json')}
            >
              Import/Export
            </button>
          </nav>

          <div className="panel-content">
            {activeLeftTab === 'editor' && <FormEditorPanel />}
            {activeLeftTab === 'json' && (
              <div className="json-panel">
                <div className="panel-header">
                  <h2>Import / Export</h2>
                </div>
                <JSONImportExport />
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="panel-content">
            <div className="preview-panel">
              <div className="panel-header">
                <h2>Live Preview</h2>
              </div>
              <FormPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <FormBuilderProvider>
      <ConfigurableFormBuilder />
    </FormBuilderProvider>
  );
};

export default App;
