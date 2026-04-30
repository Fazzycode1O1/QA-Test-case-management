package com.qams.service;

import com.qams.dto.request.DefectCreateRequest;
import com.qams.dto.request.DefectStatusUpdateRequest;
import com.qams.dto.request.DefectUpdateRequest;
import com.qams.dto.response.DefectResponse;
import com.qams.entity.Defect;
import com.qams.entity.Project;
import com.qams.entity.TestExecution;
import com.qams.entity.User;
import com.qams.enums.DefectStatus;
import com.qams.enums.TestPriority;
import com.qams.enums.TestStatus;
import com.qams.enums.DefectSeverity;
import com.qams.exception.BadRequestException;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.DefectRepository;
import com.qams.repository.ProjectRepository;
import com.qams.repository.TestExecutionRepository;
import com.qams.repository.UserRepository;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DefectService {

    private final DefectRepository defectRepository;
    private final ProjectRepository projectRepository;
    private final TestExecutionRepository testExecutionRepository;
    private final UserRepository userRepository;

    @Transactional
    public DefectResponse createDefect(DefectCreateRequest request) {
        Project project = getProjectById(request.getProjectId());
        TestExecution testExecution = getOptionalFailedTestExecution(request.getTestExecutionId(), null);
        User reportedBy = getOptionalUserById(request.getReportedByUserId());
        User assignedTo = getOptionalUserById(request.getAssignedToUserId());

        Defect defect = new Defect();
        defect.setTitle(request.getTitle());
        defect.setDescription(request.getDescription());
        defect.setSeverity(request.getSeverity());
        defect.setPriority(getPriorityOrDefault(request.getPriority()));
        defect.setStatus(getStatusOrDefault(request.getStatus()));
        defect.setTestExecution(testExecution);
        defect.setProject(project);
        defect.setReportedBy(reportedBy);
        defect.setAssignedTo(assignedTo);

        Defect savedDefect = defectRepository.save(defect);
        return mapToResponse(savedDefect);
    }

    @Transactional(readOnly = true)
    public List<DefectResponse> getAllDefects() {
        return defectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DefectResponse getDefectById(Long id) {
        Defect defect = getDefectEntityById(id);
        return mapToResponse(defect);
    }

    @Transactional(readOnly = true)
    public List<DefectResponse> getDefectsByProjectId(Long projectId) {
        getProjectById(projectId);

        return defectRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DefectResponse> searchDefects(
            String keyword,
            DefectSeverity severity,
            DefectStatus status,
            Long projectId
    ) {
        return defectRepository.findAll()
                .stream()
                .filter(defect -> matchesKeyword(defect, keyword))
                .filter(defect -> severity == null || defect.getSeverity() == severity)
                .filter(defect -> status == null || defect.getStatus() == status)
                .filter(defect -> projectId == null || hasProjectId(defect, projectId))
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public DefectResponse updateDefect(Long id, DefectUpdateRequest request) {
        Defect defect = getDefectEntityById(id);
        Project project = getProjectById(request.getProjectId());
        TestExecution testExecution = getOptionalFailedTestExecution(request.getTestExecutionId(), id);
        User reportedBy = getOptionalUserById(request.getReportedByUserId());
        User assignedTo = getOptionalUserById(request.getAssignedToUserId());

        defect.setTitle(request.getTitle());
        defect.setDescription(request.getDescription());
        defect.setSeverity(request.getSeverity());
        defect.setPriority(getPriorityOrDefault(request.getPriority()));
        defect.setStatus(request.getStatus());
        defect.setTestExecution(testExecution);
        defect.setProject(project);
        defect.setReportedBy(reportedBy);
        defect.setAssignedTo(assignedTo);

        Defect updatedDefect = defectRepository.save(defect);
        return mapToResponse(updatedDefect);
    }

    @Transactional
    public DefectResponse updateDefectStatus(Long id, DefectStatusUpdateRequest request) {
        Defect defect = getDefectEntityById(id);
        defect.setStatus(request.getStatus());

        Defect updatedDefect = defectRepository.save(defect);
        return mapToResponse(updatedDefect);
    }

    @Transactional
    public void deleteDefect(Long id) {
        Defect defect = getDefectEntityById(id);
        defectRepository.delete(defect);
    }

    private Defect getDefectEntityById(Long id) {
        return defectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Defect not found with id: " + id));
    }

    private Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private User getOptionalUserById(Long id) {
        if (id == null) {
            return null;
        }

        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private TestExecution getOptionalFailedTestExecution(Long id, Long currentDefectId) {
        if (id == null) {
            return null;
        }

        TestExecution testExecution = testExecutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test execution not found with id: " + id));

        if (testExecution.getStatus() != TestStatus.FAILED) {
            throw new BadRequestException("Defect can only be linked to a failed test execution");
        }

        defectRepository.findByTestExecutionId(id).ifPresent(existingDefect -> {
            if (!existingDefect.getId().equals(currentDefectId)) {
                throw new BadRequestException("Test execution already has a linked defect");
            }
        });

        return testExecution;
    }

    private TestPriority getPriorityOrDefault(TestPriority priority) {
        return priority != null ? priority : TestPriority.MEDIUM;
    }

    private DefectStatus getStatusOrDefault(DefectStatus status) {
        return status != null ? status : DefectStatus.OPEN;
    }

    private boolean matchesKeyword(Defect defect, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }

        String normalizedKeyword = keyword.toLowerCase(Locale.ROOT);

        return containsIgnoreCase(defect.getTitle(), normalizedKeyword)
                || containsIgnoreCase(defect.getDescription(), normalizedKeyword);
    }

    private boolean containsIgnoreCase(String value, String normalizedKeyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(normalizedKeyword);
    }

    private boolean hasProjectId(Defect defect, Long projectId) {
        return defect.getProject() != null && defect.getProject().getId().equals(projectId);
    }

    private DefectResponse mapToResponse(Defect defect) {
        TestExecution testExecution = defect.getTestExecution();
        Project project = defect.getProject();
        User reportedBy = defect.getReportedBy();
        User assignedTo = defect.getAssignedTo();

        return new DefectResponse(
                defect.getId(),
                defect.getTitle(),
                defect.getDescription(),
                defect.getSeverity(),
                defect.getPriority(),
                defect.getStatus(),
                testExecution != null ? testExecution.getId() : null,
                project != null ? project.getId() : null,
                project != null ? project.getName() : null,
                reportedBy != null ? reportedBy.getId() : null,
                reportedBy != null ? reportedBy.getName() : null,
                assignedTo != null ? assignedTo.getId() : null,
                assignedTo != null ? assignedTo.getName() : null,
                defect.getCreatedAt(),
                defect.getUpdatedAt()
        );
    }
}
