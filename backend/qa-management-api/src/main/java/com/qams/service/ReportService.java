package com.qams.service;

import com.qams.dto.response.DefectReportItemResponse;
import com.qams.dto.response.DefectReportResponse;
import com.qams.dto.response.TestCaseReportItemResponse;
import com.qams.dto.response.TestCaseReportResponse;
import com.qams.dto.response.TestExecutionReportItemResponse;
import com.qams.dto.response.TestExecutionReportResponse;
import com.qams.entity.Defect;
import com.qams.entity.Module;
import com.qams.entity.Project;
import com.qams.entity.TestCase;
import com.qams.entity.TestExecution;
import com.qams.entity.User;
import com.qams.enums.DefectStatus;
import com.qams.enums.TestPriority;
import com.qams.enums.TestStatus;
import com.qams.repository.DefectRepository;
import com.qams.repository.TestCaseRepository;
import com.qams.repository.TestExecutionRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final String LINE_SEPARATOR = System.lineSeparator();

    private final TestCaseRepository testCaseRepository;
    private final TestExecutionRepository testExecutionRepository;
    private final DefectRepository defectRepository;

    @Transactional(readOnly = true)
    public TestCaseReportResponse getTestCaseReport() {
        List<TestCase> testCases = testCaseRepository.findAll();
        List<TestCaseReportItemResponse> reportItems = testCases.stream()
                .map(this::mapToTestCaseReportItem)
                .toList();

        return new TestCaseReportResponse(
                testCases.size(),
                countTestCasesByPriority(testCases, TestPriority.LOW),
                countTestCasesByPriority(testCases, TestPriority.MEDIUM),
                countTestCasesByPriority(testCases, TestPriority.HIGH),
                countTestCasesByPriority(testCases, TestPriority.CRITICAL),
                reportItems
        );
    }

    @Transactional(readOnly = true)
    public TestExecutionReportResponse getTestExecutionReport() {
        List<TestExecution> testExecutions = testExecutionRepository.findAll();
        List<TestExecutionReportItemResponse> reportItems = testExecutions.stream()
                .map(this::mapToTestExecutionReportItem)
                .toList();

        return new TestExecutionReportResponse(
                testExecutions.size(),
                countExecutionsByStatus(testExecutions, TestStatus.PASSED),
                countExecutionsByStatus(testExecutions, TestStatus.FAILED),
                countExecutionsByStatus(testExecutions, TestStatus.BLOCKED),
                countExecutionsByStatus(testExecutions, TestStatus.PENDING),
                reportItems
        );
    }

    @Transactional(readOnly = true)
    public DefectReportResponse getDefectReport() {
        List<Defect> defects = defectRepository.findAll();
        List<DefectReportItemResponse> reportItems = defects.stream()
                .map(this::mapToDefectReportItem)
                .toList();

        return new DefectReportResponse(
                defects.size(),
                countDefectsByStatus(defects, DefectStatus.OPEN),
                countDefectsByStatus(defects, DefectStatus.IN_PROGRESS),
                countDefectsByStatus(defects, DefectStatus.RESOLVED),
                countDefectsByStatus(defects, DefectStatus.CLOSED),
                reportItems
        );
    }

    @Transactional(readOnly = true)
    public String getTestCaseReportCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("id,title,priority,status,moduleName,projectName,createdBy,createdAt")
                .append(LINE_SEPARATOR);

        getTestCaseReport().getTestCases().forEach(testCase -> csv.append(toCsvLine(
                testCase.getId(),
                testCase.getTitle(),
                testCase.getPriority(),
                testCase.getStatus(),
                testCase.getModuleName(),
                testCase.getProjectName(),
                testCase.getCreatedByUserName(),
                testCase.getCreatedAt()
        )));

        return csv.toString();
    }

    @Transactional(readOnly = true)
    public String getTestExecutionReportCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("id,testCaseTitle,status,executedBy,actualResult,executedAt")
                .append(LINE_SEPARATOR);

        getTestExecutionReport().getTestExecutions().forEach(execution -> csv.append(toCsvLine(
                execution.getId(),
                execution.getTestCaseTitle(),
                execution.getStatus(),
                execution.getExecutedByUserName(),
                execution.getActualResult(),
                execution.getExecutedAt()
        )));

        return csv.toString();
    }

    @Transactional(readOnly = true)
    public String getDefectReportCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("id,title,severity,status,projectName,testExecutionId,createdAt")
                .append(LINE_SEPARATOR);

        getDefectReport().getDefects().forEach(defect -> csv.append(toCsvLine(
                defect.getId(),
                defect.getTitle(),
                defect.getSeverity(),
                defect.getStatus(),
                defect.getProjectName(),
                defect.getTestExecutionId(),
                defect.getCreatedAt()
        )));

        return csv.toString();
    }

    private long countTestCasesByPriority(List<TestCase> testCases, TestPriority priority) {
        return testCases.stream()
                .filter(testCase -> testCase.getPriority() == priority)
                .count();
    }

    private long countExecutionsByStatus(List<TestExecution> testExecutions, TestStatus status) {
        return testExecutions.stream()
                .filter(testExecution -> testExecution.getStatus() == status)
                .count();
    }

    private long countDefectsByStatus(List<Defect> defects, DefectStatus status) {
        return defects.stream()
                .filter(defect -> defect.getStatus() == status)
                .count();
    }

    private TestCaseReportItemResponse mapToTestCaseReportItem(TestCase testCase) {
        Module module = testCase.getModule();
        Project project = module != null ? module.getProject() : null;
        User createdBy = testCase.getCreatedBy();

        return new TestCaseReportItemResponse(
                testCase.getId(),
                testCase.getTitle(),
                testCase.getPriority(),
                testCase.getStatus(),
                module != null ? module.getId() : null,
                module != null ? module.getName() : null,
                project != null ? project.getId() : null,
                project != null ? project.getName() : null,
                createdBy != null ? createdBy.getId() : null,
                createdBy != null ? createdBy.getName() : null,
                testCase.getCreatedAt()
        );
    }

    private TestExecutionReportItemResponse mapToTestExecutionReportItem(TestExecution execution) {
        TestCase testCase = execution.getTestCase();
        User executedBy = execution.getExecutedBy();

        return new TestExecutionReportItemResponse(
                execution.getId(),
                testCase != null ? testCase.getId() : null,
                testCase != null ? testCase.getTitle() : null,
                execution.getStatus(),
                executedBy != null ? executedBy.getId() : null,
                executedBy != null ? executedBy.getName() : null,
                execution.getActualResult(),
                execution.getExecutedAt()
        );
    }

    private DefectReportItemResponse mapToDefectReportItem(Defect defect) {
        Project project = defect.getProject();
        TestExecution testExecution = defect.getTestExecution();

        return new DefectReportItemResponse(
                defect.getId(),
                defect.getTitle(),
                defect.getSeverity(),
                defect.getStatus(),
                project != null ? project.getId() : null,
                project != null ? project.getName() : null,
                testExecution != null ? testExecution.getId() : null,
                defect.getCreatedAt()
        );
    }

    private String toCsvLine(Object... values) {
        StringBuilder line = new StringBuilder();

        for (int i = 0; i < values.length; i++) {
            if (i > 0) {
                line.append(",");
            }

            line.append(escapeCsv(values[i]));
        }

        return line.append(LINE_SEPARATOR).toString();
    }

    private String escapeCsv(Object value) {
        if (value == null) {
            return "";
        }

        String text = value instanceof LocalDateTime ? value.toString() : String.valueOf(value);
        boolean needsQuotes = text.contains(",")
                || text.contains("\"")
                || text.contains("\n")
                || text.contains("\r");

        String escapedText = text.replace("\"", "\"\"");

        return needsQuotes ? "\"" + escapedText + "\"" : escapedText;
    }
}

