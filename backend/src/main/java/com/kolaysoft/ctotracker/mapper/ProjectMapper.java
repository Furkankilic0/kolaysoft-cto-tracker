package com.kolaysoft.ctotracker.mapper;

import com.kolaysoft.ctotracker.dto.request.ProjectRequest;
import com.kolaysoft.ctotracker.dto.response.ProjectResponse;
import com.kolaysoft.ctotracker.entity.Project;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProjectMapper {

    public Project toEntity(ProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setCustomer(request.getCustomer());
        project.setCode(request.getCode());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setTargetEndDate(request.getTargetEndDate());
        return project;
    }

    public ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setCustomer(project.getCustomer());
        response.setCode(project.getCode());
        response.setDescription(project.getDescription());
        response.setStatus(project.getStatus());
        response.setStartDate(project.getStartDate());
        response.setTargetEndDate(project.getTargetEndDate());

        if (project.getManager() != null) {
            response.setManagerId(project.getManager().getId());
            response.setManagerFullName(project.getManager().getFullName());
        }

        return response;
    }

    public List<ProjectResponse> toResponseList(List<Project> projects) {
        return projects.stream()
                .map(this::toResponse)
                .toList();
    }
}