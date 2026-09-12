package com.kolaysoft.ctotracker.repository;

import com.kolaysoft.ctotracker.entity.Project;
import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByCode(String code);

    List<Project> findByManagerId(Long managerId);

    List<Project> findByStatus(ProjectStatus status);

    boolean existsByCode(String code);
}