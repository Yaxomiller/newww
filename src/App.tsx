import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AnalysisResults from './components/AnalysisResults';
import Features from './components/Features';
import Footer from './components/Footer';

export interface AnalysisResult {
  success: boolean;
  filename?: string;
  clauses: Array<{
    type: string;
    text: string;
    confidence: number;
    risk_level: string;
  }>;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  risk_assessment: {
    overall_risk: string;
    risk_score: number;
    individual_risks: Array<{
      clause: string;
      severity: string;
      issue: string;
      recommendation: string;
    }>;
  };
  compliance: Record<string, {
    title: string;
    compliant: boolean;
    severity: string;
    warning: string;
    recommendation: string;
  }>;
  summary: string;
  processing_time: number;
}

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header />

      <main>
        {!analysisResult && !isAnalyzing && (
          <>
            <Hero />
            <Features />
          </>
        )}

        <UploadSection
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisStart={handleAnalysisStart}
          isAnalyzing={isAnalyzing}
        />

        {analysisResult && (
          <AnalysisResults
            result={analysisResult}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
