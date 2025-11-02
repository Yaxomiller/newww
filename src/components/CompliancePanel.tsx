import { Scale, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ComplianceItem {
  title: string;
  compliant: boolean;
  severity: string;
  warning: string;
  recommendation: string;
}

interface CompliancePanelProps {
  compliance: Record<string, ComplianceItem>;
}

export default function CompliancePanel({ compliance }: CompliancePanelProps) {
  const complianceEntries = Object.entries(compliance);
  const compliantCount = complianceEntries.filter(([_, item]) => item.compliant).length;

  const getStatusIcon = (compliant: boolean, severity: string) => {
    if (compliant) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (severity === 'high') {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Compliance Check</h3>
            <p className="text-sm text-slate-600">
              {compliantCount} of {complianceEntries.length} sections compliant
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          {complianceEntries.map(([section, item]) => (
            <div
              key={section}
              className={`border rounded-lg p-4 ${
                item.compliant
                  ? 'border-green-200 bg-green-50'
                  : item.severity === 'high'
                  ? 'border-red-200 bg-red-50'
                  : 'border-amber-200 bg-amber-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(item.compliant, item.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{section}</h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.compliant
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {item.compliant ? 'Compliant' : 'Non-Compliant'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{item.title}</p>
                  {item.warning && (
                    <div className="bg-white rounded-lg p-3 border border-amber-200 mb-2">
                      <p className="text-xs font-medium text-amber-900 mb-1">
                        Warning:
                      </p>
                      <p className="text-sm text-amber-800">{item.warning}</p>
                    </div>
                  )}
                  {!item.compliant && (
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-xs font-medium text-slate-900 mb-1">
                        Action Required:
                      </p>
                      <p className="text-sm text-slate-700">{item.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
