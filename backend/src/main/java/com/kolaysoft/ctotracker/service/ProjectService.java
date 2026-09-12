package com.kolaysoft.ctotracker.service;

import com.kolaysoft.ctotracker.entity.Project;
import com.kolaysoft.ctotracker.entity.User;
import com.kolaysoft.ctotracker.entity.enums.ProjectStatus;
import com.kolaysoft.ctotracker.entity.enums.Role;
import com.kolaysoft.ctotracker.exception.BusinessRuleException;
import com.kolaysoft.ctotracker.exception.ResourceNotFoundException;
import com.kolaysoft.ctotracker.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proje bulunamadi. ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByManager(Long managerId) {
        return projectRepository.findByManagerId(managerId);
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    @Transactional
    public Project createProject(Project project, Long managerId) {
        User manager = userService.getUserById(managerId);

        if (manager.getRole() != Role.PROJECT_MANAGER) {
            throw new BusinessRuleException("Proje yoneticisi sadece PROJECT_MANAGER rolune sahip olabilir.");
        }

        if (project.getCode() != null && projectRepository.existsByCode(project.getCode())) {
            throw new BusinessRuleException("Bu proje kodu zaten kullaniliyor: " + project.getCode());
        }

        if (project.getStartDate() != null && project.getTargetEndDate() != null
                && project.getTargetEndDate().isBefore(project.getStartDate())) {
            throw new BusinessRuleException("Bitis tarihi baslangic tarihinden once olamaz.");
        }

        project.setManager(manager);
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, Project updatedData) {
        Project existing = getProjectById(id);

        existing.setName(updatedData.getName());
        existing.setDescription(updatedData.getDescription());
        existing.setStartDate(updatedData.getStartDate());
        existing.setTargetEndDate(updatedData.getTargetEndDate());

        return projectRepository.save(existing);
    }

    @Transactional
    public Project changeStatus(Long id, ProjectStatus newStatus) {
        Project project = getProjectById(id);
        project.setStatus(newStatus);
        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}