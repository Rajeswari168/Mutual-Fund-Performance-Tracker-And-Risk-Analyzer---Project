CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mutual_funds (
    fund_id INT AUTO_INCREMENT PRIMARY KEY,
    fund_name VARCHAR(150),
    company VARCHAR(100),
    category VARCHAR(50),
    nav DECIMAL(10,2),
    risk_level VARCHAR(20),
    returns_1y DECIMAL(5,2),
    returns_3y DECIMAL(5,2),
    returns_5y DECIMAL(5,2)
);

CREATE TABLE IF NOT EXISTS investments (
    investment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    fund_id INT,
    amount DECIMAL(10,2),
    investment_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (fund_id) REFERENCES mutual_funds(fund_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    goal_type VARCHAR(100),
    target_amount DECIMAL(12,2),
    duration_years INT,
    monthly_investment DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fraud_risk_analysis (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,
    fund_id INT,
    risk_score INT,
    risk_level VARCHAR(20),
    fraud_probability INT,
    detection_status VARCHAR(20),
    reasons VARCHAR(500),
    ai_explanation TEXT,
    nav_volatility DOUBLE,
    expense_ratio DOUBLE,
    return_consistency DOUBLE,
    fund_age_years INT,
    aum_growth DOUBLE,
    portfolio_concentration DOUBLE,
    sector_exposure DOUBLE,
    drawdown DOUBLE,
    std_dev DOUBLE,
    sharpe_ratio DOUBLE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fund_id) REFERENCES mutual_funds(fund_id) ON DELETE CASCADE
);


-- Insert 50+ mutual funds across different categories
INSERT IGNORE INTO mutual_funds (fund_name, company, category, nav, risk_level, returns_1y, returns_3y, returns_5y) VALUES
('SBI Bluechip Fund', 'SBI Mutual Fund', 'Equity', 75.40, 'High Risk', 15.5, 12.2, 14.8),
('HDFC Small Cap Fund', 'HDFC Mutual Fund', 'Equity', 45.20, 'High Risk', 22.1, 18.5, 20.1),
('ICICI Prudential Liquid Fund', 'ICICI Mutual Fund', 'Debt', 120.50, 'Low Risk', 6.5, 6.2, 6.8),
('Axis Midcap Fund', 'Axis Mutual Fund', 'Equity', 65.30, 'High Risk', 18.4, 15.1, 17.5),
('Kotak Standard Multicap Fund', 'Kotak Mutual Fund', 'Equity', 55.10, 'Medium Risk', 12.3, 11.5, 13.2),
('Mirae Asset Large Cap Fund', 'Mirae Asset', 'Equity', 82.30, 'High Risk', 14.2, 13.5, 15.1),
('Nippon India Small Cap Fund', 'Nippon India', 'Equity', 38.90, 'High Risk', 25.4, 21.2, 22.8),
('UTI Nifty 50 Index Fund', 'UTI Mutual Fund', 'Index', 115.20, 'Medium Risk', 11.8, 11.2, 12.5),
('Parag Parikh Flexi Cap Fund', 'Parag Parikh', 'Equity', 58.60, 'Medium Risk', 19.5, 17.8, 18.2),
('DSP Tax Saver Fund', 'DSP Mutual Fund', 'Equity', 92.10, 'High Risk', 16.8, 14.2, 15.5),
('Canara Robeco Bluechip Equity Fund', 'Canara Robeco', 'Equity', 44.50, 'High Risk', 13.5, 12.8, 14.2),
('IDFC First Liquid Fund', 'IDFC Mutual Fund', 'Debt', 105.20, 'Low Risk', 6.2, 6.0, 6.3),
('Franklin India Prima Fund', 'Franklin Templeton', 'Equity', 1550.40, 'High Risk', 18.2, 15.5, 16.8),
('Invesco India Growth Opportunities Fund', 'Invesco India', 'Equity', 52.30, 'High Risk', 14.8, 13.2, 14.5),
('Tata Digital India Fund', 'Tata Mutual Fund', 'Sectoral', 35.80, 'High Risk', 28.5, 22.1, 25.4),
('Motilal Oswal Nasdaq 100 FOF', 'Motilal Oswal', 'International', 95.20, 'High Risk', 32.4, 18.5, 21.2),
('Aditya Birla Sun Life Frontline Equity', 'Aditya Birla', 'Equity', 350.20, 'High Risk', 12.5, 11.8, 13.5),
('L&T Emerging Businesses Fund', 'L&T Mutual Fund', 'Equity', 48.60, 'High Risk', 24.2, 19.5, 21.8),
('Sundaram Large Cap Fund', 'Sundaram Mutual Fund', 'Equity', 62.30, 'High Risk', 13.8, 12.5, 14.1),
('Edelweiss Arbitrage Fund', 'Edelweiss', 'Hybrid', 15.80, 'Low Risk', 7.2, 6.8, 7.1),
('Quantum Long Term Equity Value Fund', 'Quantum', 'Equity', 88.50, 'Medium Risk', 14.5, 13.8, 14.2),
('PGIM India Midcap Opportunities Fund', 'PGIM India', 'Equity', 42.60, 'High Risk', 26.5, 20.8, 23.5),
('Union Flexi Cap Fund', 'Union Mutual Fund', 'Equity', 32.40, 'High Risk', 15.8, 14.2, 15.1),
('BOI AXA Conservative Hybrid Fund', 'BOI AXA', 'Hybrid', 22.50, 'Low Risk', 8.5, 8.2, 8.4),
('LIC MF Infrastructure Fund', 'LIC Mutual Fund', 'Sectoral', 28.40, 'High Risk', 19.2, 16.5, 17.8),
('Baroda BNP Paribas Large Cap Fund', 'Baroda BNP Paribas', 'Equity', 145.20, 'High Risk', 12.8, 12.1, 13.8),
('Mahindra Manulife Multi Cap Badhat Fund', 'Mahindra Manulife', 'Equity', 18.60, 'High Risk', 17.5, 15.8, 16.5),
('HSBC Value Fund', 'HSBC Mutual Fund', 'Equity', 65.40, 'High Risk', 21.4, 17.2, 19.1),
('IDBI Nifty Index Fund', 'IDBI Mutual Fund', 'Index', 32.80, 'Medium Risk', 11.5, 11.0, 12.1),
('Indiabulls Liquid Fund', 'Indiabulls', 'Debt', 1120.40, 'Low Risk', 6.4, 6.1, 6.5),
('Navi Nifty 50 Index Fund', 'Navi Mutual Fund', 'Index', 12.50, 'Medium Risk', 12.1, 11.5, 12.8),
('Groww Nifty Total Market Index Fund', 'Groww Mutual Fund', 'Index', 10.20, 'Medium Risk', 15.4, 13.2, 14.8),
('Samco Flexi Cap Fund', 'Samco Mutual Fund', 'Equity', 11.40, 'High Risk', 14.2, 12.8, 13.5),
('ITI Small Cap Fund', 'ITI Mutual Fund', 'Equity', 15.60, 'High Risk', 22.8, 18.5, 20.2),
('WhiteOak Capital Flexi Cap Fund', 'WhiteOak Capital', 'Equity', 13.20, 'High Risk', 16.5, 14.8, 15.4),
('Trust Liquid Fund', 'Trust Mutual Fund', 'Debt', 1005.40, 'Low Risk', 6.3, 6.1, 6.2),
('Bandhan Sterling Value Fund', 'Bandhan Mutual Fund', 'Equity', 95.20, 'High Risk', 20.4, 16.8, 18.5),
('Quant Small Cap Fund', 'Quant Mutual Fund', 'Equity', 158.40, 'High Risk', 35.2, 28.4, 30.1),
('PPFAS Conservative Hybrid Fund', 'Parag Parikh', 'Hybrid', 14.20, 'Low Risk', 9.5, 8.8, 9.2),
('JM Financial Large Cap Fund', 'JM Financial', 'Equity', 85.30, 'High Risk', 13.2, 12.5, 14.1),
('Escorts Tax Plan', 'Escorts Mutual Fund', 'Equity', 112.40, 'High Risk', 15.5, 14.2, 15.8),
('Taurus Discovery Midcap Fund', 'Taurus Mutual Fund', 'Equity', 65.20, 'High Risk', 19.5, 16.2, 18.4),
('Shriram Flexi Cap Fund', 'Shriram Mutual Fund', 'Equity', 15.80, 'High Risk', 14.8, 13.5, 14.2),
('IIFL Focused Equity Fund', 'IIFL Mutual Fund', 'Equity', 32.40, 'High Risk', 17.5, 15.2, 16.8),
('Principal Emerging Bluechip Fund', 'Principal', 'Equity', 185.20, 'High Risk', 21.2, 18.5, 20.1),
('Sahara Wealth Plus Fund', 'Sahara Mutual Fund', 'Equity', 42.60, 'High Risk', 12.8, 11.5, 12.4),
('Goldman Sachs Nifty BeES', 'Goldman Sachs', 'ETF', 215.40, 'Medium Risk', 11.8, 11.2, 12.5),
('BlackRock Global Allocation Fund', 'BlackRock', 'International', 52.80, 'High Risk', 18.5, 14.2, 16.5),
('Vanguard 500 Index Fund', 'Vanguard', 'International', 420.50, 'Medium Risk', 15.4, 14.8, 16.2),
('JPMorgan Emerging Markets Equity', 'JPMorgan', 'International', 85.20, 'High Risk', 12.5, 11.2, 13.8),
('Fidelity Contrafund', 'Fidelity', 'International', 155.30, 'High Risk', 19.2, 17.5, 18.8),
('Pictet Clean Energy Fund', 'Pictet', 'International', 32.40, 'High Risk', 22.5, 18.2, 20.5),
('Schroders Global Climate Change', 'Schroders', 'International', 28.60, 'High Risk', 20.8, 17.5, 19.2);
