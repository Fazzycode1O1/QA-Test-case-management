package com.qams.service;

import com.qams.dto.request.TestSuiteCreateRequest;
import com.qams.dto.request.TestSuiteUpdateRequest;
import com.qams.dto.response.TestSuiteResponse;
import com.qams.entity.Project;
import com.qams.entity.TestCase;
import com.qams.entity.TestPlan;
import com.qams.entity.TestSuite;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.ProjectRepository;
import com.qams.repository.TestCaseRepository;
import com.qams.repository.TestSuiteRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestSuiteService {

    private final TestSuiteRepository testSuiteRepository;
    private final ProjectRepository projectRepository;
    private final TestCaseRepository testCaseRepository;

    @Transactional
    public TestSuiteResponse createTestSuite(TestSuiteCreateRequest request) {
        Project project = getProjectById(request.getProjectId());

        TestSuite testSuite = new TestSuite();
        testSuite.setName(request.getName());
        testSuite.setDescription(request.getDescription());
        testSuite.setProject(project);
        testSuite.setTestCases(getTestCasesByIds(request.getTestCaseIds()));

        TestSuite savedSuite = testSuiteRepository.save(testSuite);
        return mapToResponse(savedSuite);
    }

    @Transactional(readOnly = true)
    public List<TestSuiteResponse> getAllTestSuites() {
        return testSuiteRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TestSuiteResponse getTestSuiteById(Long id) {
        TestSuite testSuite = getTestSuiteEntityById(id);
        return mapToResponse(testSuite);
    }

    @Transactional(readOnly = true)
    public List<TestSuiteResponse> getTestSuitesByProjectId(Long projectId) {
        getProjectById(projectId);

        return testSuiteRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public TestSuiteResponse updateTestSuite(Long id, TestSuiteUpdateRequest request) {
        TestSuite testSuite = getTestSuiteEntityById(id);
        Project project = getProjectById(request.getProjectId());

        testSuite.setName(request.getName());
        testSuite.setDescription(request.getDescription());
        testSuite.setProject(project);
        testSuite.setTestCases(getTestCasesByIds(request.getTestCaseIds()));

        TestSuite updatedSuite = testSuiteRepository.save(testSuite);
        return mapToResponse(updatedSuite);
    }

    @Transactional
    public void deleteTestSuite(Long id) {
        TestSuite testSuite = getTestSuiteEntityById(id);

        List<TestPlan> relatedPlans = new ArrayList<>(testSuite.getTestPlans());

        for (TestPlan testPlan : relatedPlans) {
            testPlan.getTestSuites().remove(testSuite);
        }

        testSuiteRepository.delete(testSuite);
    }

    @Transactional
    public TestSuiteResponse addTestCaseToSuite(Long suiteId, Long testCaseId) {
        TestSuite testSuite = getTestSuiteEntityById(suiteId);
        TestCase testCase = getTestCaseById(testCaseId);

        boolean alreadyAdded = testSuite.getTestCases()
                .stream()
                .anyMatch(existingTestCase -> existingTestCase.getId().equals(testCaseId));

        if (!alreadyAdded) {
            testSuite.getTestCases().add(testCase);
        }

        TestSuite updatedSuite = testSuiteRepository.save(testSuite);
        return mapToResponse(updatedSuite);
    }

    @Transactional
    public TestSuiteResponse removeTestCaseFromSuite(Long suiteId, Long testCaseId) {
        TestSuite testSuite = getTestSuiteEntityById(suiteId);
        getTestCaseById(testCaseId);

        testSuite.getTestCases().removeIf(testCase -> testCase.getId().equals(testCaseId));

        TestSuite updatedSuite = testSuiteRepository.save(testSuite);
        return mapToResponse(updatedSuite);
    }

    private TestSuite getTestSuiteEntityById(Long id) {
        return testSuiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test suite not found with id: " + id));
    }

    private Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private TestCase getTestCaseById(Long id) {
        return testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with id: " + id));
    }

    private List<TestCase> getTestCasesByIds(List<Long> testCaseIds) {
        if (testCaseIds == null || testCaseIds.isEmpty()) {
            return new ArrayList<>();
        }

        return testCaseIds.stream()
                .map(this::getTestCaseById)
                .toList();
    }

    private TestSuiteResponse mapToResponse(TestSuite testSuite) {
        Project project = testSuite.getProject();
        List<Long> testCaseIds = testSuite.getTestCases()
                .stream()
                .map(TestCase::getId)
                .toList();

        return new TestSuiteResponse(
                testSuite.getId(),
                testSuite.getName(),
                testSuite.getDescription(),
                project != null ? project.getId() : null,
                project != null ? project.getName() : null,
                testCaseIds,
                testCaseIds.size(),
                testSuite.getCreatedAt(),
                testSuite.getUpdatedAt()
        );
    }
}
