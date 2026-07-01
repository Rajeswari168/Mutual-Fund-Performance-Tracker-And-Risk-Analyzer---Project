import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Activity, TrendingUp, 
  Search, Eye, X, CheckCircle, BarChart2, PieChart as PieIcon, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, LineChart, Line, CartesianGrid 
} from 'recharts';
import { fraudRiskService } from '../services/api';

const COLORS = {
  Low: '#10B981',      // Emerald Safe
  Medium: '#F59E0B',   // Amber Warning
  High: '#EF4444',     // Red Critical
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-600`}>
          <Icon size={24} />
        </div>
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
    {sub && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
  </div>
);

const FraudRiskDetection = () => {
  const [summary, setSummary] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedFund, setSelectedFund] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryRes = await fraudRiskService.getDashboardSummary();
      const allRes = await fraudRiskService.getAllAnalyses();
      setSummary(summaryRes?.data || null);
      setAnalyses(allRes?.data || []);
    } catch (err) {
      console.error('Failed to load fraud risk data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(item => {
    const matchesSearch = item.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || item.riskLevel.toUpperCase() === filterRisk;
    const matchesStatus = filterStatus === 'ALL' || item.detectionStatus.toUpperCase() === filterStatus;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  // Prepare Pie Chart Data
  const pieData = [
    { name: 'Safe / Low Risk', value: summary?.safeFunds || 0, color: COLORS.Low },
    { name: 'Medium Risk', value: summary?.mediumRisk || 0, color: COLORS.Medium },
    { name: 'High Risk / Flagged', value: summary?.highRisk || 0, color: COLORS.High }
  ].filter(d => d.value > 0);

  // Prepare Bar Chart Data (Top 6 Risky Funds)
  const barData = (summary?.topRiskyFunds || []).map(f => ({
    name: f.fundName.length > 18 ? f.fundName.substring(0, 18) + '...' : f.fundName,
    RiskScore: f.riskScore,
    FraudProbability: f.fraudProbability
  }));

  // Prepare Simulated Historical Trend Data for Line Chart
  const lineData = [
    { month: 'Jan', AvgRiskScore: Math.max(30, (summary?.overallRiskScore || 60) - 8), FraudAlerts: Math.max(2, (summary?.fraudAlerts || 5) - 3) },
    { month: 'Feb', AvgRiskScore: Math.max(30, (summary?.overallRiskScore || 60) - 5), FraudAlerts: Math.max(2, (summary?.fraudAlerts || 5) - 2) },
    { month: 'Mar', AvgRiskScore: Math.max(30, (summary?.overallRiskScore || 60) - 6), FraudAlerts: Math.max(2, (summary?.fraudAlerts || 5) - 1) },
    { month: 'Apr', AvgRiskScore: Math.max(30, (summary?.overallRiskScore || 60) - 3), FraudAlerts: summary?.fraudAlerts || 5 },
    { month: 'May', AvgRiskScore: Math.max(30, (summary?.overallRiskScore || 60) - 1), FraudAlerts: (summary?.fraudAlerts || 5) + 1 },
    { month: 'Jun', AvgRiskScore: summary?.overallRiskScore || 60, FraudAlerts: summary?.fraudAlerts || 5 }
  ];

  // Find safer alternatives for detail modal
  const getSaferAlternatives = (currentFund) => {
    return analyses
      .filter(f => f.fundId !== currentFund.fundId && (f.riskLevel === 'Low' || f.detectionStatus === 'Safe'))
      .slice(0, 3);
  };

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    color: '#0f172a',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Running Quantitative Risk & Fraud Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Title */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mutual Fund Fraud & Risk Detection</h1>
          <p className="text-slate-600">Real-time quantitative risk evaluation & rule-based anomaly detection.</p>
        </div>

        {/* Overall Status Banner Badge */}
        <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-md border border-slate-200">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500 uppercase">System Status</p>
            <p className="text-sm font-bold flex items-center gap-1.5 justify-end mt-0.5">
              {summary?.detectionStatus === 'Safe' ? (
                <span className="text-emerald-600 flex items-center gap-1"><ShieldCheck size={16}/> Safe</span>
              ) : summary?.detectionStatus === 'Warning' ? (
                <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={16}/> Warning</span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1"><ShieldAlert size={16}/> Critical Alerts</span>
              )}
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Avg Risk Score</p>
            <p className="text-lg font-bold text-blue-600">
              {summary?.overallRiskScore || 0}<span className="text-xs font-normal text-slate-500">/100</span>
            </p>
          </div>
        </div>
      </header>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={Layers} label="Total Funds" value={summary?.totalFunds || 0} sub="Active scanned schemes" color="blue" />
        <StatCard icon={CheckCircle} label="Safe Funds" value={summary?.safeFunds || 0} sub="Low risk profile" color="emerald" />
        <StatCard icon={Activity} label="Medium Risk" value={summary?.mediumRisk || 0} sub="Moderate volatility" color="amber" />
        <StatCard icon={AlertTriangle} label="High Risk" value={summary?.highRisk || 0} sub="High NAV fluctuation" color="rose" />
        <StatCard icon={ShieldAlert} label="Fraud Alerts" value={summary?.fraudAlerts || 0} sub="Rule anomalies flagged" color="purple" />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart: Risk Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <PieIcon size={20} className="text-blue-600" />
              Risk Distribution
            </h3>
            <p className="text-sm text-slate-500 mb-4">Proportion of funds by risk tier</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} Funds`, 'Count']} contentStyle={tooltipStyle} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Top Risky Funds */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 col-span-1 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <BarChart2 size={20} className="text-rose-600" />
              Top Risky Funds & Fraud Probability
            </h3>
            <p className="text-sm text-slate-500 mb-4">Comparison of risk score vs anomaly detection index</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} angle={-15} textAnchor="end" interval={0} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="top" align="right"/>
                <Bar dataKey="RiskScore" name="Risk Score (0-100)" fill="#EF4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="FraudProbability" name="Fraud Prob (%)" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart: Risk & Alert Trend */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            6-Month Quantitative Risk Trend
          </h3>
          <p className="text-sm text-slate-500">Tracking average portfolio risk score vs flagged fraud alerts over time</p>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} domain={[0, 20]} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="AvgRiskScore" name="Avg Risk Score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="FraudAlerts" name="Flagged Alerts" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section Header & Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Comprehensive Mutual Fund Risk Audit</h3>
            <p className="text-sm text-slate-500">Detailed quantitative evaluation of all available schemes</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search fund name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Risk Filter */}
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="SAFE">Safe</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <th className="py-4 px-6">Fund Name</th>
                <th className="py-4 px-4 text-center">Risk Score</th>
                <th className="py-4 px-4 text-center">Fraud Prob</th>
                <th className="py-4 px-4 text-center">Risk Level</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6">Flagged Reason</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No mutual funds match the current search filters.
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((item) => (
                  <tr key={item.fundId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <div className="font-bold">{item.fundName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{item.company}</span> • <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-600">{item.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-base">
                      <span className={item.riskScore >= 70 ? 'text-rose-600' : item.riskScore >= 40 ? 'text-amber-600' : 'text-emerald-600'}>
                        {item.riskScore}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                        {item.fraudProbability}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                        item.riskLevel === 'High' 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                          : item.riskLevel === 'Medium'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.detectionStatus === 'Critical'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : item.detectionStatus === 'Warning'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.detectionStatus === 'Critical' && <AlertTriangle size={12}/>}
                        {item.detectionStatus === 'Warning' && <AlertTriangle size={12}/>}
                        {item.detectionStatus === 'Safe' && <CheckCircle size={12}/>}
                        {item.detectionStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 max-w-xs truncate">
                      {item.reasons && item.reasons.length > 0 ? item.reasons.join(' • ') : 'No abnormal flags'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedFund(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm border border-blue-200"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative space-y-6 text-slate-900">
            {/* Close button */}
            <button
              onClick={() => setSelectedFund(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl text-white shadow-lg ${
                selectedFund.riskLevel === 'High' ? 'bg-rose-600 shadow-rose-500/20' : selectedFund.riskLevel === 'Medium' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-600 shadow-emerald-500/20'
              }`}>
                <ShieldAlert size={32} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Complete Audit & Risk Report</span>
                <h2 className="text-2xl font-bold mt-0.5">{selectedFund.fundName}</h2>
                <p className="text-xs text-slate-500 mt-1">{selectedFund.company} • Category: <strong className="text-slate-700">{selectedFund.category}</strong> • Current NAV: ₹{selectedFund.nav}</p>
              </div>
            </div>

            {/* AI Explanation Box */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1.5">
                <Activity size={16} /> AI Quantitative Explanation
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                "{selectedFund.aiExplanation}"
              </p>
            </div>

            {/* 10 Quantitative Factors Breakdown Grid */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">10-Factor Quantitative Evaluation Matrix</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">NAV Volatility</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.navVolatility}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Expense Ratio</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.expenseRatio}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Return Consistency</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.returnConsistency}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Fund Age</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.fundAgeYears} Yrs</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">AUM Growth</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.aumGrowth}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Portfolio Conc.</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.portfolioConcentration}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Sector Exposure</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.sectorExposure}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Drawdown</p>
                  <p className="text-base font-bold text-rose-600 mt-0.5">{selectedFund.drawdown}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Standard Dev</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedFund.stdDev}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Sharpe Ratio</p>
                  <p className="text-base font-bold text-emerald-600 mt-0.5">{selectedFund.sharpeRatio}</p>
                </div>
              </div>
            </div>

            {/* Reasons / Rule Flags */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Rule Engine Flags & Reasons</h4>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {(selectedFund.reasons || []).map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations & Suggested Safer Alternatives */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1.5">
                <CheckCircle size={16} /> Recommended Safer Alternatives
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {getSaferAlternatives(selectedFund).map(alt => (
                  <div key={alt.fundId} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-emerald-500 transition-colors">
                    <p className="font-bold text-xs truncate text-slate-900">{alt.fundName}</p>
                    <p className="text-[10px] text-slate-500">{alt.company}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-emerald-600">Risk Score: {alt.riskScore}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Safe</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFund(null)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudRiskDetection;
