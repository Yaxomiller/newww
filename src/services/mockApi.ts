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
        confidence: 0.99,
        risk_level: 'low',
      },
      {
        type: 'Vesting Schedule',
        text: 'All equity shall vest over a period of 4 years from the date of incorporation. 25% of the shares shall vest after completion of 1 year (Cliff Period) and the remaining 75% shall vest monthly over the subsequent 36 months.',
        confidence: 0.99,
        risk_level: 'low',
      },
      {
        type: 'IP Assignment',
        text: 'All Founders hereby assign to the Company all rights, title and interest in any and all intellectual property created in connection with the Company\'s business pursuant to Section 16 and 17 of the Indian Copyright Act, 1957.',
        confidence: 0.99,
        risk_level: 'low',
      },
      {
        type: 'Non-Compete',
        text: 'During the term of this Agreement, Founders shall not engage in any competing business. Founders agree not to solicit Company employees or customers for 12 months post-exit.',
        confidence: 0.99,
        risk_level: 'low',
      },
      {
        type: 'Termination',
        text: 'Either party may terminate this Agreement by providing 60 days written notice to the other party. The Company may terminate immediately by paying 60 days salary in lieu of notice.',
        confidence: 0.99,
        risk_level: 'low',
      },
      {
        type: 'Governing Law',
        text: 'This Agreement shall be governed by and construed in accordance with the laws of India. The courts of Bangalore, Karnataka shall have exclusive jurisdiction over any disputes.',
        confidence: 0.99,
        risk_level: 'low',
      },
      {
        type: 'Confidentiality',
        text: 'All Founders shall maintain strict confidentiality of proprietary information for a period of 3 years following termination. This includes trade secrets, customer data, business strategies, and technical know-how.',
        confidence: 0.99,
        risk_level: 'low',
      },
      {
        type: 'Stamp Duty',
        text: 'This Agreement shall be duly stamped as per the Indian Stamp Act and the stamp laws applicable in Karnataka. Stamp duty charges shall be borne equally by all Founders.',
        confidence: 0.99,
        risk_level: 'low',
      },
    ],
    entities: [
      { type: 'AMOUNT', value: 'INR 10,00,000', confidence: 0.99 },
      { type: 'AMOUNT', value: 'INR 1', confidence: 0.99 },
      { type: 'EQUITY', value: '60%', confidence: 0.99 },
      { type: 'EQUITY', value: '40%', confidence: 0.99 },
      { type: 'EQUITY', value: '25%', confidence: 0.99 },
      { type: 'EQUITY', value: '75%', confidence: 0.99 },
      { type: 'TIME_PERIOD', value: '4 years', confidence: 0.99 },
      { type: 'TIME_PERIOD', value: '1 year', confidence: 0.99 },
      { type: 'TIME_PERIOD', value: '36 months', confidence: 0.99 },
      { type: 'TIME_PERIOD', value: '12 months', confidence: 0.99 },
      { type: 'TIME_PERIOD', value: '60 days', confidence: 0.99 },
      { type: 'TIME_PERIOD', value: '3 years', confidence: 0.99 },
      { type: 'JURISDICTION', value: 'Bangalore, Karnataka', confidence: 0.99 },
      { type: 'DATE', value: 'January 15, 2024', confidence: 0.99 },
    ],
    risk_assessment: {
      overall_risk: 'low',
      risk_score: 0,
      individual_risks: [],
    },
    compliance: {
      'Section 27': {
        title: 'Restraint of Trade (Non-Compete)',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'All clauses comply with Section 27 of Indian Contract Act, 1872.',
      },
      'Section 10': {
        title: 'Free Consent',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Agreement has free consent without coercion, undue influence, fraud, or misrepresentation.',
      },
      'Section 23': {
        title: 'Lawful Consideration',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Consideration is lawful and not against public policy.',
      },
      'Companies Act 2013': {
        title: 'Share Capital and Vesting',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Share capital structure complies with Companies Act, 2013. All ROC filings are in order.',
      },
      'Indian Stamp Act': {
        title: 'Stamp Duty Requirements',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Agreement meets all stamp duty requirements as per Karnataka Stamp Act.',
      },
    },
    summary: 'This Founder Agreement is PERFECT and contains 8 key clauses that are all fully compliant with Indian law. The equity distribution (60/40 split), 4-year vesting with 1-year cliff, IP assignment, non-compete, termination, governing law, confidentiality, and stamp duty provisions are all correctly structured. NO ISSUES FOUND. All clauses comply with the Indian Contract Act 1872, Companies Act 2013, and applicable stamp laws. Overall risk assessment: LOW. This agreement is ready for execution.',
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
