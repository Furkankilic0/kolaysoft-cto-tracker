package com.kolaysoft.ctotracker.dto.response;

import com.kolaysoft.ctotracker.entity.enums.ReportStatus;
import com.kolaysoft.ctotracker.entity.enums.RiskLevel;
import com.kolaysoft.ctotracker.entity.enums.ScheduleStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReportResponse {

    private Long id;

    private Long projectId;
    private String projectName;
    private String projectCustomer;

    private Long reportedById;
    private String reportedByFullName;

    private Integer year;
    private Integer weekNumber;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;

    private String completedWork;
    private String plannedWork;
    private String blockers;
    private String generalNote;

    private Integer targetProgress;
    private Integer actualProgress;
    private Integer progressGap;
    private Integer activeTaskCount;

    private ScheduleStatus scheduleStatus;
    private RiskLevel riskLevel;
    private ReportStatus status;

    private String ctoComment;
    private Long reviewedById;
    private String reviewedByFullName;
    private LocalDateTime reviewedAt;

    private LocalDateTime createdAt;
}