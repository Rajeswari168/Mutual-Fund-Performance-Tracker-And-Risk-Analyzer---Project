package com.smartfund.tracker.controller;

import com.smartfund.tracker.dao.GoalDAO;
import com.smartfund.tracker.model.Goal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalDAO goalDAO;

    @PostMapping
    public Map<String, String> addGoal(@RequestBody Goal goal) {
        goalDAO.addGoal(goal);
        return Map.of("message", "Goal added successfully");
    }

    @GetMapping("/user/{userId}")
    public List<Goal> getGoals(@PathVariable int userId) {
        return goalDAO.getGoalsByUserId(userId);
    }

    @DeleteMapping("/{goalId}")
    public Map<String, String> deleteGoal(@PathVariable int goalId) {
        goalDAO.deleteGoal(goalId);
        return Map.of("message", "Goal deleted successfully");
    }

    @PostMapping("/calculate")
    public Map<String, Object> calculateGoal(@RequestBody Map<String, Object> params) {
        double targetAmount = Double.parseDouble(params.get("targetAmount").toString());
        int durationYears = Integer.parseInt(params.get("durationYears").toString());
        double annualReturnRate = 0.12; // 12% expected annual return
        
        double monthlyRate = annualReturnRate / 12;
        int totalMonths = durationYears * 12;
        
        // SIP Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
        // We need to find P: P = FV / [((1 + r)^n - 1) / r * (1 + r)]
        
        double denominator = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate * (1 + monthlyRate);
        double requiredSIP = targetAmount / denominator;
        
        return Map.of(
            "requiredSIP", Math.round(requiredSIP * 100.0) / 100.0,
            "futureValue", targetAmount,
            "durationYears", durationYears
        );
    }
}
