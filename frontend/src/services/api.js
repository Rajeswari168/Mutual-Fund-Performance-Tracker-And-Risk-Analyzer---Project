import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// â”€â”€â”€ LocalStorage helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ls = {
  get: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};

const DEMO_FUNDS = [
  { fundId: 1, fundName: 'Aditya Birla Sun Life Frontline Equity', company: 'Aditya Birla', category: 'Equity', nav: 350.2, riskLevel: 'High Risk', returns1y: 12.5, returns3y: 11.8, returns5y: 13.5 },
  { fundId: 2, fundName: 'Axis Midcap Fund', company: 'Axis Mutual Fund', category: 'Equity', nav: 65.3, riskLevel: 'High Risk', returns1y: 18.4, returns3y: 15.1, returns5y: 17.5 },
  { fundId: 3, fundName: 'Bandhan Sterling Value Fund', company: 'Bandhan Mutual Fund', category: 'Equity', nav: 95.2, riskLevel: 'High Risk', returns1y: 20.4, returns3y: 16.8, returns5y: 18.5 },
  { fundId: 4, fundName: 'Baroda BNP Paribas Large Cap Fund', company: 'Baroda BNP Paribas', category: 'Equity', nav: 145.2, riskLevel: 'High Risk', returns1y: 12.8, returns3y: 12.1, returns5y: 13.8 },
  { fundId: 5, fundName: 'BlackRock Global Allocation Fund', company: 'BlackRock', category: 'International', nav: 52.8, riskLevel: 'High Risk', returns1y: 18.5, returns3y: 14.2, returns5y: 16.5 },
  { fundId: 6, fundName: 'BOI AXA Conservative Hybrid Fund', company: 'BOI AXA', category: 'Hybrid', nav: 22.5, riskLevel: 'Low Risk', returns1y: 8.5, returns3y: 8.2, returns5y: 8.4 },
  { fundId: 7, fundName: 'Canara Robeco Bluechip Equity Fund', company: 'Canara Robeco', category: 'Equity', nav: 44.5, riskLevel: 'High Risk', returns1y: 13.5, returns3y: 12.8, returns5y: 14.2 },
  { fundId: 8, fundName: 'DSP Tax Saver Fund', company: 'DSP Mutual Fund', category: 'Equity', nav: 92.1, riskLevel: 'High Risk', returns1y: 16.8, returns3y: 14.2, returns5y: 15.5 },
  { fundId: 9, fundName: 'Edelweiss Arbitrage Fund', company: 'Edelweiss', category: 'Hybrid', nav: 15.8, riskLevel: 'Low Risk', returns1y: 7.2, returns3y: 6.8, returns5y: 7.1 },
  { fundId: 10, fundName: 'Escorts Tax Plan', company: 'Escorts Mutual Fund', category: 'Equity', nav: 112.4, riskLevel: 'High Risk', returns1y: 15.5, returns3y: 14.2, returns5y: 15.8 },
  { fundId: 11, fundName: 'Fidelity Contrafund', company: 'Fidelity', category: 'International', nav: 155.3, riskLevel: 'High Risk', returns1y: 19.2, returns3y: 17.5, returns5y: 18.8 },
  { fundId: 12, fundName: 'Franklin India Prima Fund', company: 'Franklin Templeton', category: 'Equity', nav: 1550.4, riskLevel: 'High Risk', returns1y: 18.2, returns3y: 15.5, returns5y: 16.8 },
  { fundId: 13, fundName: 'Goldman Sachs Nifty BeES', company: 'Goldman Sachs', category: 'ETF', nav: 215.4, riskLevel: 'Medium Risk', returns1y: 11.8, returns3y: 11.2, returns5y: 12.5 },
  { fundId: 14, fundName: 'Groww Nifty Total Market Index Fund', company: 'Groww Mutual Fund', category: 'Index', nav: 10.2, riskLevel: 'Medium Risk', returns1y: 15.4, returns3y: 13.2, returns5y: 14.8 },
  { fundId: 15, fundName: 'HDFC Small Cap Fund', company: 'HDFC Mutual Fund', category: 'Equity', nav: 45.2, riskLevel: 'High Risk', returns1y: 22.1, returns3y: 18.5, returns5y: 20.1 },
  { fundId: 16, fundName: 'HSBC Value Fund', company: 'HSBC Mutual Fund', category: 'Equity', nav: 65.4, riskLevel: 'High Risk', returns1y: 21.4, returns3y: 17.2, returns5y: 19.1 },
  { fundId: 17, fundName: 'ICICI Prudential Liquid Fund', company: 'ICICI Mutual Fund', category: 'Debt', nav: 120.5, riskLevel: 'Low Risk', returns1y: 6.5, returns3y: 6.2, returns5y: 6.8 },
  { fundId: 18, fundName: 'IDBI Nifty Index Fund', company: 'IDBI Mutual Fund', category: 'Index', nav: 32.8, riskLevel: 'Medium Risk', returns1y: 11.5, returns3y: 11.0, returns5y: 12.1 },
  { fundId: 19, fundName: 'IDFC First Liquid Fund', company: 'IDFC Mutual Fund', category: 'Debt', nav: 105.2, riskLevel: 'Low Risk', returns1y: 6.2, returns3y: 6.0, returns5y: 6.3 },
  { fundId: 20, fundName: 'IIFL Focused Equity Fund', company: 'IIFL Mutual Fund', category: 'Equity', nav: 32.4, riskLevel: 'High Risk', returns1y: 17.5, returns3y: 15.2, returns5y: 16.8 },
  { fundId: 21, fundName: 'Indiabulls Liquid Fund', company: 'Indiabulls', category: 'Debt', nav: 1120.4, riskLevel: 'Low Risk', returns1y: 6.4, returns3y: 6.1, returns5y: 6.5 },
  { fundId: 22, fundName: 'Invesco India Growth Opportunities Fund', company: 'Invesco India', category: 'Equity', nav: 52.3, riskLevel: 'High Risk', returns1y: 14.8, returns3y: 13.2, returns5y: 14.5 },
  { fundId: 23, fundName: 'ITI Small Cap Fund', company: 'ITI Mutual Fund', category: 'Equity', nav: 15.6, riskLevel: 'High Risk', returns1y: 22.8, returns3y: 18.5, returns5y: 20.2 },
  { fundId: 24, fundName: 'JM Financial Large Cap Fund', company: 'JM Financial', category: 'Equity', nav: 85.3, riskLevel: 'High Risk', returns1y: 13.2, returns3y: 12.5, returns5y: 14.1 },
  { fundId: 25, fundName: 'JPMorgan Emerging Markets Equity', company: 'JPMorgan', category: 'International', nav: 85.2, riskLevel: 'High Risk', returns1y: 12.5, returns3y: 11.2, returns5y: 13.8 },
  { fundId: 26, fundName: 'Kotak Standard Multicap Fund', company: 'Kotak Mutual Fund', category: 'Equity', nav: 55.1, riskLevel: 'Medium Risk', returns1y: 12.3, returns3y: 11.5, returns5y: 13.2 },
  { fundId: 27, fundName: 'L&T Emerging Businesses Fund', company: 'L&T Mutual Fund', category: 'Equity', nav: 48.6, riskLevel: 'High Risk', returns1y: 24.2, returns3y: 19.5, returns5y: 21.8 },
  { fundId: 28, fundName: 'LIC MF Infrastructure Fund', company: 'LIC Mutual Fund', category: 'Sectoral', nav: 28.4, riskLevel: 'High Risk', returns1y: 19.2, returns3y: 16.5, returns5y: 17.8 },
  { fundId: 29, fundName: 'Mahindra Manulife Multi Cap Badhat Fund', company: 'Mahindra Manulife', category: 'Equity', nav: 18.6, riskLevel: 'High Risk', returns1y: 17.5, returns3y: 15.8, returns5y: 16.5 },
  { fundId: 30, fundName: 'Mirae Asset Large Cap Fund', company: 'Mirae Asset', category: 'Equity', nav: 82.3, riskLevel: 'High Risk', returns1y: 14.2, returns3y: 13.5, returns5y: 15.1 },
  { fundId: 31, fundName: 'Motilal Oswal Nasdaq 100 FOF', company: 'Motilal Oswal', category: 'International', nav: 95.2, riskLevel: 'High Risk', returns1y: 32.4, returns3y: 18.5, returns5y: 21.2 },
  { fundId: 32, fundName: 'Navi Nifty 50 Index Fund', company: 'Navi Mutual Fund', category: 'Index', nav: 12.5, riskLevel: 'Medium Risk', returns1y: 12.1, returns3y: 11.5, returns5y: 12.8 },
  { fundId: 33, fundName: 'Nippon India Small Cap Fund', company: 'Nippon India', category: 'Equity', nav: 38.9, riskLevel: 'High Risk', returns1y: 25.4, returns3y: 21.2, returns5y: 22.8 },
  { fundId: 34, fundName: 'Parag Parikh Flexi Cap Fund', company: 'Parag Parikh', category: 'Equity', nav: 58.6, riskLevel: 'Medium Risk', returns1y: 19.5, returns3y: 17.8, returns5y: 18.2 },
  { fundId: 35, fundName: 'PGIM India Midcap Opportunities Fund', company: 'PGIM India', category: 'Equity', nav: 42.6, riskLevel: 'High Risk', returns1y: 26.5, returns3y: 20.8, returns5y: 23.5 },
  { fundId: 36, fundName: 'Pictet Clean Energy Fund', company: 'Pictet', category: 'International', nav: 32.4, riskLevel: 'High Risk', returns1y: 22.5, returns3y: 18.2, returns5y: 20.5 },
  { fundId: 37, fundName: 'PPFAS Conservative Hybrid Fund', company: 'Parag Parikh', category: 'Hybrid', nav: 14.2, riskLevel: 'Low Risk', returns1y: 9.5, returns3y: 8.8, returns5y: 9.2 },
  { fundId: 38, fundName: 'Principal Emerging Bluechip Fund', company: 'Principal', category: 'Equity', nav: 185.2, riskLevel: 'High Risk', returns1y: 21.2, returns3y: 18.5, returns5y: 20.1 },
  { fundId: 39, fundName: 'Quant Small Cap Fund', company: 'Quant Mutual Fund', category: 'Equity', nav: 158.4, riskLevel: 'High Risk', returns1y: 35.2, returns3y: 28.4, returns5y: 30.1 },
  { fundId: 40, fundName: 'Quantum Long Term Equity Value Fund', company: 'Quantum', category: 'Equity', nav: 88.5, riskLevel: 'Medium Risk', returns1y: 14.5, returns3y: 13.8, returns5y: 14.2 },
  { fundId: 41, fundName: 'Sahara Wealth Plus Fund', company: 'Sahara Mutual Fund', category: 'Equity', nav: 42.6, riskLevel: 'High Risk', returns1y: 12.8, returns3y: 11.5, returns5y: 12.4 },
  { fundId: 42, fundName: 'Samco Flexi Cap Fund', company: 'Samco Mutual Fund', category: 'Equity', nav: 11.4, riskLevel: 'High Risk', returns1y: 14.2, returns3y: 12.8, returns5y: 13.5 },
  { fundId: 43, fundName: 'SBI Bluechip Fund', company: 'SBI Mutual Fund', category: 'Equity', nav: 75.4, riskLevel: 'High Risk', returns1y: 15.5, returns3y: 12.2, returns5y: 14.8 },
  { fundId: 44, fundName: 'Schroders Global Climate Change', company: 'Schroders', category: 'International', nav: 28.6, riskLevel: 'High Risk', returns1y: 20.8, returns3y: 17.5, returns5y: 19.2 },
  { fundId: 45, fundName: 'Shriram Flexi Cap Fund', company: 'Shriram Mutual Fund', category: 'Equity', nav: 15.8, riskLevel: 'High Risk', returns1y: 14.8, returns3y: 13.5, returns5y: 14.2 },
  { fundId: 46, fundName: 'Sundaram Large Cap Fund', company: 'Sundaram Mutual Fund', category: 'Equity', nav: 62.3, riskLevel: 'High Risk', returns1y: 13.8, returns3y: 12.5, returns5y: 14.1 },
  { fundId: 47, fundName: 'Tata Digital India Fund', company: 'Tata Mutual Fund', category: 'Sectoral', nav: 35.8, riskLevel: 'High Risk', returns1y: 28.5, returns3y: 22.1, returns5y: 25.4 },
  { fundId: 48, fundName: 'Taurus Discovery Midcap Fund', company: 'Taurus Mutual Fund', category: 'Equity', nav: 65.2, riskLevel: 'High Risk', returns1y: 19.5, returns3y: 16.2, returns5y: 18.4 },
  { fundId: 49, fundName: 'Trust Liquid Fund', company: 'Trust Mutual Fund', category: 'Debt', nav: 1005.4, riskLevel: 'Low Risk', returns1y: 6.3, returns3y: 6.1, returns5y: 6.2 },
  { fundId: 50, fundName: 'Union Flexi Cap Fund', company: 'Union Mutual Fund', category: 'Equity', nav: 32.4, riskLevel: 'High Risk', returns1y: 15.8, returns3y: 14.2, returns5y: 15.1 },
  { fundId: 51, fundName: 'UTI Nifty 50 Index Fund', company: 'UTI Mutual Fund', category: 'Index', nav: 115.2, riskLevel: 'Medium Risk', returns1y: 11.8, returns3y: 11.2, returns5y: 12.5 },
  { fundId: 52, fundName: 'Vanguard 500 Index Fund', company: 'Vanguard', category: 'International', nav: 420.5, riskLevel: 'Medium Risk', returns1y: 15.4, returns3y: 14.8, returns5y: 16.2 },
  { fundId: 53, fundName: 'WhiteOak Capital Flexi Cap Fund', company: 'WhiteOak Capital', category: 'Equity', nav: 13.2, riskLevel: 'High Risk', returns1y: 16.5, returns3y: 14.8, returns5y: 15.4 }
];

