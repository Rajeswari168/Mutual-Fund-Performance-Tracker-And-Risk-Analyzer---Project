package com.smartfund.tracker.controller;

import com.smartfund.tracker.dao.InvestmentDAO;
import com.smartfund.tracker.model.Investment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    @Autowired
    private InvestmentDAO investmentDAO;

    @PostMapping
    public Map<String, String> addInvestment(@RequestBody Investment investment) {
        if (investment.getInvestmentDate() == null) {
            investment.setInvestmentDate(new Date(System.currentTimeMillis()));
        }
        investmentDAO.addInvestment(investment);
        return Map.of("message", "Investment added successfully");
    }

    @GetMapping("/user/{userId}")
    public List<Investment> getInvestments(@PathVariable int userId) {
        return investmentDAO.getInvestmentsByUserId(userId);
    }
    
    @PostMapping("/risk-analyze")
    public Map<String, String> analyzeRisk(@RequestBody Map<String, Object> params) {
        double amount = Double.parseDouble(params.get("amount").toString());
        int duration = Integer.parseInt(params.get("duration").toString());
        
        String riskLevel;
        if (amount < 50000 && duration >= 5) {
            riskLevel = "Low Risk";
        } else if (amount < 200000) {
            riskLevel = "Medium Risk";
        } else {
            riskLevel = "High Risk";
        }
        
        return Map.of("riskLevel", riskLevel);
    }
}
