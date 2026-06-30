package com.smartfund.tracker.model;

public class Fund {
    private int fundId;
    private String fundName;
    private String company;
    private String category;
    private double nav;
    private String riskLevel;
    private double returns1y;
    private double returns3y;
    private double returns5y;

    // Getters and Setters
    public int getFundId() { return fundId; }
    public void setFundId(int fundId) { this.fundId = fundId; }
    public String getFundName() { return fundName; }
    public void setFundName(String fundName) { this.fundName = fundName; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getNav() { return nav; }
    public void setNav(double nav) { this.nav = nav; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public double getReturns1y() { return returns1y; }
    public void setReturns1y(double returns1y) { this.returns1y = returns1y; }
    public double getReturns3y() { return returns3y; }
    public void setReturns3y(double returns3y) { this.returns3y = returns3y; }
    public double getReturns5y() { return returns5y; }
    public void setReturns5y(double returns5y) { this.returns5y = returns5y; }
}
