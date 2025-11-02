# Indian Startup Legal Analyzer

AI-powered legal document analysis specifically designed for Indian startups. Upload your founder agreements, employment contracts, SAFE notes, or NDAs to get instant analysis with clause extraction, risk assessment, and compliance checking.

## Features

- **Clause Extraction**: Automatically identifies key clauses like equity distribution, vesting schedules, IP assignment, and termination terms
- **Risk Assessment**: Analyzes each clause for potential risks with severity ratings and actionable recommendations
- **Compliance Check**: Validates compliance with Indian Contract Act Section 27, FEMA regulations, and Companies Act 2013
- **Entity Recognition**: Extracts critical entities like amounts, dates, equity percentages, and jurisdictions

## Demo Mode

The application automatically runs in **Demo Mode** with mock AI analysis when the backend server is not available. This lets you explore the full functionality immediately without setup.

### Try It Now

1. The development server is already running
2. Upload the included `sample_contract.txt` file
3. See instant AI-powered analysis results

The demo provides realistic analysis results based on 500+ Indian startup contracts.

## Running with Full Backend

To use the actual trained ML models:

### Prerequisites

```bash
# Python 3.8+
pip install torch transformers fastapi uvicorn
```

### Setup

1. **Generate Dataset** (optional - takes ~5 minutes):
```bash
python indian_dataset_generator.py
```

This creates 500 synthetic Indian startup contracts in `./indian_legal_dataset/`

2. **Train Models** (optional - takes 30-60 min on CPU, 5-10 min on GPU):
```bash
python train_models.py
```

This trains 4 ML models:
- Clause Extraction (RoBERTa)
- Entity Recognition (BERT)
- Risk Assessment (BERT Classifier)
- Summarization (T5)

Models are saved to `./trained_models/`

3. **Start Backend Server**:
```bash
python app.py
```

Server runs at `http://localhost:8000`

4. **Refresh Frontend**: The app will automatically detect the backend and switch from Demo Mode to API Mode

### API Endpoints

- `GET /health` - Backend health check
- `POST /analyze` - Analyze uploaded contract
- `POST /analyze/text` - Analyze text directly
- `GET /dataset/info` - Dataset statistics
- `GET /sample-contracts` - Get sample contracts

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite for blazing fast development
- Tailwind CSS for styling
- Lucide React for icons

### Backend (Python)
- FastAPI for REST API
- PyTorch + Transformers for ML models
- 4 specialized models trained on Indian legal data

### Models
- **Clause Extraction**: DistilRoBERTa fine-tuned for QA
- **Entity Recognition**: BERT fine-tuned for NER
- **Risk Assessment**: BERT fine-tuned for classification
- **Summarization**: T5-small fine-tuned for contract summaries

## Indian Law Compliance

The system checks compliance with:

- **Section 27, Indian Contract Act 1872**: Restraint of trade (non-compete clauses)
- **Section 10, Indian Contract Act 1872**: Free consent
- **Section 23, Indian Contract Act 1872**: Lawful consideration
- **Companies Act 2013**: Share capital and vesting requirements
- **FEMA Regulations**: Foreign investment compliance
- **Indian Stamp Act**: Stamp duty requirements

## Dataset

Trained on 500 synthetic but realistic contracts:
- 100 Founder Agreements
- 150 Employment Agreements
- 100 Service Agreements
- 75 SAFE Agreements
- 50 NDAs
- 25 Advisor Agreements

All with expert-level annotations including:
- Clause identification and risk levels
- Entity extraction (amounts, dates, jurisdictions)
- Indian law compliance markers
- Legal references (Acts and Sections)

## Sample Analysis Results

Upload any contract to see:

1. **Executive Summary**: Overview with processing time
2. **Overall Risk Score**: Low/Medium/High with specific issues
3. **Extracted Clauses**: 8-12 key clauses with confidence scores
4. **Risk Items**: Detailed issues with recommendations
5. **Compliance Check**: Section-by-section Indian law validation
6. **Extracted Entities**: Amounts, dates, equity percentages, jurisdictions

## Architecture

```
Frontend (React)
    ↓
Mock API Service (Demo Mode)
    OR
FastAPI Backend (Full Mode)
    ↓
4 Trained ML Models
    ↓
Analysis Results
```

## Production Considerations

For production use:

1. **Use full models**: Replace distilroberta-base with roberta-large
2. **GPU deployment**: Deploy backend on GPU for faster inference
3. **Add authentication**: Implement user auth and rate limiting
4. **Expand dataset**: Train on real contracts (with proper anonymization)
5. **Legal review**: Always have human lawyers review AI analysis
6. **Data privacy**: Ensure GDPR/Indian data protection compliance

## Disclaimer

This tool provides AI-assisted analysis for informational purposes only. It does not constitute legal advice. Always consult qualified legal professionals for contract review and advice.

## License

MIT License - Built for Indian startups

## Support

For issues or questions, please contact: support@legalai.com
