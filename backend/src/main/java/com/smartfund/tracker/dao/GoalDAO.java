package com.smartfund.tracker.dao;

import com.smartfund.tracker.model.Goal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class GoalDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int addGoal(Goal goal) {
        String sql = "INSERT INTO goals (user_id, goal_type, target_amount, duration_years, monthly_investment) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, goal.getUserId(), goal.getGoalType(), goal.getTargetAmount(), goal.getDurationYears(), goal.getMonthlyInvestment());
    }

    public List<Goal> getGoalsByUserId(int userId) {
        String sql = "SELECT * FROM goals WHERE user_id = ?";
        return jdbcTemplate.query(sql, new GoalRowMapper(), userId);
    }

    public int deleteGoal(int goalId) {
        String sql = "DELETE FROM goals WHERE goal_id = ?";
        return jdbcTemplate.update(sql, goalId);
    }

    private static class GoalRowMapper implements RowMapper<Goal> {
        @Override
        public Goal mapRow(ResultSet rs, int rowNum) throws SQLException {
            Goal goal = new Goal();
            goal.setGoalId(rs.getInt("goal_id"));
            goal.setUserId(rs.getInt("user_id"));
            goal.setGoalType(rs.getString("goal_type"));
            goal.setTargetAmount(rs.getDouble("target_amount"));
            goal.setDurationYears(rs.getInt("duration_years"));
            goal.setMonthlyInvestment(rs.getDouble("monthly_investment"));
            return goal;
        }
    }
}
