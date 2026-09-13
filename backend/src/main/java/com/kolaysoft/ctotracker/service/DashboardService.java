package com.kolaysoft.ctotracker.service;

import com.kolaysoft.ctotracker.dto.response.DashboardResponse;
import com.kolaysoft.ctotracker.dto.response.ProjectSummaryResponse;
import com.kolaysoft.ctotracker.entity.Project;
import com.kolaysoft.ctotracker.entity.WeeklyReport;
import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import com.kolaysoft.ctotracker.entity.enums.ReportStatus;
import com.kolaysoft.ctotracker.entity.enums.RiskLevel;
import com.kolaysoft.ctotracker.repository.ProjectRepository;
import com.kolaysoft.ctotracker.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final WeeklyReportRepository reportRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(ProjectStatus statusFilter,
                                          RiskLevel riskFilter,
                                          Long managerFilter,
                                          Integer year,
                                          Integer weekNumber) {

        List<Project> projects = projectRepository.findAll();

        if (statusFilter != null) {
            projects = projects.stream()
                    .filter(p -> p.getStatus() == statusFilter)
                    .toList();
        }

        if (managerFilter != null) {
            projects = projects.stream()
                    .filter(p -> p.getManager() != null
                            && p.getManager().getId().equals(managerFilter))
                    .toList();
        }

        List<ProjectSummaryResponse> summaries = projects.stream()
                .map(project -> buildSummary(project, year, weekNumber))
                .filter(summary -> riskFilter == null || summary.getRiskLevel() == riskFilter)
                .toList();

        return buildDashboard(summaries);
    }

    private ProjectSummaryResponse buildSummary(Project project, Integer year, Integer weekNumber) {
        ProjectSummaryResponse summary = new ProjectSummaryResponse();

        summary.setProjectId(project.getId());
        summary.setProjectName(project.getName());
        summary.setProjectCode(project.getCode());
        summary.setCustomer(project.getCustomer());
        summary.setProjectStatus(project.getStatus());
        summary.setTargetEndDate(project.getTargetEndDate());

        if (project.getManager() != null) {
            summary.setManagerFullName(project.getManager().getFullName());
        }

        Optional<WeeklyReport> reportOpt = findRelevantReport(project.getId(), year, weekNumber);

        if (reportOpt.isEmpty()) {
            summary.setHasReport(false);
            return summary;
        }

        WeeklyReport report = reportOpt.get();

        summary.setHasReport(true);
        summary.setLastReportId(report.getId());
        summary.setLastReportYear(report.getYear());
        summary.setLastReportWeek(report.getWeekNumber());
        summary.setTargetProgress(report.getTargetProgress());
        summary.setActualProgress(report.getActualProgress());
        summary.setActiveTaskCount(report.getActiveTaskCount());
        summary.setScheduleStatus(report.getScheduleStatus());
        summary.setRiskLevel(report.getRiskLevel());
        summary.setReportStatus(report.getStatus());
        summary.setBlockers(report.getBlockers());

        if (report.getTargetProgress() != null && report.getActualProgress() != null) {
            summary.setProgressGap(report.getActualProgress() - report.getTargetProgress());
        }

        return summary;
    }

    private Optional<WeeklyReport> findRelevantReport(Long projectId, Integer year, Integer weekNumber) {
        if (year != null && weekNumber != null) {
            return reportRepository.findByProjectIdAndYearAndWeekNumber(projectId, year, weekNumber);
        }

        return reportRepository.findByProjectId(projectId).stream()
                .max(Comparator
                        .comparing(WeeklyReport::getYear)
                        .thenComparing(WeeklyReport::getWeekNumber));
    }

    private DashboardResponse buildDashboard(List<ProjectSummaryResponse> summaries) {
        DashboardResponse dashboard = new DashboardResponse();
        dashboard.setProjects(summaries);

        dashboard.setTotalProjects(summaries.size());

        dashboard.setActiveProjects(summaries.stream()
                .filter(s -> s.getProjectStatus() == ProjectStatus.IN_PROGRESS
                        || s.getProjectStatus() == ProjectStatus.IN_TESTING)
                .count());

        dashboard.setCompletedProjects(summaries.stream()
                .filter(s -> s.getProjectStatus() == ProjectStatus.COMPLETED)
                .count());

        dashboard.setDelayedProjects(summaries.stream()
                .filter(s -> s.getProjectStatus() == ProjectStatus.DELAYED)
                .count());

        dashboard.setAtRiskProjects(summaries.stream()
                .filter(s -> s.getProjectStatus() == ProjectStatus.AT_RISK
                        || s.getProjectStatus() == ProjectStatus.BLOCKED)
                .count());

        dashboard.setHighRiskReports(summaries.stream()
                .filter(s -> s.getRiskLevel() == RiskLevel.HIGH
                        || s.getRiskLevel() == RiskLevel.CRITICAL)
                .count());

        dashboard.setPendingReviewReports(summaries.stream()
                .filter(s -> s.getReportStatus() == ReportStatus.SUBMITTED)
                .count());

        dashboard.setProjectsWithoutReport(summaries.stream()
                .filter(s -> !s.isHasReport())
                .count());

        dashboard.setAverageActualProgress(summaries.stream()
                .filter(s -> s.getActualProgress() != null)
                .mapToInt(ProjectSummaryResponse::getActualProgress)
                .average()
                .orElse(0.0));

        dashboard.setAverageProgressGap(summaries.stream()
                .filter(s -> s.getProgressGap() != null)
                .mapToInt(ProjectSummaryResponse::getProgressGap)
                .average()
                .orElse(0.0));

        return dashboard;
    }
}