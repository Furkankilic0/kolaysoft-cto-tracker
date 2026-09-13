package com.kolaysoft.ctotracker.controller;

import com.kolaysoft.ctotracker.dto.request.ReviewRequest;
import com.kolaysoft.ctotracker.dto.request.WeeklyReportRequest;
import com.kolaysoft.ctotracker.dto.response.WeeklyReportResponse;
import com.kolaysoft.ctotracker.entity.WeeklyReport;
import com.kolaysoft.ctotracker.entity.enums.ReportStatus;
import com.kolaysoft.ctotracker.mapper.WeeklyReportMapper;
import com.kolaysoft.ctotracker.service.WeeklyReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class WeeklyReportController {

    private final WeeklyReportService reportService;
    private final WeeklyReportMapper reportMapper;

    @GetMapping
    public ResponseEntity<List<WeeklyReportResponse>> getAllReports() {
        List<WeeklyReport> reports = reportService.getAllReports();
        return ResponseEntity.ok(reportMapper.toResponseList(reports));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeeklyReportResponse> getReportById(@PathVariable Long id) {
        WeeklyReport report = reportService.getReportById(id);
        return ResponseEntity.ok(reportMapper.toResponse(report));
    }

    @GetMapping("/by-project/{projectId}")
    public ResponseEntity<List<WeeklyReportResponse>> getReportsByProject(@PathVariable Long projectId) {
        List<WeeklyReport> reports = reportService.getReportsByProject(projectId);
        return ResponseEntity.ok(reportMapper.toResponseList(reports));
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<WeeklyReportResponse>> getReportsByStatus(@RequestParam ReportStatus status) {
        List<WeeklyReport> reports = reportService.getReportsByStatus(status);
        return ResponseEntity.ok(reportMapper.toResponseList(reports));
    }

    @GetMapping("/by-week")
    public ResponseEntity<List<WeeklyReportResponse>> getReportsByWeek(@RequestParam Integer year,
                                                                       @RequestParam Integer weekNumber) {
        List<WeeklyReport> reports = reportService.getReportsByWeek(year, weekNumber);
        return ResponseEntity.ok(reportMapper.toResponseList(reports));
    }

    @PostMapping
    public ResponseEntity<WeeklyReportResponse> createReport(@Valid @RequestBody WeeklyReportRequest request) {
        WeeklyReport report = reportMapper.toEntity(request);
        WeeklyReport saved = reportService.createReport(report, request.getProjectId(), request.getReportedById());
        return ResponseEntity.status(HttpStatus.CREATED).body(reportMapper.toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeeklyReportResponse> updateReport(@PathVariable Long id,
                                                             @Valid @RequestBody WeeklyReportRequest request) {
        WeeklyReport updatedData = reportMapper.toEntity(request);
        WeeklyReport updated = reportService.updateReport(id, updatedData);
        return ResponseEntity.ok(reportMapper.toResponse(updated));
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<WeeklyReportResponse> submitReport(@PathVariable Long id) {
        WeeklyReport submitted = reportService.submitReport(id);
        return ResponseEntity.ok(reportMapper.toResponse(submitted));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<WeeklyReportResponse> reviewReport(@PathVariable Long id,
                                                             @Valid @RequestBody ReviewRequest request) {
        WeeklyReport reviewed = reportService.reviewReport(id, request.getCtoId(), request.getComment());
        return ResponseEntity.ok(reportMapper.toResponse(reviewed));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}