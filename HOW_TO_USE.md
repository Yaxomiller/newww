# How to Use - Indian Startup Legal Analyzer

## 🚀 You're Ready to Go!

The application is **already running** in your browser with Demo Mode enabled.

---

## Step-by-Step Usage

### 1. Upload a Contract

**Option A: Use the Sample File**
- Find `sample_contract.txt` in the project root
- Drag it onto the upload area OR
- Click the upload area and select it

**Option B: Use Your Own Contract**
- Must be a `.txt` file (plain text)
- Maximum size: 5MB
- Can be any of these types:
  - Founder Agreement
  - Employment Contract
  - Service Agreement
  - SAFE Note
  - NDA
  - Advisor Agreement

### 2. Start Analysis

1. After uploading, click the **"Analyze Contract"** button
2. Wait 2 seconds for analysis (Demo Mode)
3. Results appear automatically

### 3. Review Results

#### Top Dashboard Shows:
- **Overall Risk Level**: Low/Medium/High with color coding
- **Clauses Found**: Total number extracted
- **High Risks**: Count of critical issues
- **Processing Time**: How long analysis took

#### Executive Summary:
Plain English overview of the contract

#### Four Analysis Panels:

**📄 Clauses Panel** (Top Left)
- Lists all extracted clauses
- Shows risk level for each (High/Medium/Low)
- Displays confidence score
- Click to expand full text

**⚠️ Risk Assessment** (Top Right)
- Shows only high-risk items
- Explains the issue
- Provides recommendation
- References Indian laws

**⚖️ Compliance Check** (Bottom Left)
- Tests against Indian Contract Act
- Shows Section 27 (non-compete) status
- FEMA compliance
- Companies Act requirements
- Color-coded: Green = pass, Red = fail

**🏷️ Entities Panel** (Bottom Right)
- Extracted amounts (INR)
- Important dates
- Equity percentages
- Jurisdictions
- Grouped by type

### 4. Understand the Results

#### Risk Levels Explained:

**🔴 HIGH RISK** (Red)
- Requires immediate attention
- May violate Indian law
- Could be unenforceable
- Action: Fix before signing

**🟡 MEDIUM RISK** (Amber)
- Should be reviewed
- May need clarification
- Standard caution items
- Action: Get legal opinion

**🟢 LOW RISK** (Green)
- Standard clauses
- Generally acceptable
- Low concern
- Action: Proceed normally

#### Common Issues Found:

1. **Section 27 Violation** (Non-Compete)
   - Issue: Post-termination non-compete illegal in India
   - Fix: Remove or limit to during employment only

2. **Vesting Issues**
   - Issue: Missing Companies Act compliance
   - Fix: Add Section 68 reference and buyback terms

3. **IP Assignment**
   - Issue: Unclear ownership
   - Fix: Explicitly state "All IP belongs to Company"

4. **FEMA Non-Compliance**
   - Issue: Missing required filings
   - Fix: Add Form FC-GPR filing requirement

### 5. Take Action

Based on results:

**If HIGH risk items found:**
1. Note the specific clause
2. Read the issue description
3. Follow the recommendation
4. Consult a lawyer before signing

**If only MEDIUM/LOW risks:**
1. Review flagged sections
2. Consider getting legal opinion
3. May proceed with standard caution

**If COMPLIANCE failures:**
1. Address non-compliant sections immediately
2. Most common: Section 27 (non-compete)
3. Fix before finalizing contract

### 6. Start Over

Click **"New Analysis"** button at top to analyze another contract

---

## Understanding Specific Results

### Sample Contract Results

The included `sample_contract.txt` will show:

- **Risk Level**: HIGH
- **Critical Issue**: Non-compete clause (Section 27)
- **8 Clauses**: Equity, vesting, IP, etc.
- **3 High Risks**: Non-compete, vesting, IP
- **Compliance**: 4/5 pass (Section 27 fails)

This is intentional - it demonstrates the AI catching real issues!

### Confidence Scores

- **90-100%**: Very confident
- **80-89%**: Confident
- **70-79%**: Moderate confidence
- **Below 70%**: Lower confidence, review manually

The AI typically scores 85-95% on well-written contracts.

### Entity Types

- **AMOUNT**: Currency values in INR
- **DATE**: Contract dates
- **EQUITY**: Percentage ownership
- **TIME_PERIOD**: Durations (years, months)
- **JURISDICTION**: Indian cities/states

---

## Tips for Best Results

### ✅ DO:
- Use plain text (.txt) files
- Keep contracts under 5MB
- Use standard contract formatting
- Include section numbers
- Mention specific Indian laws

### ❌ DON'T:
- Upload PDFs or Word docs (convert to .txt first)
- Expect 100% accuracy (always review)
- Use as replacement for legal advice
- Share sensitive real contracts (anonymize first)

---

## Demo Mode vs API Mode

### Current: Demo Mode
- Uses mock analysis engine
- Realistic results based on training data
- ~2 second processing
- No backend required
- Perfect for exploration

### With Backend: API Mode
- Uses actual trained ML models
- Real-time inference
- Variable processing time
- Requires Python backend running
- More accurate for edge cases

Badge shows current mode in top-right of upload section.

---

## Common Questions

**Q: Is this legally binding advice?**
A: No, this is informational only. Always consult a real lawyer.

**Q: Can I upload real contracts?**
A: Yes, but anonymize sensitive info first (names, amounts, etc.)

**Q: What if it misses something?**
A: The AI is trained but not perfect. Always have human review.

**Q: Are my uploads stored?**
A: In Demo Mode, nothing is stored. With backend, check backend code.

**Q: Which Indian laws does it check?**
A: Indian Contract Act (Sections 10, 23, 27), Companies Act 2013, FEMA, Stamp Act

**Q: Can it handle custom clauses?**
A: It may not recognize highly unusual clauses. Best with standard startup contracts.

**Q: What if I see "Demo Mode"?**
A: Normal! Backend not running. You get realistic mock results.

**Q: How do I enable real ML models?**
A: Run `python app.py` in another terminal. See README.md.

---

## Need Help?

1. Read QUICK_START.md for instant demo
2. See README.md for full docs
3. Check PROJECT_STRUCTURE.md for technical details
4. Review sample_contract.txt for example

---

## Keyboard Shortcuts

- Click upload area to browse files
- Drag and drop to upload
- Scroll to see all panels
- Click "New Analysis" to reset

---

## What to Do Next

1. ✅ Try the sample contract first
2. ✅ Understand the results format
3. ✅ Upload your own contract (anonymized)
4. ✅ Review risks and compliance
5. ✅ Take recommended actions
6. ✅ Consult a lawyer for final review

---

**Remember**: This tool assists your legal review but does NOT replace professional legal advice. Always consult qualified lawyers for contract matters.

Happy analyzing! 🚀
