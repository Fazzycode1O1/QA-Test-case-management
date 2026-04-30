package com.qams.service;

import com.qams.dto.request.ModuleCreateRequest;
import com.qams.dto.request.ModuleUpdateRequest;
import com.qams.dto.response.ModuleResponse;
import com.qams.entity.Module;
import com.qams.entity.Project;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.ModuleRepository;
import com.qams.repository.ProjectRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public ModuleResponse createModule(ModuleCreateRequest request) {
        Project project = getProjectById(request.getProjectId());

        Module module = new Module();
        module.setName(request.getName());
        module.setDescription(request.getDescription());
        module.setProject(project);

        Module savedModule = moduleRepository.save(module);
        return mapToResponse(savedModule);
    }

    @Transactional(readOnly = true)
    public List<ModuleResponse> getAllModules() {
        return moduleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ModuleResponse getModuleById(Long id) {
        Module module = getModuleEntityById(id);
        return mapToResponse(module);
    }

    @Transactional(readOnly = true)
    public List<ModuleResponse> getModulesByProjectId(Long projectId) {
        getProjectById(projectId);

        return moduleRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ModuleResponse updateModule(Long id, ModuleUpdateRequest request) {
        Module module = getModuleEntityById(id);
        Project project = getProjectById(request.getProjectId());

        module.setName(request.getName());
        module.setDescription(request.getDescription());
        module.setProject(project);

        Module updatedModule = moduleRepository.save(module);
        return mapToResponse(updatedModule);
    }

    @Transactional
    public void deleteModule(Long id) {
        Module module = getModuleEntityById(id);
        moduleRepository.delete(module);
    }

    private Module getModuleEntityById(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + id));
    }

    private Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private ModuleResponse mapToResponse(Module module) {
        Project project = module.getProject();

        return new ModuleResponse(
                module.getId(),
                module.getName(),
                module.getDescription(),
                project != null ? project.getId() : null,
                project != null ? project.getName() : null,
                module.getCreatedAt(),
                module.getUpdatedAt()
        );
    }
}

