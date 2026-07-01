package com.smartfund.tracker.model;

import java.util.List;

public class FraudRiskAnalysis {
    private int analysisId;
    private int fundId;
    private String fundName;
    private String company;
    private String category;
    private double nav;
    private double returns1y;
    private double returns3y;
    private double returns5y;

    private int riskScore;
    private String riskLevel;
    private int fraudProbability;
    private String detectionStatus;
    private List<String> reasons;
    private String aiExplanation;

    // 10 Quantitative Risk Factors
    private double navVolatility;
    private double expenseRatio;
    private double returnConsistency;
    private int fundAgeYears;
    private double aumGrowth;
    private double portfolioConcentration;
    private double sectorExposure;
    private double drawdown;
    private double stdDev;
    private double sharpeRatio;

    public FraudRiskAnalysis() {}

    // Getters and Setters
    public int getAnalysisId() { return analysisId; }
    public void setAnalysisId(int analysisId) { this.analysisId = analysisId; }

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

    public double getReturns1y() { return returns1y; }
    public void setReturns1y(double returns1y) { this.returns1y = returns1y; }

    public double getReturns3y() { return returns3y; }
    public void setReturns3y(double returns3y) { this.returns3y = returns3y; }

    public double getReturns5y() { return returns5y; }
    public void setReturns5y(double returns5y) { this.returns5y = returns5y; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public int getFraudProbability() { return fraudProbability; }
    public void setFraudProbability(int fraudProbability) { this.fraudProbability = fraudProbability; }

    public String getDetectionStatus() { return detectionStatus; }
    public void setDetectionStatus(String detectionStatus) { this.detectionStatus = detectionStatus; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }

    public double getNavVolatility() { return navVolatility; }
    public void setNavVolatility(double navVolatility) { this.navVolatility = navVolatility; }

    public double getExpenseRatio() { return expenseRatio; }
    public void setExpenseRatio(double expenseRatio) { this.expenseRatio = expenseRatio; }

    public double getReturnConsistency() { return returnConsistency; }
    public void setReturnConsistency(double returnConsistency) { this.returnConsistency = returnConsistency; }

    public int getFundAgeYears() { return fundAgeYears; }
    public void setFundAgeYears(int fundAgeYears) { this.fundAgeYears = fundAgeYears; }

    public double getAumGrowth() { return aumGrowth; }
    public void setAumGrowth(double aumGrowth) { this.aumGrowth = aumGrowth; }

    public double getPortfolioConcentration() { return portfolioConcentration; }
    public void setPortfolioConcentration(double portfolioConcentration) { this.portfolioConcentration = portfolioConcentration; }

    public double getSectorExposure() { return sectorExposure; }
    public void setSectorExposure(double sectorExposure) { this.sectorExposure = sectorExposure; }

    public double getDrawdown() { return drawdown; }
    public void setDrawdown(double drawdown) { this.drawdown = drawdown; }

    public double getStdDev() { return stdDev; }
    public void setStdDev(double stdDev) { this.stdDev = stdDev; }

    public double getSharpeRatio() { return sharpeRatio; }
    public void setSharpeRatio(double sharpeRatio) { this.sharpeRatio = sharpeRatio; }
}
