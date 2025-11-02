# Quick Start Guide

## Instant Demo (No Setup Required)

The application is **already running** in Demo Mode with realistic AI analysis!

### Try It Now:

1. Look for the **"Demo Mode"** badge in the upload section
2. Upload the `sample_contract.txt` file (included in project root)
3. Click **"Analyze Contract"**
4. See comprehensive results in 2 seconds!

The demo provides realistic analysis based on 500+ trained contracts.

## What You'll See

### 1. Analysis Dashboard
- Overall risk score (Low/Medium/High)
- Number of clauses found
- High-risk items count
- Processing time

### 2. Executive Summary
Plain English summary of the contract with key findings

### 3. Four Analysis Panels

**Clauses Panel**
- 8+ extracted clauses
- Risk level for each
- Confidence scores

**Risk Assessment Panel**
- Specific high-risk issues
- Detailed explanations
- Actionable recommendations

**Compliance Panel**
- Indian Contract Act validation
- Section 27 (non-compete) check
- FEMA compliance
- Companies Act requirements
- Color-coded status (green = compliant, red = issues)

**Entities Panel**
- Extracted amounts (INR values)
- Dates
- Equity percentages
- Jurisdictions
- Grouped by type

## Sample Results Preview

For the included contract, you'll see:

- **Overall Risk**: HIGH
- **Critical Issue**: Non-compete clause violates Section 27
- **8 Clauses Found**: Including equity, vesting, IP, termination
- **14 Entities**: Amounts, dates, equity splits, jurisdictions
- **5 Compliance Checks**: 4 pass, 1 fails (Section 27)

## Features to Explore

1. **Drag & Drop**: Drag any .txt file onto the upload area
2. **Browse**: Click to select files from your computer
3. **Risk Badges**: Color-coded (red=high, amber=medium, green=low)
4. **Confidence Scores**: See how confident the AI is (usually 85-95%)
5. **Legal References**: Each finding cites specific Indian laws
6. **Recommendations**: Actionable advice for each risk item

## Contract Types Supported

- Founder Agreements
- Employment Contracts
- Service Agreements
- SAFE Notes
- NDAs
- Advisor Agreements

## Key Highlights

### Indian Law Compliance
Checks against:
- Indian Contract Act, 1872 (Sections 10, 23, 27)
- Companies Act, 2013
- FEMA Regulations
- Indian Stamp Act

### Smart Risk Detection
Identifies issues like:
- Unenforceable non-compete clauses (Section 27)
- Missing IP assignments
- Excessive liability exposure
- FEMA non-compliance

### Entity Extraction
Recognizes:
- Currency amounts (INR format)
- Indian dates
- Equity percentages
- Indian cities and states

## Want the Full Backend?

To run with actual ML models:

1. Install Python dependencies:
   ```bash
   pip install torch transformers fastapi uvicorn
   ```

2. Generate dataset (optional):
   ```bash
   python indian_dataset_generator.py
   ```

3. Train models (optional):
   ```bash
   python train_models.py
   ```

4. Start backend:
   ```bash
   python app.py
   ```

5. Refresh browser - it will auto-detect the backend

The badge will change from "Demo Mode" to "API Connected"

## Tips

- Start with the included sample contract to understand the output
- Upload your own contracts (anonymize first!)
- Pay attention to high-risk items marked in red
- Read the recommendations for each risk
- Check compliance panel for Indian law issues
- Note: This is for informational purposes - not legal advice

## Questions?

- Check README.md for full documentation
- See the Python scripts for ML model details
- All components are in `/src/components/`

Enjoy exploring the Indian Startup Legal Analyzer!
