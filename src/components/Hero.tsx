import { Shield, Zap, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            AI-Powered Legal Analysis
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Analyze Indian Startup
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Legal Contracts in Seconds
          </span>
        </h1>

        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Upload your founder agreements, employment contracts, or SAFE notes.
          Our AI instantly extracts clauses, identifies risks, and checks compliance
          with Indian Contract Act, FEMA, and Companies Act.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-slate-700">500+ Contracts Trained</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Indian Law Compliant</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200">
            <Zap className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-slate-700">Instant Analysis</span>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href="#upload"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
}
