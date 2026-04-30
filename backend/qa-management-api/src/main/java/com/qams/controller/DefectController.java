package com.qams.controller;

import com.qams.dto.request.DefectCreateRequest;
import com.qams.dto.request.DefectStatusUpdateRequest;
import com.qams.dto.request.DefectUpdateRequest;
import com.qams.dto.response.DefectResponse;
import com.qams.service.DefectService;
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
@RequestMapping("/api/defects")
@RequiredArgsConstructor
public class DefectController {

    private final DefectService defectService;

    @PostMapping
    public ResponseEntity<DefectResponse> createDefect(
            @Valid @RequestBody DefectCreateRequest request
    ) {
        DefectResponse response = defectService.createDefect(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DefectResponse>> getAllDefects() {
        return ResponseEntity.ok(defectService.getAllDefects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefectResponse> getDefectById(@PathVariable Long id) {
        return ResponseEntity.ok(defectService.getDefectById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DefectResponse>> getDefectsByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(defectService.getDefectsByProjectId(projectId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DefectResponse> updateDefect(
            @PathVariable Long id,
            @Valid @RequestBody DefectUpdateRequest request
    ) {
        return ResponseEntity.ok(defectService.updateDefect(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DefectResponse> updateDefectStatus(
            @PathVariable Long id,
            @Valid @RequestBody DefectStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(defectService.updateDefectStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDefect(@PathVariable Long id) {
        defectService.deleteDefect(id);
        return ResponseEntity.noContent().build();
    }
}

