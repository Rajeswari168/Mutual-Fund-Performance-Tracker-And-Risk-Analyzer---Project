import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MutualFunds from './pages/MutualFunds';
import GoalPlanner from './pages/GoalPlanner';
import RiskAnalyzer from './pages/RiskAnalyzer';
import FraudRiskDetection from './pages/FraudRiskDetection';
import Portfolio from './pages/Portfolio';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';


function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard user={user} />} />
            <Route path="funds" element={<MutualFunds user={user} />} />
            <Route path="goals" element={<GoalPlanner user={user} />} />
            <Route path="risk" element={<RiskAnalyzer user={user} />} />
            <Route path="fraud-risk" element={<FraudRiskDetection user={user} />} />
            <Route path="portfolio" element={<Portfolio user={user} />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

