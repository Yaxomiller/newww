import { AlertTriangle, CheckCircle, XCircle, FileText, Clock, RefreshCw } from 'lucide-react';
import type { AnalysisResult } from '../App';
import ClausesPanel from './ClausesPanel';
import RiskPanel from './RiskPanel';
import CompliancePanel from './CompliancePanel';
import EntitiesPanel from './EntitiesPanel';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'from-red-600 to-rose-600';
      case 'medium':
        return 'from-amber-600 to-orange-600';
      case 'low':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-slate-600 to-gray-600';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return <XCircle className="w-6 h-6" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6" />;
      case 'low':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
              <p className="text-blue-100 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>{result.filename}</span>
              </p>
            </div>
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${getRiskColor(result.risk_assessment.overall_risk)} mb-2`}>
                {getRiskIcon(result.risk_assessment.overall_risk)}
              </div>
              <p className="text-sm text-blue-100 mb-1">Overall Risk</p>
              <p className="text-2xl font-bold uppercase">{result.risk_assessment.overall_risk}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="inline-flex p-2 rounded-lg bg-white/20 mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm text-blue-100 mb-1">Clauses Found</p>
              <p className="text-2xl font-bold">{result.clauses.length}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="inline-flex p-2 rounded-lg bg-white/20 mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm text-blue-100 mb-1">High Risks</p>
              <p className="text-2xl font-bold">
                {result.risk_assessment.individual_risks.filter(r => r.severity === 'high').length}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="inline-flex p-2 rounded-lg bg-white/20 mb-2">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm text-blue-100 mb-1">Processing Time</p>
              <p className="text-2xl font-bold">{result.processing_time.toFixed(2)}s</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Executive Summary</h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClausesPanel clauses={result.clauses} />
        <RiskPanel risks={result.risk_assessment.individual_risks} />
        <CompliancePanel compliance={result.compliance} />
        <EntitiesPanel entities={result.entities} />
      </div>
    </section>
  );
}
