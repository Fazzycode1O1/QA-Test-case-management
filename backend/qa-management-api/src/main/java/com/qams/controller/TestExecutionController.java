package com.qams.controller;

import com.qams.dto.request.TestExecutionCreateRequest;
import com.qams.dto.request.TestExecutionUpdateRequest;
import com.qams.dto.response.TestExecutionResponse;
import com.qams.service.TestExecutionService;
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
@RequestMapping("/api/test-executions")
@RequiredArgsConstructor
public class TestExecutionController {

    private final TestExecutionService testExecutionService;

    @PostMapping
    public ResponseEntity<TestExecutionResponse> createTestExecution(
            @Valid @RequestBody TestExecutionCreateRequest request
    ) {
        TestExecutionResponse response = testExecutionService.createTestExecution(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TestExecutionResponse>> getAllTestExecutions() {
        return ResponseEntity.ok(testExecutionService.getAllTestExecutions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestExecutionResponse> getTestExecutionById(@PathVariable Long id) {
        return ResponseEntity.ok(testExecutionService.getTestExecutionById(id));
    }

    @GetMapping("/test-case/{testCaseId}")
    public ResponseEntity<List<TestExecutionResponse>> getTestExecutionsByTestCaseId(
            @PathVariable Long testCaseId
    ) {
        return ResponseEntity.ok(testExecutionService.getTestExecutionsByTestCaseId(testCaseId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TestExecutionResponse> updateTestExecutionStatus(
            @PathVariable Long id,
            @Valid @RequestBody TestExecutionUpdateRequest request
    ) {
        return ResponseEntity.ok(testExecutionService.updateTestExecutionStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestExecution(@PathVariable Long id) {
        testExecutionService.deleteTestExecution(id);
        return ResponseEntity.noContent().build();
    }
}

