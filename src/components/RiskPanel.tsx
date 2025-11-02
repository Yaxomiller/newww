import { AlertTriangle, XCircle } from 'lucide-react';

interface Risk {
  clause: string;
  severity: string;
  issue: string;
  recommendation: string;
}

interface RiskPanelProps {
  risks: Risk[];
}

export default function RiskPanel({ risks }: RiskPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Risk Assessment</h3>
            <p className="text-sm text-slate-600">{risks.length} issues identified</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        {risks.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
              <AlertTriangle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-slate-600">No high-risk issues identified</p>
          </div>
        ) : (
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div
                key={index}
                className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{risk.clause}</h4>
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full uppercase">
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">{risk.issue}</p>
                    <div className="bg-white rounded-lg p-3 border border-red-200">
                      <p className="text-xs font-medium text-slate-900 mb-1">
                        Recommendation:
                      </p>
                      <p className="text-sm text-slate-700">{risk.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
