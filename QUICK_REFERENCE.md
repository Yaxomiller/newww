# Quick Reference Card

## 🚀 Instant Start (30 seconds)

```bash
# 1. Start Flask backend
cd backend
python app.py

# 2. Frontend already running
# Open browser and upload document!
```

## 📋 Common Commands

```bash
# Backend
cd backend
pip install -r requirements.txt    # Install deps
python app.py                      # Start server

# Test
curl http://localhost:5000/health  # Health check
```

## 📁 File Structure

```
backend/
├── app.py              # Flask server
├── legal_validator.py  # ML validator
└── requirements.txt    # Dependencies

src/components/
├── UploadSection.tsx   # Upload + integration
├── AnalysisResults.tsx # Results display
└── [8 more components]
```

## 🎯 Endpoints

```
GET  /health           → {"status": "healthy"}
POST /analyze          → Upload file, get analysis
GET  /document-types   → Supported types
```

## 📊 Document Types

- NDA
- EMPLOYMENT_AGREEMENT
- FOUNDER_AGREEMENT
- SAFE_AGREEMENT
- GENERAL

## ⚠️ Flaw Severities

- 🔴 CRITICAL: Must fix
- 🟠 HIGH: Should fix
- 🟡 MEDIUM: Review
- 🟢 LOW: Minor

## 🔍 Key Checks

- Missing parties ✓
- Missing governing law ✓
- Section 27 violations ✓
- Invalid terms ✓
- Incomplete clauses ✓

## 📄 File Support

- .txt ✓
- .pdf ✓ (needs PyPDF2)
- .doc ✓
- .docx ✓ (needs python-docx)

## 🐛 Troubleshooting

**Demo Mode stuck?**
→ Start Flask backend (see above)

**Module not found?**
→ `pip install -r requirements.txt`

**Port 5000 in use?**
→ Kill process or change port in app.py

## 📖 Docs

- START_HERE.md → Setup guide
- INTEGRATION_GUIDE.md → Technical details
- FINAL_SUMMARY.md → Complete overview

## 🎉 Success!

Upload `sample_contract.txt` and see the magic! ✨
