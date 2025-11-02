# 🚀 START HERE - Complete Setup Guide

## Current Status

✅ **Frontend**: Already running in your browser
✅ **Demo Mode**: Working with mock analysis
⏳ **Backend**: Needs to be started for ML analysis

## Two Ways to Use

### Option 1: Demo Mode (No Setup)
**Already Working!**
- Upload `sample_contract.txt`
- Get instant realistic analysis
- Explore all features
- No backend needed

### Option 2: Full ML Mode (5 Minutes Setup)
Get real ML-powered validation with flaw detection

---

## Full ML Setup (Recommended)

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**This installs:**
- Flask (web server)
- Legal-BERT (ML models)
- PyTorch (ML framework)
- File readers (PDF, DOCX)

⏱️ **Time**: 2-3 minutes

### Step 2: Start Flask Backend

```bash
python app.py
```

**You'll see:**
```
🔧 Device: cpu
📚 Loading models for legal validation...
   • Loading document classifier...
   • Loading clause analyzer...
✓ Models loaded
🔧 Training on legal flaw detection data...
✓ Training complete
🚀 Starting Flask server on http://localhost:5000
```

⏱️ **Time**: First run ~10 seconds (model download), subsequent runs ~5 seconds

### Step 3: Upload a Document

1. **Check Status**: Look for "API Connected" badge (was "Demo Mode")
2. **Upload**: Drag & drop or click to browse
3. **Analyze**: Click "Analyze Contract"
4. **Review**: See ML-powered flaw detection!

---

## What You Get with Full ML

### Advanced Features
✅ **16 Flaw Types** detected automatically
✅ **Legal-BERT** ML models for classification
✅ **Indian law** compliance (Section 27, FEMA)
✅ **4 Severity Levels**: Critical → High → Medium → Low
✅ **File Support**: .txt, .pdf, .doc, .docx

### Flaw Detection

**Critical Flaws** (Must Fix):
- Missing parties
- Missing governing law
- Missing signatures
- Incomplete terms
- Ambiguous identifiers

**High Flaws** (Should Fix):
- Invalid duration (perpetual)
- Section 27 violations
- Unsigned documents
- Unclear relationships

**Medium/Low Flaws**:
- Weak language
- Missing optional clauses
- Formatting issues

### Document Types
- Non-Disclosure Agreements (NDA)
- Employment Agreements
- Founder Agreements
- SAFE Agreements
- General Contracts

---

## File Structure

```
project/
├── backend/                    # Flask ML Backend
│   ├── app.py                 # Main server
│   ├── legal_validator.py     # ML validator
│   ├── requirements.txt       # Dependencies
│   └── README.md             # Backend docs
│
├── src/                       # React Frontend
│   ├── components/            # UI components
│   │   ├── UploadSection.tsx # File upload
│   │   ├── AnalysisResults.tsx
│   │   └── ...
│   └── services/
│       └── mockApi.ts        # Demo mode
│
├── sample_contract.txt        # Test file
├── INTEGRATION_GUIDE.md       # Integration docs
└── START_HERE.md             # This file
```

---

## Testing the Integration

### Test 1: Backend Health
```bash
curl http://localhost:5000/health
```

**Expected**:
```json
{"status": "healthy", "validator": true}
```

### Test 2: Upload via API
```bash
curl -X POST \
  -F "file=@sample_contract.txt" \
  http://localhost:5000/analyze
```

**Expected**: JSON response with validation results

### Test 3: Frontend Upload
1. Open browser (frontend already running)
2. Upload `sample_contract.txt`
3. See analysis results

---

## Common Issues & Fixes

### Issue: "ModuleNotFoundError"

**Solution**:
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Frontend shows "Demo Mode"

**Cause**: Backend not running

**Solution**:
```bash
cd backend
python app.py
```
Refresh browser → Should show "API Connected"

### Issue: "Port 5000 already in use"

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in backend/app.py:
app.run(debug=True, port=5001)
```

### Issue: PDF/DOCX files not working

**Solution**:
```bash
pip install PyPDF2 python-docx
```

### Issue: Models downloading slowly

**Cause**: Legal-BERT downloading (first run only)

**Solution**: Wait 1-2 minutes. Models cached for future use.

---

## Quick Commands Reference

```bash
# Backend
cd backend
pip install -r requirements.txt  # Install
python app.py                    # Start server

# Frontend
npm run build                    # Build for production
npm run dev                      # Development mode

# Testing
curl http://localhost:5000/health                    # Health check
curl -X POST -F "file=@test.txt" localhost:5000/analyze  # Test upload
```

---

## Sample Documents to Test

### Valid Document
Upload `sample_contract.txt` - should pass most checks

### Create Invalid Document
```text
AGREEMENT
This is a contract between someone and someone else.
They agree to do something.
```

Save as `invalid.txt` and upload → Should detect multiple flaws

---

## Performance Expectations

### First Request (Model Loading)
- Model download: ~1-2 min (first time only)
- Model loading: ~5-10 sec
- Analysis: ~2-5 sec
- **Total**: ~10-15 sec

### Subsequent Requests
- Models cached in memory
- Analysis: ~1-3 sec
- **Much faster!**

---

## What Happens Behind the Scenes

```
1. User uploads file
        ↓
2. Frontend sends to Flask (port 5000)
        ↓
3. Flask reads file content
        ↓
4. Legal-BERT models analyze document
        ↓
5. Validator detects flaws
        ↓
6. Results sent back as JSON
        ↓
7. Frontend displays beautiful analysis
```

---

## Production Deployment

### Backend
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend
```bash
npm run build
npm install -g serve
serve -s dist -p 3000
```

---

## Next Steps

1. ✅ **Now**: Start Flask backend (Step 1-2 above)
2. ✅ **Test**: Upload `sample_contract.txt`
3. ✅ **Explore**: Try different document types
4. ✅ **Review**: Check detected flaws
5. ✅ **Deploy**: Follow production guide

---

## Documentation

- **INTEGRATION_GUIDE.md**: Detailed integration docs
- **backend/README.md**: Backend API reference
- **README.md**: Project overview
- **QUICK_START.md**: Quick demo guide
- **HOW_TO_USE.md**: User guide

---

## Support

**Frontend**: Check `src/components/UploadSection.tsx`
**Backend**: Check `backend/app.py`
**ML Models**: Check `backend/legal_validator.py`

---

## Summary

| Mode | Setup Time | Features | Use Case |
|------|-----------|----------|----------|
| **Demo** | 0 min | Mock analysis | Quick exploration |
| **Full ML** | 5 min | Real ML validation | Production use |

**Recommendation**: Start with Demo to explore, then enable Full ML for real analysis.

---

Ready? Let's go! 🚀

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Then upload a document and watch the magic happen! ✨
