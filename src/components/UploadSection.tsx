import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import type { AnalysisResult } from '../App';
import { analyzeMockDocument, checkBackendHealth } from '../services/mockApi';

interface UploadSectionProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onAnalysisStart: () => void;
  isAnalyzing: boolean;
}

export default function UploadSection({
  onAnalysisComplete,
  onAnalysisStart,
  isAnalyzing,
}: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkBothBackends = async () => {
      const fastApiHealth = await checkBackendHealth();
      if (!fastApiHealth) {
        try {
          const flaskResponse = await fetch('http://localhost:5000/health', {
            method: 'GET',
            signal: AbortSignal.timeout(2000),
          });
          setBackendAvailable(flaskResponse.ok);
        } catch {
          setBackendAvailable(false);
        }
      } else {
        setBackendAvailable(true);
      }
    };
    checkBothBackends();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['text/plain', 'application/pdf', 'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.txt', '.pdf', '.doc', '.docx'];

    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidType && !hasValidExtension) {
      setError('Please upload a .txt, .pdf, .doc, or .docx file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setFile(file);
    setError(null);
  };

  const convertFlaskToAnalysisResult = (flaskResult: any, filename: string): AnalysisResult => {
    console.log('Flask result:', flaskResult);
    const validation = flaskResult.validation;

    const allClauses = validation.flaws.map((f: any) => ({
      type: f.flaw_type.replace(/_/g, ' '),
      text: f.clause_text || f.description,
      confidence: validation.confidence,
      risk_level: f.severity.toLowerCase()
    }));

    const entities: any[] = [];

    const riskLevel = validation.critical_flaws > 0 ? 'high' :
                      validation.high_flaws > 0 ? 'medium' : 'low';

    const compliance: Record<string, any> = {};

    validation.flaws.forEach((flaw: any) => {
      const sectionName = flaw.flaw_type.replace(/_/g, ' ');
      compliance[sectionName] = {
        title: flaw.description,
        compliant: false,
        severity: flaw.severity.toLowerCase(),
        warning: flaw.description,
        recommendation: flaw.suggestion
      };
    });

    if (validation.is_compliant) {
      compliance['Overall Compliance'] = {
        title: 'Document is Compliant',
        compliant: true,
        severity: 'none',
        warning: '',
        recommendation: 'Document meets basic requirements'
      };
    }

    return {
      success: true,
      filename,
      clauses: allClauses.length > 0 ? allClauses : [{
        type: 'Document Status',
        text: flaskResult.summary,
        confidence: validation.confidence,
        risk_level: riskLevel
      }],
      entities,
      risk_assessment: {
        overall_risk: riskLevel,
        risk_score: validation.critical_flaws * 3 + validation.high_flaws * 2 + validation.medium_flaws,
        individual_risks: validation.flaws.map((f: any) => ({
          clause: f.flaw_type.replace(/_/g, ' '),
          severity: f.severity.toLowerCase(),
          issue: f.description,
          recommendation: f.suggestion
        }))
      },
      compliance,
      summary: flaskResult.summary,
      processing_time: flaskResult.processing_time || 0
    };
  };

  const handleAnalyze = async () => {
    if (!file) return;

    onAnalysisStart();
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    let useFlask = false;
    let useFastAPI = false;

    try {
      console.log('Attempting Flask backend at localhost:5000...');
      const flaskResponse = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (flaskResponse.ok) {
        console.log('✓ Flask backend responded');
        const result = await flaskResponse.json();

        if (result.validation) {
          console.log('Converting Flask result to frontend format');
          const flaskResult = convertFlaskToAnalysisResult(result, file.name);
          onAnalysisComplete(flaskResult);
          return;
        }

        onAnalysisComplete(result);
        return;
      } else {
        console.log('Flask backend returned error:', flaskResponse.status);
      }
    } catch (flaskErr) {
      console.log('Flask backend unavailable:', flaskErr);
    }

    try {
      console.log('Attempting FastAPI backend at localhost:8000...');
      const fastApiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (fastApiResponse.ok) {
        console.log('✓ FastAPI backend responded');
        const result = await fastApiResponse.json();
        onAnalysisComplete(result);
        return;
      } else {
        console.log('FastAPI backend returned error:', fastApiResponse.status);
      }
    } catch (fastApiErr) {
      console.log('FastAPI backend unavailable:', fastApiErr);
    }

    console.log('Both backends unavailable, using demo mode');

    try {
      const result = await analyzeMockDocument(file);
      onAnalysisComplete(result);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    }
  };

  return (
    <section id="upload" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Upload Your Contract
              </h2>
              <p className="text-slate-600">
                Supports founder agreements, employment contracts, SAFE notes, NDAs, and more
              </p>
            </div>
            {backendAvailable !== null && (
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  backendAvailable
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}
              >
                {backendAvailable ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">API Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Demo Mode</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleChange}
            />

            {!file ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 mb-1">
                    Drop your contract here or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                    Supports: .txt, .pdf, .doc, .docx (max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-4 rounded-full">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 mb-1">{file.name}</p>
                  <p className="text-sm text-slate-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {file && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full mt-6 flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Contract...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Analyze Contract</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
