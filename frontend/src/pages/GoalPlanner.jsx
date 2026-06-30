import React, { useState, useEffect } from 'react';
import { Target, Calendar, IndianRupee, TrendingUp, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { goalService } from '../services/api';

const GoalPlanner = ({ user }) => {
  const [goal, setGoal] = useState({
    type: 'Education',
    targetAmount: '',
    duration: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userGoals, setUserGoals] = useState([]);

  useEffect(() => {
    fetchUserGoals();
  }, [user.id]);

  const fetchUserGoals = async () => {
    try {
      const res = await goalService.getGoals(user.id);
      setUserGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await goalService.calculate({
        targetAmount: goal.targetAmount,
        durationYears: goal.duration
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    if (!result) return;
    try {
      await goalService.addGoal({
        userId: user.id,
        goalType: goal.type,
        targetAmount: goal.targetAmount,
        durationYears: goal.duration,
        monthlyInvestment: result.requiredSIP
      });
      fetchUserGoals();
      alert('Goal saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalService.deleteGoal(goalId);
      fetchUserGoals();
    } catch (err) {
      console.error(err);
      alert('Failed to delete goal');
    }
  };

  const goalTypes = ['Education', 'Buying a House', 'Buying a Car', 'Marriage', 'Retirement', 'Vacation'];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Goal-Based Planner</h1>
        <p className="text-slate-600">Plan your future with precision. Calculate required SIPs for your life goals.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Planner Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
            <Target className="mr-2 text-primary-600" size={24} />
            Set Your Goal
          </h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What are you planning for?</label>
              <select
                className="w-full bg-white border border-slate-300 text-slate-900 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                value={goal.type}
                onChange={(e) => setGoal({...goal, type: e.target.value})}
              >
                {goalTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-slate-300 text-slate-900 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. 1500000"
                  value={goal.targetAmount}
                  onChange={(e) => setGoal({...goal, targetAmount: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (Years)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  required
                  className="w-full bg-white border border-slate-300 text-slate-900 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. 12"
                  value={goal.duration}
                  onChange={(e) => setGoal({...goal, duration: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-primary-500/20"
            >
              {loading ? 'Calculating...' : 'Calculate Required SIP'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-primary-600 text-white p-8 rounded-2xl shadow-xl shadow-primary-500/30 animate-in fade-in zoom-in duration-300">
              <h3 className="text-primary-100 text-sm font-medium uppercase tracking-wider mb-2">Recommended Monthly Investment</h3>
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-4xl font-bold">₹{result.requiredSIP.toLocaleString()}</span>
                <span className="text-primary-100">/ month</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <p className="text-primary-100 text-xs mb-1">Target Achievement</p>
                  <p className="font-semibold text-lg">100%</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <p className="text-primary-100 text-xs mb-1">Expected ROI</p>
                  <p className="font-semibold text-lg">12% p.a.</p>
                </div>
              </div>

              <button 
                onClick={handleSaveGoal}
                className="w-full bg-white text-primary-600 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
              >
                Save This Goal
              </button>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <TrendingUp size={48} className="mb-4 opacity-20 text-primary-600" />
              <p>Enter your goal details to see your investment plan</p>
            </div>
          )}

          {/* User Goals List */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <h3 className="text-slate-900 font-semibold mb-4">Your Active Goals</h3>
            <div className="space-y-4">
              {userGoals.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-4">No goals added yet</p>
              ) : (
                userGoals.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500/10 text-green-600 p-2 rounded-lg">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{g.goalType}</p>
                        <p className="text-xs text-slate-500">₹{g.targetAmount.toLocaleString()} in {g.durationYears}y</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">₹{g.monthlyInvestment.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">per month</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteGoal(g.goalId)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Goal"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;
