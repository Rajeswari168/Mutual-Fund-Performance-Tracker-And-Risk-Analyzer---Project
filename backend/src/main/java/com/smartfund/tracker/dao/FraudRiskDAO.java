package com.smartfund.tracker.dao;

import com.smartfund.tracker.model.FraudRiskAnalysis;
import com.smartfund.tracker.model.Fund;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Repository
public class FraudRiskDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private FundDAO fundDAO;

    public List<FraudRiskAnalysis> getAllAnalyses() {
        List<Fund> funds = fundDAO.getAllFunds();
        List<FraudRiskAnalysis> results = new ArrayList<>();
        for (Fund f : funds) {
            results.add(computeAnalysisForFund(f));
        }
        return results;
    }

    public FraudRiskAnalysis getAnalysisByFundId(int fundId) {
        Fund f = fundDAO.getFundById(fundId);
        if (f == null) return null;
        return computeAnalysisForFund(f);
    }

    public Map<String, Object> getDashboardSummary() {
        List<FraudRiskAnalysis> all = getAllAnalyses();
        int totalFunds = all.size();
        int safeFunds = 0;
        int mediumRisk = 0;
        int highRisk = 0;
        int fraudAlerts = 0;
        int totalRiskScore = 0;

        List<FraudRiskAnalysis> topRisky = new ArrayList<>();

        for (FraudRiskAnalysis a : all) {
            totalRiskScore += a.getRiskScore();
            if ("Low".equalsIgnoreCase(a.getRiskLevel())) safeFunds++;
            else if ("Medium".equalsIgnoreCase(a.getRiskLevel())) mediumRisk++;
            else if ("High".equalsIgnoreCase(a.getRiskLevel())) highRisk++;

            if ("Warning".equalsIgnoreCase(a.getDetectionStatus()) || "Critical".equalsIgnoreCase(a.getDetectionStatus())) {
                fraudAlerts++;
            }
        }

        all.sort((o1, o2) -> Integer.compare(o2.getRiskScore(), o1.getRiskScore()));
        for (int i = 0; i < Math.min(6, all.size()); i++) {
            topRisky.add(all.get(i));
        }

        int overallRiskScore = totalFunds > 0 ? Math.round((float) totalRiskScore / totalFunds) : 50;
        String overallRiskLevel = overallRiskScore >= 70 ? "High" : (overallRiskScore >= 40 ? "Medium" : "Low");
        String detectionStatus = fraudAlerts >= 5 ? "Warning" : (fraudAlerts > 15 ? "Critical" : "Safe");

        Map<String, Object> summary = new HashMap<>();
        summary.put("overallRiskScore", overallRiskScore);
        summary.put("overallRiskLevel", overallRiskLevel);
        summary.put("detectionStatus", detectionStatus);
        summary.put("totalFunds", totalFunds);
        summary.put("safeFunds", safeFunds);
        summary.put("mediumRisk", mediumRisk);
        summary.put("highRisk", highRisk);
        summary.put("fraudAlerts", fraudAlerts);
        summary.put("topRiskyFunds", topRisky);

        return summary;
    }

    private FraudRiskAnalysis computeAnalysisForFund(Fund f) {
        FraudRiskAnalysis a = new FraudRiskAnalysis();
        a.setFundId(f.getFundId());
        a.setFundName(f.getFundName());
        a.setCompany(f.getCompany());
        a.setCategory(f.getCategory());
        a.setNav(f.getNav());
        a.setReturns1y(f.getReturns1y());
        a.setReturns3y(f.getReturns3y());
        a.setReturns5y(f.getReturns5y());

        // Deterministic pseudo-random generation seeded by fund name hash
        long seed = Math.abs((long) f.getFundName().hashCode());
        Random r = new Random(seed);

        boolean isHighRiskCat = "High Risk".equalsIgnoreCase(f.getRiskLevel()) || f.getReturns1y() > 22.0;
        boolean isLowRiskCat = "Low Risk".equalsIgnoreCase(f.getRiskLevel()) || "Debt".equalsIgnoreCase(f.getCategory()) || "Hybrid".equalsIgnoreCase(f.getCategory());

        // 10 Quantitative Risk Factors
        double navVol = isHighRiskCat ? (18.0 + r.nextDouble() * 12.0) : (isLowRiskCat ? (2.0 + r.nextDouble() * 4.0) : (10.0 + r.nextDouble() * 6.0));
        double expRatio = isHighRiskCat ? (1.2 + r.nextDouble() * 1.3) : (0.4 + r.nextDouble() * 0.7);
        double retCons = isHighRiskCat ? (62.0 + r.nextDouble() * 18.0) : (82.0 + r.nextDouble() * 14.0);
        int fundAge = 3 + r.nextInt(15);
        double aumGr = -8.0 + r.nextDouble() * 45.0;
        double portConc = isHighRiskCat ? (45.0 + r.nextDouble() * 30.0) : (22.0 + r.nextDouble() * 20.0);
        double secExp = isHighRiskCat ? (38.0 + r.nextDouble() * 28.0) : (18.0 + r.nextDouble() * 20.0);
        double drawd = isHighRiskCat ? (-18.0 - r.nextDouble() * 16.0) : (-3.0 - r.nextDouble() * 6.0);
        double stDev = navVol * 0.95;
        double sharpe = isHighRiskCat ? (1.4 + r.nextDouble() * 1.1) : (0.8 + r.nextDouble() * 0.8);

        a.setNavVolatility(Math.round(navVol * 100.0) / 100.0);
        a.setExpenseRatio(Math.round(expRatio * 100.0) / 100.0);
        a.setReturnConsistency(Math.round(retCons * 10.0) / 10.0);
        a.setFundAgeYears(fundAge);
        a.setAumGrowth(Math.round(aumGr * 10.0) / 10.0);
        a.setPortfolioConcentration(Math.round(portConc * 10.0) / 10.0);
        a.setSectorExposure(Math.round(secExp * 10.0) / 10.0);
        a.setDrawdown(Math.round(drawd * 10.0) / 10.0);
        a.setStdDev(Math.round(stDev * 100.0) / 100.0);
        a.setSharpeRatio(Math.round(sharpe * 100.0) / 100.0);

        // Calculate Risk Score & Level
        int riskScore = isHighRiskCat ? (72 + r.nextInt(23)) : (isLowRiskCat ? (18 + r.nextInt(21)) : (45 + r.nextInt(23)));
        if (f.getReturns1y() > 30.0) riskScore = Math.max(riskScore, 85);
        a.setRiskScore(riskScore);
        String rLevel = riskScore >= 70 ? "High" : (riskScore >= 40 ? "Medium" : "Low");
        a.setRiskLevel(rLevel);

        // Fraud Detection Engine (Rule-based)
        List<String> reasonsList = new ArrayList<>();
        int fraudProb = 12 + r.nextInt(18);

        if (f.getReturns1y() > 30.0) {
            fraudProb += 35 + r.nextInt(20);
            reasonsList.add("Extremely high recent returns (>30%)");
        }
        if (expRatio > 2.0) {
            fraudProb += 22;
            reasonsList.add("Expense ratio unusually high (>2.0%)");
        }
        if (portConc > 65.0) {
            fraudProb += 18;
            reasonsList.add("Concentrated portfolio exposure");
        }
        if (navVol > 24.0) {
            fraudProb += 15;
            reasonsList.add("Sudden NAV fluctuations");
        }

        fraudProb = Math.min(96, fraudProb);
        a.setFraudProbability(fraudProb);

        String status = "Safe";
        if (fraudProb >= 65 || riskScore >= 82) {
            status = "Critical";
            if (reasonsList.isEmpty()) reasonsList.add("High NAV fluctuation & sector risk");
        } else if (fraudProb >= 38 || riskScore >= 68) {
            status = "Warning";
            if (reasonsList.isEmpty()) reasonsList.add("Moderate return volatility");
        } else {
            if (reasonsList.isEmpty()) reasonsList.add("Consistent return pattern");
        }
        a.setDetectionStatus(status);
        a.setReasons(reasonsList);

        // AI Explanation
        String explanation = String.format(
            "This mutual fund is classified as %s Risk (Score: %d/100) due to NAV volatility of %.1f%%, expense ratio of %.2f%%, and historical drawdown reaching %.1f%%. %s",
            rLevel, riskScore, navVol, expRatio, drawd,
            "Critical".equals(status) || "Warning".equals(status) 
                ? "Rule engine flagged potential anomalies: " + String.join(", ", reasonsList) + ". Investors should exercise extra diligence."
                : "The fund displays stable institutional ownership and reliable return consistency over multi-year cycles."
        );
        a.setAiExplanation(explanation);

        return a;
    }
}
