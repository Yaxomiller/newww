# Legal Document Validator Backend

Flask backend with ML-powered legal document validation.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python app.py
```

Server runs at `http://localhost:5000`

### 3. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Analyze a document
curl -X POST -F "file=@sample_contract.txt" http://localhost:5000/analyze
```

## API Endpoints

### GET /
Returns API information and status

### GET /health
Health check endpoint

### POST /analyze
Analyze a legal document

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: Document file (.txt, .pdf, .doc, .docx)
  - `document_type` (optional): NDA, EMPLOYMENT_AGREEMENT, FOUNDER_AGREEMENT, SAFE_AGREEMENT, GENERAL

**Response:**
```json
{
  "success": true,
  "filename": "contract.txt",
  "document_type": "NDA",
  "validation": {
    "is_compliant": false,
    "is_valid": false,
    "confidence": 0.85,
    "total_flaws": 3,
    "critical_flaws": 1,
    "high_flaws": 1,
    "medium_flaws": 1,
    "low_flaws": 0,
    "flaws": [
      {
        "flaw_type": "MISSING_GOVERNING_LAW",
        "severity": "CRITICAL",
        "location": "Document-wide",
        "description": "Document must specify governing law",
        "suggestion": "Add: 'This Agreement shall be governed by the laws of [Jurisdiction]'",
        "clause_text": ""
      }
    ]
  },
  "summary": "❌ CRITICAL: Document has 1 critical issue(s) that must be addressed.",
  "processing_time": 2.34
}
```

### GET /document-types
Returns list of supported document types

## Features

### ML-Powered Validation
- Uses Legal-BERT for document classification
- Trained on legal document patterns
- Identifies structural and semantic flaws

### Supported Document Types
- **NDA**: Non-Disclosure Agreements
- **EMPLOYMENT_AGREEMENT**: Employment Contracts
- **FOUNDER_AGREEMENT**: Founder Agreements (Indian startups)
- **SAFE_AGREEMENT**: SAFE Notes
- **GENERAL**: General contracts

### File Format Support
- `.txt` - Plain text files
- `.pdf` - PDF documents (requires PyPDF2)
- `.doc` - Word 97-2003 documents
- `.docx` - Word 2007+ documents (requires python-docx)

### Flaw Detection

**Critical Flaws:**
- Missing parties identification
- Missing effective date
- Missing governing law
- Missing signatures
- Ambiguous party identifiers
- Incomplete terms

**High Flaws:**
- Invalid duration (perpetual terms)
- Deferred material terms
- Section 27 violations (Indian Contract Act)
- Unclear party relationships

**Medium Flaws:**
- Weak obligations language
- Insufficient detail
- Missing optional clauses

**Low Flaws:**
- Minor formatting issues
- Recommended additions

## Indian Law Compliance

The validator specifically checks for:

### Section 27 - Indian Contract Act, 1872
- Detects non-compete clauses
- Flags post-termination restraints
- Warns about enforceability issues

### Founder Agreements
- Equity distribution requirements
- Vesting schedule validation
- IP assignment clauses

### SAFE Agreements
- Investment amount verification
- Valuation cap requirements
- Conversion terms validation

## Architecture

```
Flask Backend
    ↓
Legal Document Validator
    ↓
Legal-BERT Models
    ├── Document Classifier (Valid/Invalid)
    └── Clause Analyzer (Flaw Detection)
    ↓
Rule-Based Validators
    ├── Structural Requirements
    ├── Pattern Matching
    └── Semantic Analysis
    ↓
Results
```

## Models

### Document Classifier
- Base: `nlpaueb/legal-bert-base-uncased`
- Task: Binary classification (valid/invalid)
- Training: Synthetic legal documents

### Clause Analyzer
- Base: `nlpaueb/legal-bert-base-uncased`
- Task: Multi-class classification (16 flaw types)
- Training: Annotated legal clauses

## Configuration

### GPU Support
```python
# In legal_validator.py
validator = LegalDocumentValidator(use_gpu=True)
```

### Custom Requirements
Edit `legal_requirements` in `legal_validator.py` to add custom document types or clauses.

## Troubleshooting

### Import Errors
```bash
# Missing transformers
pip install transformers

# Missing torch
pip install torch

# Missing file readers
pip install python-docx PyPDF2
```

### Model Download Issues
Models are downloaded automatically on first run. Ensure internet connection.

### Memory Issues
- Use CPU instead of GPU for lower memory usage
- Reduce batch size in training
- Process documents sequentially

## Development

### Adding New Document Types

1. Edit `_define_legal_requirements()` in `legal_validator.py`:
```python
"NEW_TYPE": {
    "required_clauses": ["clause1", "clause2"],
    "optional_clauses": ["clause3"],
    "prohibited_terms": []
}
```

2. Add clause checks in `_check_structural_requirements()`:
```python
"clause1": (
    ["keyword1", "keyword2"],
    "Description",
    "Suggestion"
)
```

### Testing
```python
# Test document validation
from legal_validator import LegalDocumentValidator

validator = LegalDocumentValidator()
result = validator.validate_document(text, "NDA")
print(result)
```

## Production Deployment

### Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Environment Variables
```bash
export FLASK_ENV=production
export MAX_CONTENT_LENGTH=10485760  # 10MB
```

## License

MIT License

## Support

For issues or questions, check the main project README.
