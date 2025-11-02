# 🔥 Real ML Integration - Setup Instructions

## The Problem You Had

**Before**: Every document showed the same mock results because it was using demo mode.

**Now**: Each document gets analyzed by Legal-BERT ML models and shows REAL, DIFFERENT results!

---

## Quick Setup (3 Commands)

### Terminal 1: Start Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

⏱️ Wait for: `"Running on http://127.0.0.1:5000"`

### Terminal 2: Frontend (Already Running)

The frontend is already running. Just refresh your browser!

### Upload & Test

1. Upload `sample_contract.txt`
2. Check browser console (F12) for: `"✓ Flask backend responded"`
3. Upload a different document
4. **Results should be DIFFERENT!**

---

## What Changed

### Before (Demo Mode)
```
User uploads file
      ↓
mockApi.ts returns SAME results every time
      ↓
No real ML analysis
```

### After (Real ML)
```
User uploads file
      ↓
Flask backend (port 5000)
      ↓
Legal-BERT analyzes ACTUAL document content
      ↓
Returns SPECIFIC flaws for THAT document
      ↓
Different documents = Different results!
```

---

## How to Verify It's Working

### Check 1: Backend Status Badge

**Demo Mode:** 🟡 Yellow badge saying "Demo Mode"
**Connected:** 🟢 Green badge saying "API Connected"

### Check 2: Browser Console

Open console (F12) and upload a file. You should see:

```
Attempting Flask backend at localhost:5000...
✓ Flask backend responded
Converting Flask result to frontend format
Flask result: {success: true, validation: {...}}
```

### Check 3: Different Results

Upload these two files:

**File 1: sample_contract.txt**
- Should show specific flaws from that contract
- May show Section 27 warning

**File 2: Create test.txt:**
```
AGREEMENT
Someone agrees to something
```

- Should show: MISSING_PARTIES, MISSING_GOVERNING_LAW, etc.
- Different flaws than sample_contract.txt!

---

## Test Documents

### Invalid Document (Many Flaws)

Create `invalid.txt`:
```
CONTRACT

This is between someone and someone else.
They agree to do something for some amount.
Starts now, continues forever.
```

**Expected Results:**
- 🔴 Critical: Missing parties, Missing governing law, Missing signatures
- 🟠 High: Invalid duration (perpetual)
- 🟡 Medium: Incomplete terms, Weak language
- **Overall Risk: HIGH**
- **Summary: "❌ CRITICAL: Document has X critical issue(s)"**

### Valid Document (Few Flaws)

Create `valid.txt`:
```
NON-DISCLOSURE AGREEMENT

This Agreement is entered into on January 15, 2025, between:
- TechCorp Inc. (Disclosing Party)
- John Smith (Receiving Party)

1. CONFIDENTIAL INFORMATION
Confidential Information includes trade secrets and customer data.

2. OBLIGATIONS
The Receiving Party shall maintain confidentiality.

3. TERM
This Agreement remains in effect for three (3) years.

4. GOVERNING LAW
Governed by the laws of California.

5. SIGNATURES
Executed by both parties.

________________    ________________
TechCorp Inc.       John Smith
```

**Expected Results:**
- ✅ Few or zero critical flaws
- **Overall Risk: LOW**
- **Summary: "Document appears compliant"**

---

## Debugging

### Problem: Still shows "Demo Mode"

**Solution:**
1. Check Flask is running: `curl http://localhost:5000/health`
2. Should return: `{"status": "healthy", "validator": true}`
3. If not, start Flask backend

### Problem: Same results for all documents

**Cause:** Backend not connected

**Fix:**
1. Open browser console (F12)
2. Upload file
3. Look for "Flask backend unavailable"
4. Start Flask backend

### Problem: Flask won't start

**Error:** `ModuleNotFoundError: No module named 'torch'`

**Fix:**
```bash
cd backend
pip install -r requirements.txt
```

**Error:** `Port 5000 already in use`

**Fix:**
```bash
lsof -i :5000
kill -9 <PID>
```

---

## Flask Backend Output

When working correctly, Flask terminal shows:

```
📁 Processing file: invalid.txt
📄 Validating GENERAL document...
📏 Length: 156 characters
✓ Validation complete: 5 issues found
127.0.0.1 - - [02/Nov/2025] "POST /analyze HTTP/1.1" 200 -
```

**Each document shows DIFFERENT character counts and flaw counts!**

---

## Integration Flow

```
1. User uploads file in browser
        ↓
2. Frontend calls: http://localhost:5000/analyze
        ↓
3. Flask receives file
        ↓
4. legal_validator.py reads content
        ↓
5. Legal-BERT models analyze
        ↓
6. Detects ACTUAL flaws in THAT document
        ↓
7. Returns JSON with specific flaws
        ↓
8. Frontend converts and displays
        ↓
9. User sees REAL analysis!
```

---

## Verification Checklist

Run through this checklist:

- [ ] Flask backend started (terminal shows "Running on...")
- [ ] Health check passes: `curl http://localhost:5000/health`
- [ ] Browser badge shows "API Connected" (not "Demo Mode")
- [ ] Console shows "✓ Flask backend responded"
- [ ] Upload sample_contract.txt → see results
- [ ] Upload different file → see DIFFERENT results
- [ ] Check Flask terminal → see processing logs
- [ ] All documents analyzed individually

---

## Quick Test

```bash
# Terminal 1: Start backend
cd backend
python app.py

# Terminal 2: Test it
curl -X POST -F "file=@sample_contract.txt" http://localhost:5000/analyze

# Should return JSON with:
# - "validation" object
# - "flaws" array with SPECIFIC issues
# - "summary" with analysis
```

---

## What Legal-BERT Detects

The ML models now detect:

### Structural Issues
- Missing parties identification
- Missing effective date
- Missing governing law
- Missing signatures
- Missing termination clauses

### Pattern-Based Flaws
- Ambiguous terms ("someone", "something")
- Incomplete terms ("TBD", "___")
- Invalid durations ("forever", "perpetual")
- Weak language ("may", "might")

### Semantic Issues
- Insufficient detail (too short)
- Section 27 violations
- Unsigned documents
- Unclear relationships

### Indian Law Compliance
- Section 27 (non-compete) checks
- FEMA compliance
- Companies Act requirements
- Stamp duty mentions

---

## Success!

You'll know it's working when:

✅ Different documents show different results
✅ Flaw detection is specific to document content
✅ Risk levels vary appropriately
✅ Console shows Flask backend connected
✅ Flask terminal shows processing logs

---

## Commands Reference

```bash
# Start backend
cd backend && python app.py

# Check health
curl http://localhost:5000/health

# Test upload
curl -X POST -F "file=@test.txt" http://localhost:5000/analyze

# Stop backend
# Press Ctrl+C in Flask terminal
```

---

## Next Steps

Once verified working:

1. ✅ Test with real contracts (anonymize first!)
2. ✅ Compare results across documents
3. ✅ Review detected flaws
4. ✅ Deploy to production server
5. ✅ Add authentication
6. ✅ Set up monitoring

---

## Important Notes

- ⚠️ First run downloads Legal-BERT models (1-2 min)
- ⚠️ Subsequent runs are fast (5-10 sec startup)
- ⚠️ Each document analyzed individually
- ⚠️ Results based on ACTUAL content
- ⚠️ Not legal advice - tool for assistance only

---

## Support

If still seeing demo mode:
1. Read TEST_INTEGRATION.md for detailed debugging
2. Check Flask terminal for errors
3. Verify port 5000 is accessible
4. Check browser console for connection errors

Happy analyzing with REAL ML! 🚀🤖
