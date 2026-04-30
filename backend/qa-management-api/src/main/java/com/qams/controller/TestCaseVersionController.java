package com.qams.controller;

import com.qams.dto.response.TestCaseVersionResponse;
import com.qams.service.TestCaseVersionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-case-versions")
@RequiredArgsConstructor
public class TestCaseVersionController {

    private final TestCaseVersionService testCaseVersionService;

    @GetMapping("/test-case/{testCaseId}")
    public ResponseEntity<List<TestCaseVersionResponse>> getVersionsByTestCaseId(
            @PathVariable Long testCaseId
    ) {
        return ResponseEntity.ok(testCaseVersionService.getVersionsByTestCaseId(testCaseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestCaseVersionResponse> getVersionById(@PathVariable Long id) {
        return ResponseEntity.ok(testCaseVersionService.getVersionById(id));
    }
}