// â”€â”€â”€ Offline service layer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const offline = {
  auth: {
    register: ({ name, email, password }) => {
      const users = ls.get('sf_users') || [];
      if (users.find(u => u.email === email)) throw new Error('Email already registered');
      const user = { id: Date.now(), name, email, password };
      ls.set('sf_users', [...users, user]);
      return { data: { message: 'Registered successfully' } };
    },
    login: ({ email, password }) => {
      const users = ls.get('sf_users') || [];
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      const { password: _, ...safeUser } = user;
      return { data: safeUser };
    },
  },
  funds: {
    getAll: () => ({ data: ls.get('sf_funds') || DEMO_FUNDS }),
    getOne: (id) => ({ data: (ls.get('sf_funds') || DEMO_FUNDS).find(f => f.fundId === parseInt(id)) }),
  },
  goals: {
    add: ({ userId, goalType, targetAmount, durationYears, monthlyInvestment }) => {
      const goals = ls.get(`sf_goals_${userId}`) || [];
      const goal = { goalId: Date.now(), userId, goalType, targetAmount: parseFloat(targetAmount), durationYears: parseInt(durationYears), monthlyInvestment: parseFloat(monthlyInvestment) };
      ls.set(`sf_goals_${userId}`, [...goals, goal]);
      return { data: goal };
    },
    getByUser: (userId) => ({ data: ls.get(`sf_goals_${userId}`) || [] }),
    calculate: ({ targetAmount, durationYears }) => {
      const r = 0.12 / 12;
      const n = parseInt(durationYears) * 12;
      const sip = (parseFloat(targetAmount) * r) / (Math.pow(1 + r, n) - 1);
      return { data: { requiredSIP: Math.ceil(sip), targetAmount: parseFloat(targetAmount), durationYears: parseInt(durationYears) } };
    },
    delete: (goalId) => {
      // find and remove from all user goal lists
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sf_goals_')) {
          const goals = ls.get(key) || [];
          ls.set(key, goals.filter(g => g.goalId !== goalId));
        }
      }
      return { data: { message: 'Deleted' } };
    },
  },
  investments: {
    add: ({ userId, fundId, amount }) => {
      const investments = ls.get(`sf_investments_${userId}`) || [];
      const inv = { investmentId: Date.now(), userId, fundId: parseInt(fundId), amount: parseFloat(amount), investmentDate: new Date().toISOString() };
      ls.set(`sf_investments_${userId}`, [...investments, inv]);
      return { data: inv };
    },
    getByUser: (userId) => ({ data: ls.get(`sf_investments_${userId}`) || [] }),
    analyzeRisk: ({ totalInvested, riskTolerance }) => {
      const score = riskTolerance === 'High' ? 8.5 : riskTolerance === 'Medium' ? 5.5 : 3.0;
      return { data: { riskScore: score, recommendation: score > 7 ? 'Aggressive Growth Portfolio' : score > 4 ? 'Balanced Portfolio' : 'Conservative Portfolio' } };
    },
  },
  fraudRisk: {
    getAll: () => {
      const funds = ls.get('sf_funds') || DEMO_FUNDS;
      const analyses = funds.map(f => {
        let hash = 0;
        for (let i = 0; i < f.fundName.length; i++) hash = (hash * 31 + f.fundName.charCodeAt(i)) % 10000;
        const isHigh = f.riskLevel === 'High Risk' || f.returns1y > 22.0;
        const isLow = f.riskLevel === 'Low Risk' || f.category === 'Debt' || f.category === 'Hybrid';
        const navVol = isHigh ? (18.0 + (hash % 120)/10.0) : (isLow ? (2.0 + (hash % 40)/10.0) : (10.0 + (hash % 60)/10.0));
        const expRatio = isHigh ? (1.2 + (hash % 130)/100.0) : (0.4 + (hash % 70)/100.0);
        const retCons = isHigh ? (62.0 + (hash % 180)/10.0) : (82.0 + (hash % 140)/10.0);
        const fundAge = 3 + (hash % 13);
        const aumGr = -8.0 + (hash % 450)/10.0;
        const portConc = isHigh ? (45.0 + (hash % 300)/10.0) : (22.0 + (hash % 200)/10.0);
        const secExp = isHigh ? (38.0 + (hash % 280)/10.0) : (18.0 + (hash % 200)/10.0);
        const drawd = isHigh ? (-18.0 - (hash % 160)/10.0) : (-3.0 - (hash % 60)/10.0);
        const stDev = navVol * 0.95;
        const sharpe = isHigh ? (1.4 + (hash % 110)/100.0) : (0.8 + (hash % 80)/100.0);

        let riskScore = isHigh ? (72 + (hash % 23)) : (isLow ? (18 + (hash % 21)) : (45 + (hash % 23)));
        if (f.returns1y > 30.0) riskScore = Math.max(riskScore, 85);
        const rLevel = riskScore >= 70 ? 'High' : (riskScore >= 40 ? 'Medium' : 'Low');

        let fraudProb = 12 + (hash % 18);
        const reasonsList = [];
        if (f.returns1y > 30.0) {
          fraudProb += 35 + (hash % 20);
          reasonsList.push('Extremely high recent returns (>30%)');
        }
        if (expRatio > 2.0) {
          fraudProb += 22;
          reasonsList.push('Expense ratio unusually high (>2.0%)');
        }
        if (portConc > 65.0) {
          fraudProb += 18;
          reasonsList.push('Concentrated portfolio exposure');
        }
        if (navVol > 24.0) {
          fraudProb += 15;
          reasonsList.push('Sudden NAV fluctuations');
        }
        fraudProb = Math.min(96, fraudProb);

        let status = 'Safe';
        if (fraudProb >= 65 || riskScore >= 82) {
          status = 'Critical';
          if (reasonsList.length === 0) reasonsList.push('High NAV fluctuation & sector risk');
        } else if (fraudProb >= 38 || riskScore >= 68) {
          status = 'Warning';
          if (reasonsList.length === 0) reasonsList.push('Moderate return volatility');
        } else {
          if (reasonsList.length === 0) reasonsList.push('Consistent return pattern');
        }

        const explanation = `This mutual fund is classified as ${rLevel} Risk (Score: ${riskScore}/100) due to NAV volatility of ${navVol.toFixed(1)}%, expense ratio of ${expRatio.toFixed(2)}%, and historical drawdown reaching ${drawd.toFixed(1)}%. ${status !== 'Safe' ? 'Rule engine flagged potential anomalies: ' + reasonsList.join(', ') + '. Investors should exercise extra diligence.' : 'The fund displays stable institutional ownership and reliable return consistency over multi-year cycles.'}`;

        return {
          fundId: f.fundId,
          fundName: f.fundName,
          company: f.company,
          category: f.category,
          nav: f.nav,
          returns1y: f.returns1y,
          returns3y: f.returns3y,
          returns5y: f.returns5y,
          riskScore,
          riskLevel: rLevel,
          fraudProbability: fraudProb,
          detectionStatus: status,
          reasons: reasonsList,
          aiExplanation: explanation,
          navVolatility: parseFloat(navVol.toFixed(2)),
          expenseRatio: parseFloat(expRatio.toFixed(2)),
          returnConsistency: parseFloat(retCons.toFixed(1)),
          fundAgeYears: fundAge,
          aumGrowth: parseFloat(aumGr.toFixed(1)),
          portfolioConcentration: parseFloat(portConc.toFixed(1)),
          sectorExposure: parseFloat(secExp.toFixed(1)),
          drawdown: parseFloat(drawd.toFixed(1)),
          stdDev: parseFloat(stDev.toFixed(2)),
          sharpeRatio: parseFloat(sharpe.toFixed(2)),
        };
      });
      return { data: analyses };
    },
    getDashboardSummary: () => {
      const { data: all } = offline.fraudRisk.getAll();
      const totalFunds = all.length;
      let safeFunds = 0, mediumRisk = 0, highRisk = 0, fraudAlerts = 0, totalRiskScore = 0;
      all.forEach(a => {
        totalRiskScore += a.riskScore;
        if (a.riskLevel === 'Low') safeFunds++;
        else if (a.riskLevel === 'Medium') mediumRisk++;
        else if (a.riskLevel === 'High') highRisk++;
        if (a.detectionStatus === 'Warning' || a.detectionStatus === 'Critical') fraudAlerts++;
      });
      const topRisky = [...all].sort((o1, o2) => o2.riskScore - o1.riskScore).slice(0, 6);
      const overallRiskScore = totalFunds > 0 ? Math.round(totalRiskScore / totalFunds) : 50;
      const overallRiskLevel = overallRiskScore >= 70 ? 'High' : (overallRiskScore >= 40 ? 'Medium' : 'Low');
      const detectionStatus = fraudAlerts >= 5 ? 'Warning' : (fraudAlerts > 15 ? 'Critical' : 'Safe');
      return {
        data: {
          overallRiskScore,
          overallRiskLevel,
          detectionStatus,
          totalFunds,
          safeFunds,
          mediumRisk,
          highRisk,
          fraudAlerts,
          topRiskyFunds: topRisky,
        }
      };
    },
  },
};

