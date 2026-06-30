import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Info, ShoppingCart } from 'lucide-react';
import { fundService, investmentService } from '../services/api';

const MutualFunds = ({ user }) => {
  const [funds, setFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const res = await fundService.getFunds();
      setFunds(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (fundId, amount) => {
    try {
      await investmentService.addInvestment({
        userId: user.id,
        fundId: fundId,
        amount: parseFloat(amount)
      });
      alert('Investment successful!');
    } catch (err) {
      console.error(err);
      alert('Investment failed');
    }
  };

  const filteredFunds = funds.filter(f => 
    (f.fundName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     f.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (category === 'All' || f.category === category)
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Mutual Funds</h1>
          <p className="text-slate-600">Discover and invest in top-performing funds tailored for you.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search funds..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-64 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white border border-slate-300 text-slate-900 p-2 rounded-xl outline-none transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Equity">Equity</option>
            <option value="Debt">Debt</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunds.map(fund => (
            <div key={fund.fundId} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-100 text-slate-600 mb-2 inline-block">
                    {fund.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{fund.fundName}</h3>
                  <p className="text-sm text-slate-500">{fund.company}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                  fund.riskLevel === 'High Risk' ? 'bg-rose-500/10 text-rose-600' : 
                  (fund.riskLevel === 'Low Risk' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600')
                }`}>
                  {fund.riskLevel}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">1Y Return</p>
                  <p className="text-sm font-bold text-green-600">{fund.returns1y}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">3Y Return</p>
                  <p className="text-sm font-bold text-green-600">{fund.returns3y}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">NAV</p>
                  <p className="text-sm font-bold text-slate-900">₹{fund.nav}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    const amt = prompt('Enter investment amount:', '5000');
                    if (amt) handleInvest(fund.fundId, amt);
                  }}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={16} />
                  <span>Invest Now</span>
                </button>
                <button className="p-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                  <Info size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MutualFunds;
