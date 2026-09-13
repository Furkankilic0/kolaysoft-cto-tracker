package com.kolaysoft.ctotracker.controller;

import com.kolaysoft.ctotracker.dto.response.DashboardResponse;
import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import com.kolaysoft.ctotracker.entity.enums.RiskLevel;
import com.kolaysoft.ctotracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) RiskLevel risk,
            @RequestParam(required = false) Long managerId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer weekNumber) {

        DashboardResponse dashboard = dashboardService.getDashboard(status, risk, managerId, year, weekNumber);
        return ResponseEntity.ok(dashboard);
    }
}