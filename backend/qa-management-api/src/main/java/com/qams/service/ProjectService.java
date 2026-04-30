package com.qams.service;

import com.qams.dto.request.ProjectCreateRequest;
import com.qams.dto.request.ProjectUpdateRequest;
import com.qams.dto.response.ProjectResponse;
import com.qams.entity.Project;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.ProjectRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectResponse createProject(ProjectCreateRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(getStatusOrDefault(request.getStatus()));

        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        Project project = getProjectEntityById(id);
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectUpdateRequest request) {
        Project project = getProjectEntityById(id);

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(getStatusOrDefault(request.getStatus()));

        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectEntityById(id);
        projectRepository.delete(project);
    }

    private Project getProjectEntityById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private String getStatusOrDefault(String status) {
        if (status == null || status.isBlank()) {
            return "ACTIVE";
        }

        return status;
    }

    private ProjectResponse mapToResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}

