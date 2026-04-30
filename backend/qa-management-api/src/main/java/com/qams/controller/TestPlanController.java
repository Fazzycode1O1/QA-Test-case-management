package com.qams.controller;

import com.qams.dto.request.TestPlanCreateRequest;
import com.qams.dto.request.TestPlanUpdateRequest;
import com.qams.dto.response.TestPlanResponse;
import com.qams.service.TestPlanService;
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
@RequestMapping("/api/test-plans")
@RequiredArgsConstructor
public class TestPlanController {

    private final TestPlanService testPlanService;

    @PostMapping
    public ResponseEntity<TestPlanResponse> createTestPlan(
            @Valid @RequestBody TestPlanCreateRequest request
    ) {
        TestPlanResponse response = testPlanService.createTestPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TestPlanResponse>> getAllTestPlans() {
        return ResponseEntity.ok(testPlanService.getAllTestPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestPlanResponse> getTestPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(testPlanService.getTestPlanById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TestPlanResponse>> getTestPlansByProjectId(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(testPlanService.getTestPlansByProjectId(projectId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestPlanResponse> updateTestPlan(
            @PathVariable Long id,
            @Valid @RequestBody TestPlanUpdateRequest request
    ) {
        return ResponseEntity.ok(testPlanService.updateTestPlan(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestPlan(@PathVariable Long id) {
        testPlanService.deleteTestPlan(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{planId}/test-suites/{suiteId}")
    public ResponseEntity<TestPlanResponse> addTestSuiteToPlan(
            @PathVariable Long planId,
            @PathVariable Long suiteId
    ) {
        return ResponseEntity.ok(testPlanService.addTestSuiteToPlan(planId, suiteId));
    }

    @DeleteMapping("/{planId}/test-suites/{suiteId}")
    public ResponseEntity<TestPlanResponse> removeTestSuiteFromPlan(
            @PathVariable Long planId,
            @PathVariable Long suiteId
    ) {
        return ResponseEntity.ok(testPlanService.removeTestSuiteFromPlan(planId, suiteId));
    }
}

