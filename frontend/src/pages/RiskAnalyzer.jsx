import React, { useState } from 'react';
import { ShieldAlert, IndianRupee, Clock, ChevronRight, AlertTriangle, ShieldCheck, ShieldAlert as ShieldIcon } from 'lucide-react';
import { investmentService } from '../services/api';

const RiskAnalyzer = ({ user }) => {
  const [data, setData] = useState({
    amount: '',
    duration: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await investmentService.analyzeRisk({
        amount: data.amount,
        duration: data.duration
      });
      setResult(res.data.riskLevel);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskDetails = (level) => {
    switch (level) {
      case 'Low Risk':
        return {
          icon: ShieldCheck,
          color: 'emerald',
          desc: 'Safe investments with stable returns. Best for long-term capital preservation.',
          allocation: 'Debt 70%, Equity 20%, Gold 10%'
        };
      case 'Medium Risk':
        return {
          icon: ShieldIcon,
          color: 'amber',
          desc: 'Balanced approach seeking moderate growth. Suitable for medium-term goals.',
          allocation: 'Equity 50%, Debt 40%, Gold 10%'
        };
      case 'High Risk':
        return {
          icon: AlertTriangle,
          color: 'rose',
          desc: 'Aggressive growth strategy. Significant exposure to market fluctuations.',
          allocation: 'Equity 80%, Debt 10%, Others 10%'
        };
      default:
        return null;
    }
  };

  const riskDetails = result ? getRiskDetails(result) : null;
  const RiskIcon = riskDetails?.icon;

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Risk Analyzer</h1>
        <p className="text-slate-600">Evaluate your investment profile and get personalized risk scores.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
            <ShieldAlert className="mr-2 text-primary-600" size={24} />
            Risk Profile Input
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-slate-300 text-slate-900 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="How much do you want to invest?"
                  value={data.amount}
                  onChange={(e) => setData({...data, amount: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (Years)</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-slate-300 text-slate-900 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Investment horizon"
                  value={data.duration}
                  onChange={(e) => setData({...data, duration: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/20"
            >
              {loading ? 'Analyzing...' : 'Analyze Risk Profile'}
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-center">
          {result ? (
            <div className={`bg-${riskDetails.color}-500/10 border border-${riskDetails.color}-500/20 p-8 rounded-2xl animate-in slide-in-from-right-10 duration-500`}>
              <div className={`text-${riskDetails.color}-600 mb-4`}>
                <RiskIcon size={48} />
              </div>
              <h3 className={`text-2xl font-bold text-${riskDetails.color}-600 mb-2`}>{result}</h3>
              <p className="text-slate-600 mb-6">{riskDetails.desc}</p>
              
              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Suggested Allocation</p>
                <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex">
                  {result === 'Low Risk' && (
                    <>
                      <div className="bg-emerald-500 w-[70%]" title="Debt"></div>
                      <div className="bg-blue-500 w-[20%]" title="Equity"></div>
                      <div className="bg-amber-500 w-[10%]" title="Gold"></div>
                    </>
                  )}
                  {result === 'Medium Risk' && (
                    <>
                      <div className="bg-blue-500 w-[50%]" title="Equity"></div>
                      <div className="bg-emerald-500 w-[40%]" title="Debt"></div>
                      <div className="bg-amber-500 w-[10%]" title="Gold"></div>
                    </>
                  )}
                  {result === 'High Risk' && (
                    <>
                      <div className="bg-rose-500 w-[80%]" title="Equity"></div>
                      <div className="bg-emerald-500 w-[10%]" title="Debt"></div>
                      <div className="bg-slate-500 w-[10%]" title="Others"></div>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-medium">{riskDetails.allocation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <ShieldAlert size={64} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Please provide your investment details to see the risk analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskAnalyzer;
