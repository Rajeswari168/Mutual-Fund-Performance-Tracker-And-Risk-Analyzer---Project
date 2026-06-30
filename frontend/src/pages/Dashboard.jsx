import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Wallet, TrendingUp, Target, ShieldCheck } from 'lucide-react';
import { investmentService, goalService } from '../services/api';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-600`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-600">
          +{trend}%
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalInvested: 0,
    portfolioValue: 0,
    activeGoals: 0,
    riskScore: 'Low'
  });
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await investmentService.getInvestments(user.id);
        setInvestments(invRes.data);
        
        const total = invRes.data.reduce((acc, curr) => acc + curr.amount, 0);
        const goalRes = await goalService.getGoals(user.id);
        
        setStats({
          totalInvested: total,
          portfolioValue: total * 1.15, // Mock appreciation
          activeGoals: goalRes.data.length,
          riskScore: total > 200000 ? 'High' : (total > 50000 ? 'Medium' : 'Low')
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, [user.id]);

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ];

  const pieData = [
    { name: 'Equity', value: 60 },
    { name: 'Debt', value: 30 },
    { name: 'Gold', value: 10 },
  ];

  const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b'];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
        <p className="text-slate-600">Here's what's happening with your investments today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Wallet} label="Total Invested" value={`₹${stats.totalInvested.toLocaleString()}`} trend="12" color="blue" />
        <StatCard icon={TrendingUp} label="Portfolio Value" value={`₹${Math.round(stats.portfolioValue).toLocaleString()}`} trend="15" color="indigo" />
        <StatCard icon={Target} label="Active Goals" value={stats.activeGoals} color="amber" />
        <StatCard icon={ShieldCheck} label="Overall Risk" value={stats.riskScore} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Investment Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'}}
                />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Asset Allocation</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
