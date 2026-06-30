package com.smartfund.tracker.model;

import java.sql.Date;

public class Investment {
    private int investmentId;
    private int userId;
    private int fundId;
    private double amount;
    private Date investmentDate;

    // Getters and Setters
    public int getInvestmentId() { return investmentId; }
    public void setInvestmentId(int investmentId) { this.investmentId = investmentId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getFundId() { return fundId; }
    public void setFundId(int fundId) { this.fundId = fundId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public Date getInvestmentDate() { return investmentDate; }
    public void setInvestmentDate(Date investmentDate) { this.investmentDate = investmentDate; }
}
