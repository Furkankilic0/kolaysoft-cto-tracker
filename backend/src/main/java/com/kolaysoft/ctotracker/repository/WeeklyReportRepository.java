package com.kolaysoft.ctotracker.repository;

import com.kolaysoft.ctotracker.entity.WeeklyReport;
import com.kolaysoft.ctotracker.entity.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeeklyReportRepository extends JpaRepository<WeeklyReport, Long> {

    List<WeeklyReport> findByProjectId(Long projectId);

    Optional<WeeklyReport> findByProjectIdAndYearAndWeekNumber(Long projectId, Integer year, Integer weekNumber);

    List<WeeklyReport> findByStatus(ReportStatus status);

    List<WeeklyReport> findByReportedById(Long userId);

    List<WeeklyReport> findByYearAndWeekNumberOrderByProjectIdAsc(Integer year, Integer weekNumber);
}