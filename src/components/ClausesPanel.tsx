import { FileText, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface Clause {
  type: string;
  text: string;
  confidence: number;
  risk_level: string;
}

interface ClausesPanelProps {
  clauses: Clause[];
}

export default function ClausesPanel({ clauses }: ClausesPanelProps) {
  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span>High Risk</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>Medium Risk</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span>Low Risk</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Extracted Clauses</h3>
            <p className="text-sm text-slate-600">{clauses.length} clauses identified</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          {clauses.map((clause, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-900">{clause.type}</h4>
                {getRiskBadge(clause.risk_level)}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                {clause.text.length > 200 ? `${clause.text.substring(0, 200)}...` : clause.text}
              </p>
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <span>Confidence: {(clause.confidence * 100).toFixed(0)}%</span>
                <div className="w-32 bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${clause.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
