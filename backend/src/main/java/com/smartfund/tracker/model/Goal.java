package com.smartfund.tracker.model;

public class Goal {
    private int goalId;
    private int userId;
    private String goalType;
    private double targetAmount;
    private int durationYears;
    private double monthlyInvestment;

    // Getters and Setters
    public int getGoalId() { return goalId; }
    public void setGoalId(int goalId) { this.goalId = goalId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getGoalType() { return goalType; }
    public void setGoalType(String goalType) { this.goalType = goalType; }
    public double getTargetAmount() { return targetAmount; }
    public void setTargetAmount(double targetAmount) { this.targetAmount = targetAmount; }
    public int getDurationYears() { return durationYears; }
    public void setDurationYears(int durationYears) { this.durationYears = durationYears; }
    public double getMonthlyInvestment() { return monthlyInvestment; }
    public void setMonthlyInvestment(double monthlyInvestment) { this.monthlyInvestment = monthlyInvestment; }
}
