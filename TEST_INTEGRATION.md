# Integration Testing Guide

## ⚠️ IMPORTANT: The ML backend must be running for real analysis!

## Step-by-Step Testing

### Step 1: Start Flask Backend

Open a **new terminal** and run:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Expected output:**
```
🔧 Device: cpu
📚 Loading models for legal validation...
   • Loading document classifier...
   • Loading clause analyzer...
✓ Models loaded
🔧 Training on legal flaw detection data...
✓ Training complete

================================================================================
🚀 Starting Flask server on http://localhost:5000
================================================================================

Endpoints:
  GET  /           - API info
  GET  /health     - Health check
  POST /analyze    - Analyze document
  GET  /document-types - Supported types

================================================================================

 * Serving Flask app 'app'
 * Debug mode: on
```

**WAIT** until you see "Running on http://127.0.0.1:5000"

⏱️ First time takes 5-10 seconds to load models

### Step 2: Test Backend Health

In another terminal:

```bash
curl http://localhost:5000/health
```

**Expected:**
```json
{"status": "healthy", "validator": true}
```

✅ If you see this, backend is ready!

### Step 3: Test File Upload via API

```bash
curl -X POST \
  -F "file=@sample_contract.txt" \
  http://localhost:5000/analyze
```

**Expected:** Large JSON response with:
- `validation` object
- `flaws` array (with actual detected flaws)
- `summary` string
- Different results for different documents!

### Step 4: Test Frontend Integration

1. **Open browser** (frontend already running)
2. **Check console** (F12 → Console tab)
3. **Upload** `sample_contract.txt`
4. **Watch console** for:
   ```
   Attempting Flask backend at localhost:5000...
   ✓ Flask backend responded
   Converting Flask result to frontend format
   Flask result: {validation: {...}}
   ```

5. **Verify** results are DIFFERENT from demo mode

### Step 5: Create Test Documents

**Test 1: Invalid Document (should fail)**

Create `test_invalid.txt`:
```text
AGREEMENT

This is a contract between someone and someone else.
They agree to do something for some amount.
This starts now and continues forever.
```

Upload → Should show:
- **Critical flaws**: Missing parties, missing governing law, missing signatures
- **High flaws**: Invalid duration (perpetual)
- **Overall Risk**: HIGH

**Test 2: Valid Document (should pass)**

Create `test_valid.txt`:
```text
NON-DISCLOSURE AGREEMENT

This Agreement is entered into as of January 15, 2025, by and between:

TechCorp Inc. ("Disclosing Party")
AND
John Smith ("Receiving Party")

1. CONFIDENTIAL INFORMATION
Confidential Information includes trade secrets, business plans, and customer data.

2. OBLIGATIONS
The Receiving Party shall maintain confidentiality and not disclose to third parties.

3. TERM
This Agreement shall remain in effect for three (3) years from the date of execution.

4. GOVERNING LAW
This Agreement shall be governed by the laws of California.

5. SIGNATURES
Signed by both parties on January 15, 2025.

_________________         _________________
TechCorp Inc.            John Smith
Disclosing Party         Receiving Party
```

Upload → Should show:
- **Fewer flaws** or zero flaws
- **Overall Risk**: LOW
- **Summary**: "Document appears compliant"

### Step 6: Verify Different Results

The key test: **Different documents should produce different results!**

| Document | Expected Critical Flaws | Expected Summary |
|----------|------------------------|------------------|
| sample_contract.txt | 0-2 | May have Section 27 warning |
| test_invalid.txt | 3-5 | "CRITICAL: X issues must be fixed" |
| test_valid.txt | 0 | "Document appears compliant" |

## Common Issues

### Issue: "Backend unavailable. Using demo mode"

**Cause:** Flask not running

**Fix:**
```bash
cd backend
python app.py
```

Wait for "Running on http://127.0.0.1:5000"

### Issue: "ModuleNotFoundError: No module named 'torch'"

**Fix:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Same results for all documents

**Cause:** Using demo mode (backend not connected)

**Fix:**
1. Check Flask is running
2. Look at browser console (F12)
3. Should see "✓ Flask backend responded"
4. If you see "Both backends unavailable", Flask isn't running

### Issue: Models downloading slowly

**Cause:** Legal-BERT downloading (first run only)

**Fix:** Wait 1-2 minutes. Models are cached after first download.

