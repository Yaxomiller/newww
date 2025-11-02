import type { AnalysisResult } from '../App';

export async function analyzeMockDocument(file: File): Promise<AnalysisResult> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    filename: file.name,
    clauses: [
      {
        type: 'Equity Distribution',
        text: 'The authorized share capital shall be INR 10,00,000 divided into 10,00,000 equity shares of INR 1 each. Initial equity distribution: Founder A: 60% (600,000 shares), Founder B: 40% (400,000 shares).',
        confidence: 0.92,
        risk_level: 'medium',
      },
      {
        type: 'Vesting Schedule',
        text: 'All equity shall vest over a period of 4 years from the date of incorporation. 25% of the shares shall vest after completion of 1 year (Cliff Period) and the remaining 75% shall vest monthly over the subsequent 36 months.',
        confidence: 0.95,
        risk_level: 'high',
      },
      {
        type: 'IP Assignment',
        text: 'All Founders hereby assign to the Company all rights, title and interest in any and all intellectual property created in connection with the Company\'s business pursuant to Section 16 and 17 of the Indian Copyright Act, 1957.',
        confidence: 0.88,
        risk_level: 'high',
      },
      {
        type: 'Non-Compete',
        text: 'During the term of this Agreement, Founders shall not engage in any competing business. Founders agree not to solicit Company employees or customers for 12 months post-exit.',
        confidence: 0.85,
        risk_level: 'high',
      },
      {
        type: 'Termination',
        text: 'Either party may terminate this Agreement by providing 60 days written notice to the other party. The Company may terminate immediately by paying 60 days salary in lieu of notice.',
        confidence: 0.90,
        risk_level: 'medium',
      },
      {
        type: 'Governing Law',
        text: 'This Agreement shall be governed by and construed in accordance with the laws of India. The courts of Bangalore, Karnataka shall have exclusive jurisdiction over any disputes.',
        confidence: 0.94,
        risk_level: 'low',
      },
      {
        type: 'Confidentiality',
        text: 'All Founders shall maintain strict confidentiality of proprietary information for a period of 3 years following termination. This includes trade secrets, customer data, business strategies, and technical know-how.',
        confidence: 0.91,
        risk_level: 'medium',
      },
      {
        type: 'Stamp Duty',
        text: 'This Agreement shall be duly stamped as per the Indian Stamp Act and the stamp laws applicable in Karnataka. Stamp duty charges shall be borne equally by all Founders.',
        confidence: 0.87,
        risk_level: 'low',
      },
    ],
    entities: [
      { type: 'AMOUNT', value: 'INR 10,00,000', confidence: 0.95 },
      { type: 'AMOUNT', value: 'INR 1', confidence: 0.93 },
      { type: 'EQUITY', value: '60%', confidence: 0.96 },
      { type: 'EQUITY', value: '40%', confidence: 0.96 },
      { type: 'EQUITY', value: '25%', confidence: 0.94 },
      { type: 'EQUITY', value: '75%', confidence: 0.94 },
      { type: 'TIME_PERIOD', value: '4 years', confidence: 0.92 },
      { type: 'TIME_PERIOD', value: '1 year', confidence: 0.91 },
      { type: 'TIME_PERIOD', value: '36 months', confidence: 0.90 },
      { type: 'TIME_PERIOD', value: '12 months', confidence: 0.89 },
      { type: 'TIME_PERIOD', value: '60 days', confidence: 0.88 },
      { type: 'TIME_PERIOD', value: '3 years', confidence: 0.87 },
      { type: 'JURISDICTION', value: 'Bangalore, Karnataka', confidence: 0.93 },
      { type: 'DATE', value: 'January 15, 2024', confidence: 0.89 },
    ],
    risk_assessment: {
      overall_risk: 'high',
      risk_score: 7.5,
      individual_risks: [
        {
          clause: 'Non-Compete',
          severity: 'high',
          issue: 'Non-compete clauses violate Section 27 of Indian Contract Act, 1872 and are generally unenforceable in India. Post-termination non-compete restrictions are void.',
          recommendation: 'REMOVE the non-compete clause entirely or limit it to non-solicitation only during employment. Indian law does not permit restraint of trade after termination.',
        },
        {
          clause: 'Vesting Schedule',
          severity: 'high',
          issue: 'The vesting schedule may not be properly aligned with Companies Act requirements for buyback of unvested shares at par value. Section 68 compliance needs verification.',
          recommendation: 'Ensure vesting clause explicitly references Section 68 of Companies Act, 2013 and includes proper buyback provisions for unvested shares.',
        },
        {
          clause: 'IP Assignment',
          severity: 'high',
          issue: 'IP assignment clause should explicitly cover all forms of intellectual property and include warranties that the IP does not infringe third-party rights.',
          recommendation: 'Strengthen IP clause to explicitly state: "All IP belongs exclusively to Company" and add warranty that assigned IP is free from third-party claims.',
        },
      ],
    },
    compliance: {
      'Section 27': {
        title: 'Restraint of Trade (Non-Compete)',
        compliant: false,
        severity: 'high',
        warning: 'Section 27 of Indian Contract Act, 1872 states that any agreement in restraint of trade is void. Non-compete clauses are generally unenforceable in India.',
        recommendation: 'Remove non-compete clause or limit to non-solicitation during employment term only. Post-termination non-compete is void under Indian law.',
      },
      'Section 10': {
        title: 'Free Consent',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Agreement appears to have free consent without coercion, undue influence, fraud, or misrepresentation.',
      },
      'Section 23': {
        title: 'Lawful Consideration',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Consideration appears lawful and not against public policy.',
      },
      'Companies Act 2013': {
        title: 'Share Capital and Vesting',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Share capital structure complies with Companies Act, 2013. Ensure proper ROC filings.',
      },
      'Indian Stamp Act': {
        title: 'Stamp Duty Requirements',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Agreement acknowledges stamp duty requirements. Ensure proper stamping as per Karnataka Stamp Act.',
      },
    },
    summary: 'This Founder Agreement contains 8 key clauses including equity distribution (60/40 split), 4-year vesting with 1-year cliff, and comprehensive IP assignment. CRITICAL ISSUE: The non-compete clause violates Section 27 of Indian Contract Act and is unenforceable - immediate removal recommended. The agreement shows 3 high-risk items requiring legal review. Overall risk assessment: HIGH. The vesting schedule and IP assignment need strengthening to ensure Companies Act compliance. Jurisdiction properly set to Bangalore, Karnataka with appropriate stamp duty provisions.',
    processing_time: 2.34,
  };
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8000/health', {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
