package com.kolaysoft.ctotracker.mapper;

import com.kolaysoft.ctotracker.dto.request.WeeklyReportRequest;
import com.kolaysoft.ctotracker.dto.response.WeeklyReportResponse;
import com.kolaysoft.ctotracker.entity.WeeklyReport;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WeeklyReportMapper {

    public WeeklyReport toEntity(WeeklyReportRequest request) {
        WeeklyReport report = new WeeklyReport();
        report.setYear(request.getYear());
        report.setWeekNumber(request.getWeekNumber());
        report.setCompletedWork(request.getCompletedWork());
        report.setPlannedWork(request.getPlannedWork());
        report.setBlockers(request.getBlockers());
        report.setGeneralNote(request.getGeneralNote());
        report.setTargetProgress(request.getTargetProgress());
        report.setActualProgress(request.getActualProgress());
        report.setActiveTaskCount(request.getActiveTaskCount());
        report.setScheduleStatus(request.getScheduleStatus());
        report.setRiskLevel(request.getRiskLevel());
        return report;
    }

    public WeeklyReportResponse toResponse(WeeklyReport report) {
        WeeklyReportResponse response = new WeeklyReportResponse();
        response.setId(report.getId());

        if (report.getProject() != null) {
            response.setProjectId(report.getProject().getId());
            response.setProjectName(report.getProject().getName());
            response.setProjectCustomer(report.getProject().getCustomer());
        }

        if (report.getReportedBy() != null) {
            response.setReportedById(report.getReportedBy().getId());
            response.setReportedByFullName(report.getReportedBy().getFullName());
        }

        response.setYear(report.getYear());
        response.setWeekNumber(report.getWeekNumber());
        response.setWeekStartDate(report.getWeekStartDate());
        response.setWeekEndDate(report.getWeekEndDate());

        response.setCompletedWork(report.getCompletedWork());
        response.setPlannedWork(report.getPlannedWork());
        response.setBlockers(report.getBlockers());
        response.setGeneralNote(report.getGeneralNote());

        response.setTargetProgress(report.getTargetProgress());
        response.setActualProgress(report.getActualProgress());
        response.setActiveTaskCount(report.getActiveTaskCount());

        if (report.getTargetProgress() != null && report.getActualProgress() != null) {
            response.setProgressGap(report.getActualProgress() - report.getTargetProgress());
        }

        response.setScheduleStatus(report.getScheduleStatus());
        response.setRiskLevel(report.getRiskLevel());
        response.setStatus(report.getStatus());

        response.setCtoComment(report.getCtoComment());

        if (report.getReviewedBy() != null) {
            response.setReviewedById(report.getReviewedBy().getId());
            response.setReviewedByFullName(report.getReviewedBy().getFullName());
        }

        response.setReviewedAt(report.getReviewedAt());
        response.setCreatedAt(report.getCreatedAt());

        return response;
    }

    public List<WeeklyReportResponse> toResponseList(List<WeeklyReport> reports) {
        return reports.stream()
                .map(this::toResponse)
                .toList();
    }
}