### Issue: Port 5000 already in use

**Fix:**
```bash
# Find process
lsof -i :5000
# Kill it
kill -9 <PID>

# Or change port in backend/app.py:
app.run(debug=True, port=5001)
# Then update frontend to use port 5001
```

## Debugging

### Enable Verbose Logging

1. Open browser console (F12)
2. Upload a file
3. Look for these messages:

**Good (Connected):**
```
Attempting Flask backend at localhost:5000...
✓ Flask backend responded
Converting Flask result to frontend format
Flask result: {success: true, ...}
```

**Bad (Demo Mode):**
```
Attempting Flask backend at localhost:5000...
Flask backend unavailable: TypeError: Failed to fetch
Attempting FastAPI backend at localhost:8000...
FastAPI backend unavailable: TypeError: Failed to fetch
Both backends unavailable, using demo mode
```

### Check Flask Logs

In the Flask terminal, you should see:

```
📁 Processing file: sample_contract.txt
📄 Document type: FOUNDER_AGREEMENT
📏 Content length: 2543 characters
✓ Validation complete: 3 issues found
✓ Analysis complete: 3 flaws found
127.0.0.1 - - [date] "POST /analyze HTTP/1.1" 200 -
```

### Test Backend Directly

```bash
# Create test file
echo "AGREEMENT between parties" > test.txt

# Test upload
curl -X POST -F "file=@test.txt" http://localhost:5000/analyze

# Should return JSON with flaws
```

## Verification Checklist

- [ ] Flask backend running (check terminal)
- [ ] Health endpoint returns healthy (curl test)
- [ ] File upload works (curl test)
- [ ] Frontend shows "API Connected" badge
- [ ] Browser console shows "✓ Flask backend responded"
- [ ] Different documents produce different results
- [ ] Flaws are specific to document content
- [ ] Risk levels vary by document

## Success Indicators

✅ **Backend is connected when:**
- Badge shows "API Connected" (not "Demo Mode")
- Console shows "✓ Flask backend responded"
- Results vary for different documents
- Flask terminal shows processing logs

❌ **Still in demo mode if:**
- Badge shows "Demo Mode"
- Console shows "Both backends unavailable"
- All documents show same results
- No Flask terminal logs

## Quick Test Script

Save as `test_all.sh`:

```bash
#!/bin/bash

echo "Testing Flask Backend Integration"
echo "=================================="

echo -e "\n1. Testing health endpoint..."
curl -s http://localhost:5000/health | grep -q "healthy" && echo "✅ Health check passed" || echo "❌ Health check failed"

echo -e "\n2. Testing file upload..."
curl -s -X POST -F "file=@sample_contract.txt" http://localhost:5000/analyze | grep -q "validation" && echo "✅ Upload works" || echo "❌ Upload failed"

echo -e "\n3. Testing different document..."
echo "AGREEMENT between someone and someone" > /tmp/test_simple.txt
curl -s -X POST -F "file=@/tmp/test_simple.txt" http://localhost:5000/analyze | grep -q "MISSING_PARTIES" && echo "✅ Detects missing parties" || echo "❌ Detection failed"

echo -e "\n4. Check if results differ..."
RESULT1=$(curl -s -X POST -F "file=@sample_contract.txt" http://localhost:5000/analyze | jq -r '.validation.total_flaws')
RESULT2=$(curl -s -X POST -F "file=@/tmp/test_simple.txt" http://localhost:5000/analyze | jq -r '.validation.total_flaws')

if [ "$RESULT1" != "$RESULT2" ]; then
    echo "✅ Different documents produce different results ($RESULT1 vs $RESULT2)"
else
    echo "⚠️  Warning: Both documents show same flaw count"
fi

rm /tmp/test_simple.txt

echo -e "\n=================================="
echo "Integration test complete!"
```

Run:
```bash
chmod +x test_all.sh
./test_all.sh
```

## Production Readiness

Once all tests pass:

1. ✅ Backend responds to health checks
2. ✅ File uploads work
3. ✅ ML models detect flaws correctly
4. ✅ Different documents produce different results
5. ✅ Frontend displays results properly

You're ready for production! 🚀

## Next Steps

- Deploy Flask backend to server
- Add authentication
- Set up database for history
- Configure HTTPS
- Add rate limiting
- Monitor performance

Happy testing! 🎉
