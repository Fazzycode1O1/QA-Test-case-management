package com.qams.controller;

import com.qams.dto.request.TestSuiteCreateRequest;
import com.qams.dto.request.TestSuiteUpdateRequest;
import com.qams.dto.response.TestSuiteResponse;
import com.qams.service.TestSuiteService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-suites")
@RequiredArgsConstructor
public class TestSuiteController {

    private final TestSuiteService testSuiteService;

    @PostMapping
    public ResponseEntity<TestSuiteResponse> createTestSuite(
            @Valid @RequestBody TestSuiteCreateRequest request
    ) {
        TestSuiteResponse response = testSuiteService.createTestSuite(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TestSuiteResponse>> getAllTestSuites() {
        return ResponseEntity.ok(testSuiteService.getAllTestSuites());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestSuiteResponse> getTestSuiteById(@PathVariable Long id) {
        return ResponseEntity.ok(testSuiteService.getTestSuiteById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TestSuiteResponse>> getTestSuitesByProjectId(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(testSuiteService.getTestSuitesByProjectId(projectId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestSuiteResponse> updateTestSuite(
            @PathVariable Long id,
            @Valid @RequestBody TestSuiteUpdateRequest request
    ) {
        return ResponseEntity.ok(testSuiteService.updateTestSuite(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestSuite(@PathVariable Long id) {
        testSuiteService.deleteTestSuite(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{suiteId}/test-cases/{testCaseId}")
    public ResponseEntity<TestSuiteResponse> addTestCaseToSuite(
            @PathVariable Long suiteId,
            @PathVariable Long testCaseId
    ) {
        return ResponseEntity.ok(testSuiteService.addTestCaseToSuite(suiteId, testCaseId));
    }

    @DeleteMapping("/{suiteId}/test-cases/{testCaseId}")
    public ResponseEntity<TestSuiteResponse> removeTestCaseFromSuite(
            @PathVariable Long suiteId,
            @PathVariable Long testCaseId
    ) {
        return ResponseEntity.ok(testSuiteService.removeTestCaseFromSuite(suiteId, testCaseId));
    }
}

