package com.kolaysoft.ctotracker.dto.response;

import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String name;
    private String customer;
    private String code;
    private String description;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate targetEndDate;

    private Long managerId;
    private String managerFullName;
}