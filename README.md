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
- **Import/Export**: Full JSON configuration support

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
│   ├── GroupEditor.tsx      # Group/nested fields editor
│   ├── FormPreview.tsx      # Live form preview
│   ├── JSONImportExport.tsx # JSON import/export
│   └── index.ts             # Component exports
├── context/
│   └── FormBuilderContext.tsx # Form state management
├── types/
│   └── index.ts             # TypeScript interfaces
├── App.tsx                  # Main application
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

## Usage

1. **Add Fields**: Click "+ Text Field", "+ Number Field", or "+ Group" to add fields
2. **Configure Fields**: Edit labels, set required status, and configure min/max for numbers
3. **Nest Groups**: Add fields inside groups for complex form structures
4. **Reorder**: Use ↑ and ↓ buttons to reorder fields within the same level
5. **Preview**: Switch to "Preview" tab to see and interact with the live form
6. **Export**: Go to "Import/Export" tab to copy or download the JSON configuration
7. **Import**: Paste valid JSON configuration to rebuild the form structure

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
