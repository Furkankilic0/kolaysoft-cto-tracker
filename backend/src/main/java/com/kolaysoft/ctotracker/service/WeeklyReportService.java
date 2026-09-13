package com.kolaysoft.ctotracker.service;

import com.kolaysoft.ctotracker.entity.Project;
import com.kolaysoft.ctotracker.entity.User;
import com.kolaysoft.ctotracker.entity.WeeklyReport;
import com.kolaysoft.ctotracker.entity.enums.ReportStatus;
import com.kolaysoft.ctotracker.entity.enums.Role;
import com.kolaysoft.ctotracker.exception.BusinessRuleException;
import com.kolaysoft.ctotracker.exception.ResourceNotFoundException;
import com.kolaysoft.ctotracker.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class WeeklyReportService {

    private final WeeklyReportRepository reportRepository;
    private final ProjectService projectService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<WeeklyReport> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional(readOnly = true)
    public WeeklyReport getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rapor bulunamadi. ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<WeeklyReport> getReportsByProject(Long projectId) {
        return reportRepository.findByProjectId(projectId);
    }

    @Transactional(readOnly = true)
    public List<WeeklyReport> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<WeeklyReport> getReportsByWeek(Integer year, Integer weekNumber) {
        return reportRepository.findByYearAndWeekNumberOrderByProjectIdAsc(year, weekNumber);
    }

    @Transactional
    public WeeklyReport createReport(WeeklyReport report, Long projectId, Long reporterId) {
        Project project = projectService.getProjectById(projectId);
        User reporter = userService.getUserById(reporterId);

        if (reporter.getRole() != Role.PROJECT_MANAGER) {
            throw new BusinessRuleException("Rapor sadece PROJECT_MANAGER rolundeki kullanici tarafindan olusturulabilir.");
        }

        if (!project.getManager().getId().equals(reporter.getId())) {
            throw new BusinessRuleException("Sadece projenin kendi yoneticisi rapor girebilir.");
        }

        if (report.getYear() == null || report.getWeekNumber() == null) {
            LocalDate today = LocalDate.now();
            report.setYear(today.getYear());
            report.setWeekNumber(today.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear()));
        }

        reportRepository
                .findByProjectIdAndYearAndWeekNumber(projectId, report.getYear(), report.getWeekNumber())
                .ifPresent(existing -> {
                    throw new BusinessRuleException(
                            "Bu proje icin " + report.getYear() + " yili " + report.getWeekNumber()
                                    + ". haftaya ait rapor zaten mevcut.");
                });

        validateProgress(report);
        fillWeekDates(report);

        report.setProject(project);
        report.setReportedBy(reporter);
        report.setStatus(ReportStatus.DRAFT);

        return reportRepository.save(report);
    }

    @Transactional
    public WeeklyReport updateReport(Long id, WeeklyReport updatedData) {
        WeeklyReport existing = getReportById(id);

        if (existing.getStatus() != ReportStatus.DRAFT) {
            throw new BusinessRuleException("Gonderilmis bir rapor duzenlenemez.");
        }

        validateProgress(updatedData);

        existing.setCompletedWork(updatedData.getCompletedWork());
        existing.setPlannedWork(updatedData.getPlannedWork());
        existing.setBlockers(updatedData.getBlockers());
        existing.setGeneralNote(updatedData.getGeneralNote());
        existing.setTargetProgress(updatedData.getTargetProgress());
        existing.setActualProgress(updatedData.getActualProgress());
        existing.setActiveTaskCount(updatedData.getActiveTaskCount());
        existing.setScheduleStatus(updatedData.getScheduleStatus());
        existing.setRiskLevel(updatedData.getRiskLevel());

        return reportRepository.save(existing);
    }

    @Transactional
    public WeeklyReport submitReport(Long id) {
        WeeklyReport report = getReportById(id);

        if (report.getStatus() != ReportStatus.DRAFT) {
            throw new BusinessRuleException("Bu rapor zaten gonderilmis.");
        }

        report.setStatus(ReportStatus.SUBMITTED);
        return reportRepository.save(report);
    }

    @Transactional
    public WeeklyReport reviewReport(Long id, Long ctoId, String comment) {
        WeeklyReport report = getReportById(id);
        User cto = userService.getUserById(ctoId);

        if (cto.getRole() != Role.CTO) {
            throw new BusinessRuleException("Raporu sadece CTO inceleyebilir.");
        }

        if (report.getStatus() == ReportStatus.DRAFT) {
            throw new BusinessRuleException("Henuz gonderilmemis bir rapor incelenemez.");
        }

        report.setCtoComment(comment);
        report.setReviewedBy(cto);
        report.setReviewedAt(LocalDateTime.now());
        report.setStatus(ReportStatus.REVIEWED);

        return reportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Long id) {
        WeeklyReport report = getReportById(id);

        if (report.getStatus() != ReportStatus.DRAFT) {
            throw new BusinessRuleException("Sadece taslak durumundaki raporlar silinebilir.");
        }

        reportRepository.delete(report);
    }

    private void validateProgress(WeeklyReport report) {
        if (report.getTargetProgress() == null
                || report.getTargetProgress() < 0
                || report.getTargetProgress() > 100) {
            throw new BusinessRuleException("Hedeflenen ilerleme 0-100 araliginda olmalidir.");
        }

        if (report.getActualProgress() == null
                || report.getActualProgress() < 0
                || report.getActualProgress() > 100) {
            throw new BusinessRuleException("Gerceklesen ilerleme 0-100 araliginda olmalidir.");
        }

        if (report.getActiveTaskCount() != null && report.getActiveTaskCount() < 0) {
            throw new BusinessRuleException("Canli task sayisi negatif olamaz.");
        }
    }

    private void fillWeekDates(WeeklyReport report) {
        if (report.getWeekStartDate() != null && report.getWeekEndDate() != null) {
            return;
        }

        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate monday = LocalDate.now()
                .withYear(report.getYear())
                .with(weekFields.weekOfWeekBasedYear(), report.getWeekNumber())
                .with(DayOfWeek.MONDAY);

        report.setWeekStartDate(monday);
        report.setWeekEndDate(monday.plusDays(6));
    }
}