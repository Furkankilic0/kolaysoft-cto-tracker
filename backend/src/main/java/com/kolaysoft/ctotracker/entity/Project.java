package com.kolaysoft.ctotracker.entity;

import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "projects")
public class Project extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(unique = true, length = 20)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProjectStatus status = ProjectStatus.PLANNING;

    private LocalDate startDate;

    private LocalDate targetEndDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;
}