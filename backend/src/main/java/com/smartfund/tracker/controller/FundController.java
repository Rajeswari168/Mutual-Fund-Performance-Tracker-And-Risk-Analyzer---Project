package com.smartfund.tracker.controller;

import com.smartfund.tracker.dao.FundDAO;
import com.smartfund.tracker.model.Fund;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funds")
public class FundController {

    @Autowired
    private FundDAO fundDAO;

    @GetMapping
    public List<Fund> getFunds() {
        return fundDAO.getAllFunds();
    }

    @GetMapping("/{id}")
    public Fund getFund(@PathVariable int id) {
        return fundDAO.getFundById(id);
    }
}
