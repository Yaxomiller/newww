# Integration Guide - Flask Backend + React Frontend

This guide explains how to run the complete system with ML-powered legal document validation.

## Quick Start (3 Steps)

### Step 1: Start the Flask Backend

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

Server starts at `http://localhost:5000`

### Step 2: Frontend is Already Running

The React frontend is already running in development mode and will automatically detect the Flask backend.

### Step 3: Upload a Document

1. Look for the status badge to change from **"Demo Mode"** to **"API Connected"**
2. Upload any legal document (.txt, .pdf, .doc, .docx)
3. Get ML-powered analysis with flaw detection

## System Architecture

```
React Frontend (Port 3000/5173)
        ↓
    HTTP Request
        ↓
Flask Backend (Port 5000)
        ↓
Legal Document Validator
        ↓
Legal-BERT ML Models
        ↓
Analysis Results
        ↓
    JSON Response
        ↓
React Frontend Display
```

## Backend Features

### ML-Powered Validation
- **Legal-BERT** models for document classification
- **16 flaw types** detection
- **4 severity levels**: Critical, High, Medium, Low
- **Indian law compliance** checking

### Supported File Types
- `.txt` - Plain text
- `.pdf` - PDF documents
- `.doc` - Word 97-2003
- `.docx` - Word 2007+

### Document Types
- **NDA** - Non-Disclosure Agreements
- **EMPLOYMENT_AGREEMENT** - Employment Contracts
- **FOUNDER_AGREEMENT** - Founder Agreements
- **SAFE_AGREEMENT** - SAFE Notes
- **GENERAL** - General Contracts

## API Integration

### Frontend → Backend Flow

1. **Health Check** (on page load):
```typescript
fetch('http://localhost:5000/health')
```

2. **File Upload**:
```typescript
const formData = new FormData();
formData.append('file', file);

fetch('http://localhost:5000/analyze', {
  method: 'POST',
  body: formData
})
```

3. **Response Handling**:
```typescript
const result = await response.json();
// result.validation contains flaw detection
// result.summary contains human-readable summary
```

### Response Format

```json
{
  "success": true,
  "filename": "contract.txt",
  "document_type": "FOUNDER_AGREEMENT",
  "validation": {
    "is_compliant": false,
    "is_valid": false,
    "confidence": 0.85,
    "total_flaws": 5,
    "critical_flaws": 2,
    "high_flaws": 1,
    "medium_flaws": 2,
    "low_flaws": 0,
    "flaws": [
      {
        "flaw_type": "MISSING_GOVERNING_LAW",
        "severity": "CRITICAL",
        "location": "Document-wide",
        "description": "Document must specify governing law",
        "suggestion": "Add: 'Governed by laws of [Jurisdiction]'",
        "clause_text": ""
      }
    ]
  },
  "summary": "❌ CRITICAL: Document has 2 critical issues",
  "processing_time": 2.1
}
```

## Flaw Detection Categories

### Critical Flaws (Must Fix)
- Missing parties identification
- Missing effective date
- Missing governing law
- Missing signatures
- Ambiguous party names
- Incomplete terms (TBD, blanks)

### High Flaws (Should Fix)
- Invalid duration (perpetual)
- Deferred material terms
- Section 27 violations (non-compete)
- Unsigned documents
- Unclear relationships

### Medium Flaws (Review)
- Weak obligation language (may, might)
- Insufficient detail
- Missing recommended clauses

### Low Flaws (Minor)
- Formatting issues
- Optional improvements

## Indian Law Compliance

### Section 27 Detection
The system automatically detects non-compete clauses that violate Section 27 of the Indian Contract Act, 1872:

```python
if "section 27" in text and "non-compete" in text:
    # Flag as CRITICAL violation
```

### Founder Agreement Validation
- Equity distribution requirements
- Vesting schedule validation
- IP assignment clauses
- Stamp duty compliance

### SAFE Agreement Validation
- Investment amount verification
- Valuation cap requirements
- FEMA compliance
- Conversion terms

## Fallback Mode

If ML models fail to load, the system uses rule-based validation:

- Pattern matching for required clauses
- Keyword detection
- Basic structural validation
- Still provides useful feedback

## Troubleshooting

### Backend Won't Start

**Issue**: `ModuleNotFoundError: No module named 'torch'`

**Solution**:
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Shows "Demo Mode"

**Cause**: Flask backend not running

**Solution**:
```bash
cd backend
python app.py
```

Refresh frontend - badge should change to "API Connected"

### File Upload Fails

**Issue**: "Could not read file content"

**Solutions**:
- For PDF: `pip install PyPDF2`
- For DOCX: `pip install python-docx`
- Check file is not corrupted
- Verify file size < 5MB

### Model Download Slow

**Cause**: Legal-BERT models downloading on first run

**Solution**: Wait for download to complete (1-2 minutes). Models cached for future use.

## Development

### Adding Custom Validation Rules

Edit `backend/legal_validator.py`:

```python
def _define_legal_requirements(self):
    return {
        "YOUR_DOC_TYPE": {
            "required_clauses": [
                "your_clause_1",
                "your_clause_2"
            ],
            "optional_clauses": [],
            "prohibited_terms": []
        }
    }
```

### Testing Backend Directly

```bash
# Test with curl
curl -X POST \
  -F "file=@sample_contract.txt" \
  -F "document_type=NDA" \
  http://localhost:5000/analyze
```

### Frontend Development

The frontend automatically tries Flask (port 5000) first, then FastAPI (port 8000), then falls back to demo mode.

Edit `src/components/UploadSection.tsx` to modify this behavior.

## Performance

### First Request
- Model loading: 5-10 seconds
- Document analysis: 2-5 seconds
- Total: ~10-15 seconds

### Subsequent Requests
- Models cached in memory
- Analysis: 1-3 seconds
- Much faster!

### Optimization Tips

**Use GPU** (if available):
```python
validator = LegalDocumentValidator(use_gpu=True)
```

**Reduce Training Epochs** (faster startup):
```python
# In _train_on_legal_data()
num_train_epochs=2  # Down from 5
```

**Deploy with Gunicorn** (production):
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Production Deployment

### Backend (Flask)

1. **Install production server**:
```bash
pip install gunicorn
```

2. **Run with Gunicorn**:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

3. **Environment variables**:
```bash
export FLASK_ENV=production
export MAX_CONTENT_LENGTH=10485760
```

### Frontend (React)

1. **Build**:
```bash
npm run build
```

2. **Serve**:
```bash
npm install -g serve
serve -s dist -p 3000
```

### Docker Deployment

**Backend Dockerfile**:
```dockerfile
FROM python:3.9
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "3000"]
```

## Security Considerations

### File Upload
- Max size: 5MB (configurable)
- Allowed types: .txt, .pdf, .doc, .docx
- Files stored temporarily and deleted after processing

### CORS
- Enabled for development
- Restrict origins in production:
```python
CORS(app, origins=['https://yourdomain.com'])
```

### Input Validation
- File type checking
- Size limits enforced
- Content sanitization

## Support

**Frontend Issues**: Check `src/components/UploadSection.tsx`

**Backend Issues**: Check `backend/app.py` and `backend/legal_validator.py`

**Integration Issues**: Verify both servers running and CORS enabled

## Next Steps

1. ✅ Start Flask backend
2. ✅ Upload a document
3. ✅ See ML-powered analysis
4. ✅ Review detected flaws
5. ✅ Fix critical issues
6. ✅ Deploy to production

Happy analyzing! 🚀
