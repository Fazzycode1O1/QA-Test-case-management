package com.qams.service;

import com.qams.dto.request.TestPlanCreateRequest;
import com.qams.dto.request.TestPlanUpdateRequest;
import com.qams.dto.response.TestPlanResponse;
import com.qams.entity.Project;
import com.qams.entity.TestPlan;
import com.qams.entity.TestSuite;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.ProjectRepository;
import com.qams.repository.TestPlanRepository;
import com.qams.repository.TestSuiteRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestPlanService {

    private final TestPlanRepository testPlanRepository;
    private final ProjectRepository projectRepository;
    private final TestSuiteRepository testSuiteRepository;

    @Transactional
    public TestPlanResponse createTestPlan(TestPlanCreateRequest request) {
        Project project = getProjectById(request.getProjectId());

        TestPlan testPlan = new TestPlan();
        testPlan.setName(request.getName());
        testPlan.setDescription(request.getDescription());
        testPlan.setStartDate(request.getStartDate());
        testPlan.setEndDate(request.getEndDate());
        testPlan.setStatus(getStatusOrDefault(request.getStatus()));
        testPlan.setProject(project);
        testPlan.setTestSuites(getTestSuitesByIds(request.getTestSuiteIds()));

        TestPlan savedPlan = testPlanRepository.save(testPlan);
        return mapToResponse(savedPlan);
    }

    @Transactional(readOnly = true)
    public List<TestPlanResponse> getAllTestPlans() {
        return testPlanRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TestPlanResponse getTestPlanById(Long id) {
        TestPlan testPlan = getTestPlanEntityById(id);
        return mapToResponse(testPlan);
    }

    @Transactional(readOnly = true)
    public List<TestPlanResponse> getTestPlansByProjectId(Long projectId) {
        getProjectById(projectId);

        return testPlanRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public TestPlanResponse updateTestPlan(Long id, TestPlanUpdateRequest request) {
        TestPlan testPlan = getTestPlanEntityById(id);
        Project project = getProjectById(request.getProjectId());

        testPlan.setName(request.getName());
        testPlan.setDescription(request.getDescription());
        testPlan.setStartDate(request.getStartDate());
        testPlan.setEndDate(request.getEndDate());
        testPlan.setStatus(getStatusOrDefault(request.getStatus()));
        testPlan.setProject(project);
        testPlan.setTestSuites(getTestSuitesByIds(request.getTestSuiteIds()));

        TestPlan updatedPlan = testPlanRepository.save(testPlan);
        return mapToResponse(updatedPlan);
    }

    @Transactional
    public void deleteTestPlan(Long id) {
        TestPlan testPlan = getTestPlanEntityById(id);
        testPlanRepository.delete(testPlan);
    }

    @Transactional
    public TestPlanResponse addTestSuiteToPlan(Long planId, Long suiteId) {
        TestPlan testPlan = getTestPlanEntityById(planId);
        TestSuite testSuite = getTestSuiteById(suiteId);

        boolean alreadyAdded = testPlan.getTestSuites()
                .stream()
                .anyMatch(existingSuite -> existingSuite.getId().equals(suiteId));

        if (!alreadyAdded) {
            testPlan.getTestSuites().add(testSuite);
        }

        TestPlan updatedPlan = testPlanRepository.save(testPlan);
        return mapToResponse(updatedPlan);
    }

    @Transactional
    public TestPlanResponse removeTestSuiteFromPlan(Long planId, Long suiteId) {
        TestPlan testPlan = getTestPlanEntityById(planId);
        getTestSuiteById(suiteId);

        testPlan.getTestSuites().removeIf(testSuite -> testSuite.getId().equals(suiteId));

        TestPlan updatedPlan = testPlanRepository.save(testPlan);
        return mapToResponse(updatedPlan);
    }

    private TestPlan getTestPlanEntityById(Long id) {
        return testPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test plan not found with id: " + id));
    }

    private Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private TestSuite getTestSuiteById(Long id) {
        return testSuiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test suite not found with id: " + id));
    }

    private List<TestSuite> getTestSuitesByIds(List<Long> testSuiteIds) {
        if (testSuiteIds == null || testSuiteIds.isEmpty()) {
            return new ArrayList<>();
        }

        return testSuiteIds.stream()
                .map(this::getTestSuiteById)
                .toList();
    }

    private String getStatusOrDefault(String status) {
        if (status == null || status.isBlank()) {
            return "PENDING";
        }

        return status;
    }

    private TestPlanResponse mapToResponse(TestPlan testPlan) {
        Project project = testPlan.getProject();
        List<Long> testSuiteIds = testPlan.getTestSuites()
                .stream()
                .map(TestSuite::getId)
                .toList();

        return new TestPlanResponse(
                testPlan.getId(),
                testPlan.getName(),
                testPlan.getDescription(),
                testPlan.getStartDate(),
                testPlan.getEndDate(),
                testPlan.getStatus(),
                project != null ? project.getId() : null,
                project != null ? project.getName() : null,
                testSuiteIds,
                testSuiteIds.size(),
                testPlan.getCreatedAt(),
                testPlan.getUpdatedAt()
        );
    }
}
