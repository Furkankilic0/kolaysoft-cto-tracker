package com.kolaysoft.ctotracker.entity;

import com.kolaysoft.ctotracker.entity.enums.ReportStatus;
import com.kolaysoft.ctotracker.entity.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "weekly_reports",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_report_project_week",
                columnNames = {"project_id", "report_year", "week_number"}
        )
)
public class WeeklyReport extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    @Column(name = "report_year", nullable = false)
    private Integer year;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    private LocalDate weekStartDate;

    private LocalDate weekEndDate;

    @Column(columnDefinition = "TEXT")
    private String completedWork;

    @Column(columnDefinition = "TEXT")
    private String plannedWork;

    @Column(columnDefinition = "TEXT")
    private String blockers;

    @Column(nullable = false)
    private Integer progressPercentage = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RiskLevel riskLevel = RiskLevel.LOW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReportStatus status = ReportStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String ctoComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    private LocalDateTime reviewedAt;
}