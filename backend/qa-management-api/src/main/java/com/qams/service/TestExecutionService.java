package com.qams.service;

import com.qams.dto.request.TestExecutionCreateRequest;
import com.qams.dto.request.TestExecutionUpdateRequest;
import com.qams.dto.response.TestExecutionResponse;
import com.qams.entity.Defect;
import com.qams.entity.TestCase;
import com.qams.entity.TestExecution;
import com.qams.entity.TestPlan;
import com.qams.entity.User;
import com.qams.enums.TestStatus;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.TestCaseRepository;
import com.qams.repository.TestExecutionRepository;
import com.qams.repository.TestPlanRepository;
import com.qams.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestExecutionService {

    private final TestExecutionRepository testExecutionRepository;
    private final TestCaseRepository testCaseRepository;
    private final TestPlanRepository testPlanRepository;
    private final UserRepository userRepository;

    @Transactional
    public TestExecutionResponse createTestExecution(TestExecutionCreateRequest request) {
        TestCase testCase = getTestCaseById(request.getTestCaseId());
        TestPlan testPlan = getOptionalTestPlanById(request.getTestPlanId());
        User executedBy = getOptionalUserById(request.getExecutedByUserId());

        TestExecution testExecution = new TestExecution();
        testExecution.setTestCase(testCase);
        testExecution.setTestPlan(testPlan);
        testExecution.setExecutedBy(executedBy);
        testExecution.setStatus(request.getStatus());
        testExecution.setActualResult(request.getActualResult());
        testExecution.setNotes(request.getNotes());

        if (request.getStatus() != TestStatus.PENDING) {
            testExecution.setExecutedAt(LocalDateTime.now());
        }

        TestExecution savedExecution = testExecutionRepository.save(testExecution);
        return mapToResponse(savedExecution);
    }

    @Transactional(readOnly = true)
    public List<TestExecutionResponse> getAllTestExecutions() {
        return testExecutionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TestExecutionResponse getTestExecutionById(Long id) {
        TestExecution testExecution = getTestExecutionEntityById(id);
        return mapToResponse(testExecution);
    }

    @Transactional(readOnly = true)
    public List<TestExecutionResponse> getTestExecutionsByTestCaseId(Long testCaseId) {
        getTestCaseById(testCaseId);

        return testExecutionRepository.findByTestCaseId(testCaseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public TestExecutionResponse updateTestExecutionStatus(Long id, TestExecutionUpdateRequest request) {
        TestExecution testExecution = getTestExecutionEntityById(id);
        User executedBy = getOptionalUserById(request.getExecutedByUserId());

        testExecution.setStatus(request.getStatus());
        testExecution.setExecutedBy(executedBy);
        testExecution.setActualResult(request.getActualResult());
        testExecution.setNotes(request.getNotes());

        if (request.getStatus() != TestStatus.PENDING) {
            testExecution.setExecutedAt(LocalDateTime.now());
        }

        TestExecution updatedExecution = testExecutionRepository.save(testExecution);
        return mapToResponse(updatedExecution);
    }

    @Transactional
    public void deleteTestExecution(Long id) {
        TestExecution testExecution = getTestExecutionEntityById(id);
        testExecutionRepository.delete(testExecution);
    }

    private TestExecution getTestExecutionEntityById(Long id) {
        return testExecutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test execution not found with id: " + id));
    }

    private TestCase getTestCaseById(Long id) {
        return testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with id: " + id));
    }

    private TestPlan getOptionalTestPlanById(Long id) {
        if (id == null) {
            return null;
        }

        return testPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test plan not found with id: " + id));
    }

    private User getOptionalUserById(Long id) {
        if (id == null) {
            return null;
        }

        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private TestExecutionResponse mapToResponse(TestExecution testExecution) {
        TestCase testCase = testExecution.getTestCase();
        TestPlan testPlan = testExecution.getTestPlan();
        User executedBy = testExecution.getExecutedBy();
        Defect defect = testExecution.getDefect();

        return new TestExecutionResponse(
                testExecution.getId(),
                testCase != null ? testCase.getId() : null,
                testCase != null ? testCase.getTitle() : null,
                testPlan != null ? testPlan.getId() : null,
                testPlan != null ? testPlan.getName() : null,
                executedBy != null ? executedBy.getId() : null,
                executedBy != null ? executedBy.getName() : null,
                testExecution.getStatus(),
                testExecution.getActualResult(),
                testExecution.getNotes(),
                testExecution.getExecutedAt(),
                defect != null ? defect.getId() : null,
                testExecution.getCreatedAt(),
                testExecution.getUpdatedAt()
        );
    }
}

