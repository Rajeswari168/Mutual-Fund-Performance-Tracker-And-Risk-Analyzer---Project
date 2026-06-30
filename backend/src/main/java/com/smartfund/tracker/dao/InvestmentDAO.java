package com.smartfund.tracker.dao;

import com.smartfund.tracker.model.Investment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class InvestmentDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int addInvestment(Investment investment) {
        String sql = "INSERT INTO investments (user_id, fund_id, amount, investment_date) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, investment.getUserId(), investment.getFundId(), investment.getAmount(), investment.getInvestmentDate());
    }

    public List<Investment> getInvestmentsByUserId(int userId) {
        String sql = "SELECT * FROM investments WHERE user_id = ?";
        return jdbcTemplate.query(sql, new InvestmentRowMapper(), userId);
    }

    private static class InvestmentRowMapper implements RowMapper<Investment> {
        @Override
        public Investment mapRow(ResultSet rs, int rowNum) throws SQLException {
            Investment investment = new Investment();
            investment.setInvestmentId(rs.getInt("investment_id"));
            investment.setUserId(rs.getInt("user_id"));
            investment.setFundId(rs.getInt("fund_id"));
            investment.setAmount(rs.getDouble("amount"));
            investment.setInvestmentDate(rs.getDate("investment_date"));
            return investment;
        }
    }
}
