package com.qams.service;

import com.qams.dto.request.TestCaseCreateRequest;
import com.qams.dto.request.TestCaseUpdateRequest;
import com.qams.dto.response.TestCaseResponse;
import com.qams.entity.Module;
import com.qams.entity.TestCase;
import com.qams.entity.User;
import com.qams.enums.TestPriority;
import com.qams.enums.TestStatus;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.ModuleRepository;
import com.qams.repository.TestCaseRepository;
import com.qams.repository.UserRepository;
import java.util.Locale;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ModuleRepository moduleRepository;
    private final UserRepository userRepository;

    @Transactional
    public TestCaseResponse createTestCase(TestCaseCreateRequest request) {
        Module module = getModuleById(request.getModuleId());
        User createdBy = getUserById(request.getCreatedByUserId());

        TestCase testCase = new TestCase();
        testCase.setTitle(request.getTitle());
        testCase.setDescription(request.getDescription());
        testCase.setPreconditions(request.getPreconditions());
        testCase.setSteps(request.getSteps());
        testCase.setExpectedResult(request.getExpectedResult());
        testCase.setPriority(request.getPriority());
        testCase.setModule(module);
        testCase.setCreatedBy(createdBy);

        TestCase savedTestCase = testCaseRepository.save(testCase);
        return mapToResponse(savedTestCase);
    }

    @Transactional(readOnly = true)
    public List<TestCaseResponse> getAllTestCases() {
        return testCaseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TestCaseResponse getTestCaseById(Long id) {
        TestCase testCase = getTestCaseEntityById(id);
        return mapToResponse(testCase);
    }

    @Transactional(readOnly = true)
    public List<TestCaseResponse> searchTestCases(
            String keyword,
            TestPriority priority,
            TestStatus status,
            Long moduleId
    ) {
        return testCaseRepository.findAll()
                .stream()
                .filter(testCase -> matchesKeyword(testCase, keyword))
                .filter(testCase -> priority == null || testCase.getPriority() == priority)
                .filter(testCase -> status == null || testCase.getStatus() == status)
                .filter(testCase -> moduleId == null || hasModuleId(testCase, moduleId))
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public TestCaseResponse updateTestCase(Long id, TestCaseUpdateRequest request) {
        TestCase testCase = getTestCaseEntityById(id);
        Module module = getModuleById(request.getModuleId());
        User createdBy = getUserById(request.getCreatedByUserId());

        testCase.setTitle(request.getTitle());
        testCase.setDescription(request.getDescription());
        testCase.setPreconditions(request.getPreconditions());
        testCase.setSteps(request.getSteps());
        testCase.setExpectedResult(request.getExpectedResult());
        testCase.setPriority(request.getPriority());
        testCase.setModule(module);
        testCase.setCreatedBy(createdBy);

        TestCase updatedTestCase = testCaseRepository.save(testCase);
        return mapToResponse(updatedTestCase);
    }

    @Transactional
    public void deleteTestCase(Long id) {
        TestCase testCase = getTestCaseEntityById(id);
        testCaseRepository.delete(testCase);
    }

    private TestCase getTestCaseEntityById(Long id) {
        return testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with id: " + id));
    }

    private Module getModuleById(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + id));
    }

    private User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private boolean matchesKeyword(TestCase testCase, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }

        String normalizedKeyword = keyword.toLowerCase(Locale.ROOT);

        return containsIgnoreCase(testCase.getTitle(), normalizedKeyword)
                || containsIgnoreCase(testCase.getDescription(), normalizedKeyword)
                || containsIgnoreCase(testCase.getSteps(), normalizedKeyword)
                || containsIgnoreCase(testCase.getExpectedResult(), normalizedKeyword);
    }

    private boolean containsIgnoreCase(String value, String normalizedKeyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(normalizedKeyword);
    }

    private boolean hasModuleId(TestCase testCase, Long moduleId) {
        return testCase.getModule() != null && testCase.getModule().getId().equals(moduleId);
    }

    private TestCaseResponse mapToResponse(TestCase testCase) {
        Module module = testCase.getModule();
        User createdBy = testCase.getCreatedBy();

        return new TestCaseResponse(
                testCase.getId(),
                testCase.getTitle(),
                testCase.getDescription(),
                testCase.getPreconditions(),
                testCase.getSteps(),
                testCase.getExpectedResult(),
                testCase.getPriority(),
                testCase.getStatus(),
                module != null ? module.getId() : null,
                module != null ? module.getName() : null,
                createdBy != null ? createdBy.getId() : null,
                createdBy != null ? createdBy.getName() : null,
                testCase.getCreatedAt(),
                testCase.getUpdatedAt()
        );
    }
}
