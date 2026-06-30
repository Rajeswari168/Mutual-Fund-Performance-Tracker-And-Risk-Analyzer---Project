package com.smartfund.tracker.dao;

import com.smartfund.tracker.model.Fund;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class FundDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Fund> getAllFunds() {
        String sql = "SELECT * FROM mutual_funds";
        return jdbcTemplate.query(sql, new FundRowMapper());
    }

    public Fund getFundById(int id) {
        String sql = "SELECT * FROM mutual_funds WHERE fund_id = ?";
        List<Fund> funds = jdbcTemplate.query(sql, new FundRowMapper(), id);
        return funds.isEmpty() ? null : funds.get(0);
    }

    private static class FundRowMapper implements RowMapper<Fund> {
        @Override
        public Fund mapRow(ResultSet rs, int rowNum) throws SQLException {
            Fund fund = new Fund();
            fund.setFundId(rs.getInt("fund_id"));
            fund.setFundName(rs.getString("fund_name"));
            fund.setCompany(rs.getString("company"));
            fund.setCategory(rs.getString("category"));
            fund.setNav(rs.getDouble("nav"));
            fund.setRiskLevel(rs.getString("risk_level"));
            fund.setReturns1y(rs.getDouble("returns_1y"));
            fund.setReturns3y(rs.getDouble("returns_3y"));
            fund.setReturns5y(rs.getDouble("returns_5y"));
            return fund;
        }
    }
}
