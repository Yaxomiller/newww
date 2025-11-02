import { FileSearch, AlertTriangle, Scale, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'Clause Extraction',
    description: 'Automatically identifies and extracts key clauses like equity distribution, vesting schedules, IP assignment, and termination terms.',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Assessment',
    description: 'Analyzes each clause for potential risks and provides severity ratings with actionable recommendations for Indian startups.',
    color: 'from-amber-600 to-orange-600',
  },
  {
    icon: Scale,
    title: 'Compliance Check',
    description: 'Validates compliance with Indian Contract Act Section 27, FEMA regulations, Companies Act 2013, and stamp duty requirements.',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    icon: TrendingUp,
    title: 'Entity Recognition',
    description: 'Extracts critical entities like amounts, dates, equity percentages, jurisdictions, and party names with high accuracy.',
    color: 'from-violet-600 to-purple-600',
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Powerful Features for Indian Startups
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Built specifically for Indian legal documents with deep understanding
          of local regulations and startup requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
