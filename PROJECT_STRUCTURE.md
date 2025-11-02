# Project Structure

## Frontend (React + TypeScript)

```
src/
├── App.tsx                          # Main app with state management
├── main.tsx                         # Entry point
├── index.css                        # Global styles (Tailwind)
│
├── components/                      # All UI components
│   ├── Header.tsx                   # Navigation header with logo
│   ├── Hero.tsx                     # Landing page hero section
│   ├── Features.tsx                 # Feature showcase grid
│   ├── UploadSection.tsx            # File upload with drag-drop
│   ├── AnalysisResults.tsx          # Main results dashboard
│   ├── ClausesPanel.tsx             # Extracted clauses display
│   ├── RiskPanel.tsx                # Risk assessment display
│   ├── CompliancePanel.tsx          # Indian law compliance
│   ├── EntitiesPanel.tsx            # Extracted entities display
│   └── Footer.tsx                   # Site footer
│
└── services/
    └── mockApi.ts                   # Demo mode mock API

## Backend (Python - Not in this repo)

```
indian_dataset_generator.py         # Generate 500 synthetic contracts
train_models.py                      # Train 4 ML models
app.py                              # FastAPI backend server
```

## Key Features by Component

### Header.tsx
- Sticky navigation
- Gradient logo
- GitHub link
- Smooth scrolling

### Hero.tsx
- Eye-catching headline
- Feature badges
- Call-to-action button
- Gradient text effects

### Features.tsx
- 4 feature cards
- Icon gradients
- Hover animations
- Clean grid layout

### UploadSection.tsx
- Drag and drop
- File validation
- Backend status indicator (Demo Mode / API Connected)
- Loading states
- Error handling

### AnalysisResults.tsx
- Executive summary
- Key metrics dashboard
- Overall risk visualization
- Processing time
- Reset functionality

### ClausesPanel.tsx
- Clause cards with risk badges
- Confidence scores with progress bars
- Color-coded risk levels
- Truncated text with ellipsis

### RiskPanel.tsx
- High-risk items only
- Red alert styling
- Issue descriptions
- Actionable recommendations

### CompliancePanel.tsx
- Indian law sections
- Pass/fail indicators
- Warning messages
- Action items
- Green/red/amber color coding

### EntitiesPanel.tsx
- Grouped by entity type
- Color-coded badges
- Icons per type (money, calendar, location)
- Confidence percentages

## Sample Files

```
sample_contract.txt                  # Demo founder agreement
README.md                           # Full documentation
QUICK_START.md                      # Instant start guide
PROJECT_STRUCTURE.md                # This file
```

## Technology Highlights

### Styling
- Tailwind CSS with custom gradients
- Blue/cyan professional theme
- Hover animations
- Smooth transitions
- Responsive breakpoints

### State Management
- React useState hooks
- Props drilling for simplicity
- TypeScript interfaces for type safety

### API Integration
- Automatic backend detection
- Fallback to mock data
- Graceful error handling
- CORS support

### Icons
- Lucide React
- Consistent 4-5px sizing
- Color-matched to theme

## Color Palette

### Primary
- Blue: #2563eb (blue-600)
- Cyan: #0891b2 (cyan-600)
- Gradient: blue-600 → cyan-600

### Status Colors
- High Risk: red-600
- Medium Risk: amber-600
- Low Risk: green-600
- Compliant: emerald-600
- Non-compliant: red-600

### Neutrals
- Background: slate-50, blue-50
- Text: slate-900, slate-700, slate-600
- Borders: slate-200

## Build Output

```
dist/
├── index.html                       # Single page app
├── assets/
│   ├── index-*.css                 # Minified styles (~23KB)
│   └── index-*.js                  # Minified app (~183KB)
```

## Development Workflow

1. Edit components in `src/components/`
2. Hot reload shows changes instantly
3. TypeScript catches errors
4. Tailwind processes styles
5. Build for production with `npm run build`

## Key TypeScript Interfaces

```typescript
AnalysisResult {
  success: boolean
  filename: string
  clauses: Clause[]
  entities: Entity[]
  risk_assessment: RiskAssessment
  compliance: Compliance
  summary: string
  processing_time: number
}
```

## Component Hierarchy

```
App
├── Header
├── Hero (conditional)
├── Features (conditional)
├── UploadSection
│   └── mockApi service
└── AnalysisResults (conditional)
    ├── ClausesPanel
    ├── RiskPanel
    ├── CompliancePanel
    └── EntitiesPanel
└── Footer
```

## Responsive Design

- Mobile: Single column, stacked panels
- Tablet: 1-2 columns
- Desktop: 2 column grid for panels
- All breakpoints tested

## Performance

- Initial load: ~200KB gzipped
- Analysis: 2 seconds (mock), variable (real API)
- Build time: ~4 seconds
- Hot reload: <1 second

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅
