package com.qams.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qams.dto.response.TestCaseVersionResponse;
import com.qams.entity.TestCase;
import com.qams.entity.TestCaseVersion;
import com.qams.entity.User;
import com.qams.exception.ResourceNotFoundException;
import com.qams.repository.TestCaseRepository;
import com.qams.repository.TestCaseVersionRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TestCaseVersionService {

    private final TestCaseVersionRepository testCaseVersionRepository;
    private final TestCaseRepository testCaseRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void createVersion(
            TestCase testCase,
            Map<String, Object> oldValues,
            Map<String, Object> newValues,
            User updatedBy
    ) {
        TestCaseVersion version = new TestCaseVersion();
        version.setTestCase(testCase);
        version.setVersionNumber(getNextVersionNumber(testCase.getId()));
        version.setSnapshotData(buildSnapshotData(oldValues, newValues, updatedBy));
        version.setUpdatedBy(updatedBy);

        testCaseVersionRepository.save(version);
    }

    @Transactional(readOnly = true)
    public List<TestCaseVersionResponse> getVersionsByTestCaseId(Long testCaseId) {
        testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with id: " + testCaseId));

        return testCaseVersionRepository.findByTestCaseIdOrderByVersionNumberDesc(testCaseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TestCaseVersionResponse getVersionById(Long id) {
        TestCaseVersion version = testCaseVersionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case version not found with id: " + id));

        return mapToResponse(version);
    }

    private int getNextVersionNumber(Long testCaseId) {
        return (int) testCaseVersionRepository.countByTestCaseId(testCaseId) + 1;
    }

    private String buildSnapshotData(
            Map<String, Object> oldValues,
            Map<String, Object> newValues,
            User updatedBy
    ) {
        Map<String, Object> snapshot = new LinkedHashMap<>();
        snapshot.put("oldValues", oldValues);
        snapshot.put("newValues", newValues);

        if (updatedBy != null) {
            snapshot.put("updatedByUserId", updatedBy.getId());
            snapshot.put("updatedByUserName", updatedBy.getName());
        }

        try {
            return objectMapper.writeValueAsString(snapshot);
        } catch (JsonProcessingException ex) {
            return snapshot.toString();
        }
    }

    private TestCaseVersionResponse mapToResponse(TestCaseVersion version) {
        TestCase testCase = version.getTestCase();
        User updatedBy = version.getUpdatedBy();

        return new TestCaseVersionResponse(
                version.getId(),
                testCase != null ? testCase.getId() : null,
                version.getVersionNumber(),
                version.getSnapshotData(),
                updatedBy != null ? updatedBy.getId() : null,
                updatedBy != null ? updatedBy.getName() : null,
                version.getCreatedAt()
        );
    }
}

