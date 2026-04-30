package com.qams.controller;

import com.qams.dto.request.TestCaseCreateRequest;
import com.qams.dto.request.TestCaseUpdateRequest;
import com.qams.dto.response.TestCaseResponse;
import com.qams.enums.TestPriority;
import com.qams.enums.TestStatus;
import com.qams.service.TestCaseService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-cases")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestCaseService testCaseService;

    @PostMapping
    public ResponseEntity<TestCaseResponse> createTestCase(
            @Valid @RequestBody TestCaseCreateRequest request
    ) {
        TestCaseResponse response = testCaseService.createTestCase(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TestCaseResponse>> getAllTestCases() {
        return ResponseEntity.ok(testCaseService.getAllTestCases());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TestCaseResponse>> searchTestCases(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TestPriority priority,
            @RequestParam(required = false) TestStatus status,
            @RequestParam(required = false) Long moduleId
    ) {
        return ResponseEntity.ok(testCaseService.searchTestCases(keyword, priority, status, moduleId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestCaseResponse> getTestCaseById(@PathVariable Long id) {
        return ResponseEntity.ok(testCaseService.getTestCaseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestCaseResponse> updateTestCase(
            @PathVariable Long id,
            @Valid @RequestBody TestCaseUpdateRequest request
    ) {
        return ResponseEntity.ok(testCaseService.updateTestCase(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long id) {
        testCaseService.deleteTestCase(id);
        return ResponseEntity.noContent().build();
    }
}