// ─── API factory: uses real backend if VITE_API_BASE_URL is set ──────────────
const api = API_BASE_URL
  ? axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })
  : null;

const tryApi = async (apiCall, fallback) => {
  if (!api) return fallback();
  try { return await apiCall(); }
  catch { return fallback(); }
};

// ─── Exported services ────────────────────────────────────────────────────────
export const authService = {
  login: (creds) => tryApi(() => api.post('/auth/login', creds), () => offline.auth.login(creds)),
  register: (user) => tryApi(() => api.post('/auth/register', user), () => offline.auth.register(user)),
};

export const fundService = {
  getFunds: () => tryApi(() => api.get('/funds'), () => offline.funds.getAll()),
  getFund: (id) => tryApi(() => api.get(`/funds/${id}`), () => offline.funds.getOne(id)),
};

export const goalService = {
  addGoal: (goal) => tryApi(() => api.post('/goals', goal), () => offline.goals.add(goal)),
  getGoals: (userId) => tryApi(() => api.get(`/goals/user/${userId}`), () => offline.goals.getByUser(userId)),
  calculate: (params) => tryApi(() => api.post('/goals/calculate', params), () => offline.goals.calculate(params)),
  deleteGoal: (id) => tryApi(() => api.delete(`/goals/${id}`), () => offline.goals.delete(id)),
};

export const investmentService = {
  addInvestment: (inv) => tryApi(() => api.post('/investments', inv), () => offline.investments.add(inv)),
  getInvestments: (userId) => tryApi(() => api.get(`/investments/user/${userId}`), () => offline.investments.getByUser(userId)),
  analyzeRisk: (params) => tryApi(() => api.post('/investments/risk-analyze', params), () => offline.investments.analyzeRisk(params)),
};

export const fraudRiskService = {
  getDashboardSummary: () => tryApi(() => api.get('/fraud-risk/dashboard'), () => offline.fraudRisk.getDashboardSummary()),
  getAllAnalyses: () => tryApi(() => api.get('/fraud-risk/analyses'), () => offline.fraudRisk.getAll()),
};

export default api;


