# Configurable Form Builder

A React application that allows users to visually build forms, configure fields, nest groups recursively, preview the live form, and export/import the configuration as JSON.

## Features

- **Visual Form Builder**: Drag-free interface with add, delete, and reorder buttons
- **Supported Field Types**:
  - `text` - Text input fields
  - `number` - Numeric input fields with optional min/max constraints
  - `group` - Container for nested fields (supports infinite nesting)
- **Field Properties**:
  - Label (string)
  - Required (boolean)
  - Min/Max (number fields only)
- **Live Preview**: Real-time form preview with validation
- **Persistent Preview State**: Form values persist when switching between tabs
- **Import/Export**: Full JSON configuration support
- **Dual Layout Modes**:
  - **Split View**: Editor/Import-Export on left, live preview always visible on right
  - **Tab View**: Traditional 3-tab layout (Editor, Preview, Import/Export)
- **Layout Toggle**: Switch between split and tab layouts with a single click

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── FieldEditor.tsx      # Individual field editor
│   ├── FormEditorPanel.tsx  # Main form editor panel with add buttons
│   ├── FormPreview.tsx      # Live form preview with validation
│   ├── GroupEditor.tsx      # Group/nested fields editor
│   ├── JSONImportExport.tsx # JSON import/export functionality
│   ├── LayoutToggle.tsx     # Toggle between split/tab layouts
│   └── index.ts             # Component exports
├── context/
│   └── FormBuilderContext.tsx # Form state management (config + preview state)
├── types/
│   └── index.ts             # TypeScript interfaces and types
├── App.tsx                  # Main application with layout switching
├── App.css                  # Styles
└── main.tsx                 # Entry point
```

## Technical Details

- Built with React 19 + TypeScript
- Vite for fast development and building
- No external state management libraries (uses React Context API)
- No form libraries (custom implementation)
- No UI frameworks (custom CSS)
- Optimized with `useMemo`, `useCallback`, and `memo`
- Immutable state updates
- Recursive rendering for nested groups
- Responsive design with mobile support

## Usage

1. **Choose Layout**: Use the toggle in the header to switch between split view and tab view
2. **Add Fields**: Click "+ Text Field", "+ Number Field", or "+ Group" to add fields
3. **Configure Fields**: Edit labels, set required status, and configure min/max for numbers
4. **Nest Groups**: Add fields inside groups for complex form structures
5. **Reorder**: Use ↑ and ↓ buttons to reorder fields within the same level
6. **Preview**: In split view, preview is always visible; in tab view, switch to "Preview" tab
7. **Export**: Go to "Import/Export" tab to copy or download the JSON configuration
8. **Import**: Paste valid JSON configuration to rebuild the form structure

## Example JSON Configuration

```json
{
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Name",
      "required": true
    },
    {
      "id": "field_2",
      "type": "number",
      "label": "Age",
      "required": false,
      "min": 0,
      "max": 150
    },
    {
      "id": "field_3",
      "type": "group",
      "label": "Address",
      "required": false,
      "children": [
        {
          "id": "field_4",
          "type": "text",
          "label": "Street",
          "required": true
        },
        {
          "id": "field_5",
          "type": "text",
          "label": "City",
          "required": true
        }
      ]
    }
  ]
}
```

## License

MIT
