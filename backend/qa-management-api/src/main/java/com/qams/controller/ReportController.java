package com.qams.controller;

import com.qams.dto.response.DefectReportResponse;
import com.qams.dto.response.TestCaseReportResponse;
import com.qams.dto.response.TestExecutionReportResponse;
import com.qams.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private static final MediaType TEXT_CSV = MediaType.parseMediaType("text/csv");

    private final ReportService reportService;

    @GetMapping("/test-cases")
    public ResponseEntity<TestCaseReportResponse> getTestCaseReport() {
        return ResponseEntity.ok(reportService.getTestCaseReport());
    }

    @GetMapping("/test-executions")
    public ResponseEntity<TestExecutionReportResponse> getTestExecutionReport() {
        return ResponseEntity.ok(reportService.getTestExecutionReport());
    }

    @GetMapping("/defects")
    public ResponseEntity<DefectReportResponse> getDefectReport() {
        return ResponseEntity.ok(reportService.getDefectReport());
    }

    @GetMapping(value = "/test-cases/csv", produces = "text/csv")
    public ResponseEntity<String> getTestCaseReportCsv() {
        return csvResponse("test-cases-report.csv", reportService.getTestCaseReportCsv());
    }

    @GetMapping(value = "/test-executions/csv", produces = "text/csv")
    public ResponseEntity<String> getTestExecutionReportCsv() {
        return csvResponse("test-executions-report.csv", reportService.getTestExecutionReportCsv());
    }

    @GetMapping(value = "/defects/csv", produces = "text/csv")
    public ResponseEntity<String> getDefectReportCsv() {
        return csvResponse("defects-report.csv", reportService.getDefectReportCsv());
    }

    private ResponseEntity<String> csvResponse(String fileName, String csvContent) {
        return ResponseEntity.ok()
                .contentType(TEXT_CSV)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(csvContent);
    }
}

