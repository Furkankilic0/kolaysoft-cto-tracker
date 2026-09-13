package com.kolaysoft.ctotracker.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class DashboardResponse {

    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long delayedProjects;
    private long atRiskProjects;

    private long highRiskReports;
    private long pendingReviewReports;
    private long projectsWithoutReport;

    private double averageActualProgress;
    private double averageProgressGap;

    private List<ProjectSummaryResponse> projects = new ArrayList<>();
}