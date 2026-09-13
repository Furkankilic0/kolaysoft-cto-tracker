package com.kolaysoft.ctotracker.dto.request;

import com.kolaysoft.ctotracker.entity.enums.RiskLevel;
import com.kolaysoft.ctotracker.entity.enums.ScheduleStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WeeklyReportRequest {

    @NotNull(message = "Proje secilmelidir")
    private Long projectId;

    @NotNull(message = "Raporu olusturan kullanici belirtilmelidir")
    private Long reportedById;

    private Integer year;

    @Min(value = 1, message = "Hafta numarasi en az 1 olmalidir")
    @Max(value = 53, message = "Hafta numarasi en fazla 53 olabilir")
    private Integer weekNumber;

    @NotBlank(message = "Bu hafta yapilan isler bos birakilamaz")
    private String completedWork;

    private String plannedWork;

    private String blockers;

    @NotNull(message = "Hedeflenen ilerleme belirtilmelidir")
    @Min(value = 0, message = "Hedeflenen ilerleme 0'dan kucuk olamaz")
    @Max(value = 100, message = "Hedeflenen ilerleme 100'den buyuk olamaz")
    private Integer targetProgress;

    @NotNull(message = "Gerceklesen ilerleme belirtilmelidir")
    @Min(value = 0, message = "Gerceklesen ilerleme 0'dan kucuk olamaz")
    @Max(value = 100, message = "Gerceklesen ilerleme 100'den buyuk olamaz")
    private Integer actualProgress;

    @NotNull(message = "Canli task sayisi belirtilmelidir")
    @Min(value = 0, message = "Canli task sayisi negatif olamaz")
    private Integer activeTaskCount;

    @NotNull(message = "Takvim durumu secilmelidir")
    private ScheduleStatus scheduleStatus;

    @NotNull(message = "Risk seviyesi secilmelidir")
    private RiskLevel riskLevel;

    private String generalNote;
}