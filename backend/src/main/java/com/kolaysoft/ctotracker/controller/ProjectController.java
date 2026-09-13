package com.kolaysoft.ctotracker.controller;

import com.kolaysoft.ctotracker.dto.request.ProjectRequest;
import com.kolaysoft.ctotracker.dto.response.ProjectResponse;
import com.kolaysoft.ctotracker.entity.Project;
import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import com.kolaysoft.ctotracker.mapper.ProjectMapper;
import com.kolaysoft.ctotracker.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectMapper projectMapper;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projectMapper.toResponseList(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(projectMapper.toResponse(project));
    }

    @GetMapping("/by-manager/{managerId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByManager(@PathVariable Long managerId) {
        List<Project> projects = projectService.getProjectsByManager(managerId);
        return ResponseEntity.ok(projectMapper.toResponseList(projects));
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<ProjectResponse>> getProjectsByStatus(@RequestParam ProjectStatus status) {
        List<Project> projects = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(projectMapper.toResponseList(projects));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        Project project = projectMapper.toEntity(request);
        Project saved = projectService.createProject(project, request.getManagerId());
        return ResponseEntity.status(HttpStatus.CREATED).body(projectMapper.toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id,
                                                         @Valid @RequestBody ProjectRequest request) {
        Project updatedData = projectMapper.toEntity(request);
        Project updated = projectService.updateProject(id, updatedData);
        return ResponseEntity.ok(projectMapper.toResponse(updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjectResponse> changeStatus(@PathVariable Long id,
                                                        @RequestParam ProjectStatus status) {
        Project updated = projectService.changeStatus(id, status);
        return ResponseEntity.ok(projectMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}