package com.smartfund.tracker.controller;

import com.smartfund.tracker.dao.FraudRiskDAO;
import com.smartfund.tracker.model.FraudRiskAnalysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fraud-risk")
public class FraudRiskController {

    @Autowired
    private FraudRiskDAO fraudRiskDAO;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardSummary() {
        return fraudRiskDAO.getDashboardSummary();
    }

    @GetMapping("/analyses")
    public List<FraudRiskAnalysis> getAllAnalyses() {
        return fraudRiskDAO.getAllAnalyses();
    }

    @GetMapping("/fund/{id}")
    public FraudRiskAnalysis getAnalysisByFundId(@PathVariable int id) {
        return fraudRiskDAO.getAnalysisByFundId(id);
    }
}
