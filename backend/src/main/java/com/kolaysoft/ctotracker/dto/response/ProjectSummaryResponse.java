package com.kolaysoft.ctotracker.dto.response;

import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import com.kolaysoft.ctotracker.entity.enums.ReportStatus;
import com.kolaysoft.ctotracker.entity.enums.RiskLevel;
import com.kolaysoft.ctotracker.entity.enums.ScheduleStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ProjectSummaryResponse {

    private Long projectId;
    private String projectName;
    private String projectCode;
    private String customer;
    private ProjectStatus projectStatus;
    private String managerFullName;
    private LocalDate targetEndDate;

    // Son haftalik rapordan gelenler
    private Long lastReportId;
    private Integer lastReportYear;
    private Integer lastReportWeek;
    private Integer targetProgress;
    private Integer actualProgress;
    private Integer progressGap;
    private Integer activeTaskCount;
    private ScheduleStatus scheduleStatus;
    private RiskLevel riskLevel;
    private ReportStatus reportStatus;
    private String blockers;
    private boolean hasReport;
}