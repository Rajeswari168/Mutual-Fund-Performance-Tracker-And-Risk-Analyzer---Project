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

-- Insert some dummy mutual funds to play with
INSERT IGNORE INTO mutual_funds (fund_name, company, category, nav, risk_level, returns_1y, returns_3y, returns_5y) VALUES
('SBI Bluechip Fund', 'SBI Mutual Fund', 'Equity', 75.40, 'High Risk', 15.5, 12.2, 14.8),
('HDFC Small Cap Fund', 'HDFC Mutual Fund', 'Equity', 45.20, 'High Risk', 22.1, 18.5, 20.1),
('ICICI Prudential Liquid Fund', 'ICICI Mutual Fund', 'Debt', 120.50, 'Low Risk', 6.5, 6.2, 6.8),
('Axis Midcap Fund', 'Axis Mutual Fund', 'Equity', 65.30, 'High Risk', 18.4, 15.1, 17.5),
('Kotak Standard Multicap Fund', 'Kotak Mutual Fund', 'Equity', 55.10, 'Medium Risk', 12.3, 11.5, 13.2);
