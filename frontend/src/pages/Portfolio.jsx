import React, { useState, useEffect } from 'react';
import { Briefcase, IndianRupee, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react';
import { investmentService, fundService } from '../services/api';

const Portfolio = ({ user }) => {
  const [investments, setInvestments] = useState([]);
  const [funds, setFunds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    try {
      const invRes = await investmentService.getInvestments(user.id);
      const fundRes = await fundService.getFunds();
      
      const fundMap = {};
      fundRes.data.forEach(f => {
        fundMap[f.fundId] = f;
      });
      
      setFunds(fundMap);
      setInvestments(invRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = investments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">My Portfolio</h1>
        <p className="text-slate-600">Track and manage your mutual fund holdings.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Portfolio Value</p>
              <h2 className="text-3xl font-bold text-slate-900">₹{totalValue.toLocaleString()}</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-green-600 font-bold bg-green-500/10 px-3 py-1 rounded-full">+12.5% Profit</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                <th className="px-6 py-4">Mutual Fund</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Invested Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                    No investments found. Start your journey by exploring funds!
                  </td>
                </tr>
              ) : (
                investments.map((inv, idx) => {
                  const fund = funds[inv.fundId] || {};
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{fund.fundName || 'Unknown Fund'}</p>
                        <p className="text-xs text-slate-500">{fund.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
                          {fund.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{inv.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(inv.investmentDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <ArrowUpRight size={16} className="mr-1" />
                          <span>Growing</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
