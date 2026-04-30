package com.qams.service;

import com.qams.dto.response.DashboardSummaryResponse;
import com.qams.enums.DefectStatus;
import com.qams.enums.TestStatus;
import com.qams.repository.DefectRepository;
import com.qams.repository.ModuleRepository;
import com.qams.repository.ProjectRepository;
import com.qams.repository.TestCaseRepository;
import com.qams.repository.TestExecutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final ModuleRepository moduleRepository;
    private final TestCaseRepository testCaseRepository;
    private final TestExecutionRepository testExecutionRepository;
    private final DefectRepository defectRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        long totalProjects = projectRepository.count();
        long totalModules = moduleRepository.count();
        long totalTestCases = testCaseRepository.count();

        long totalExecutions = testExecutionRepository.count();
        long totalPassedExecutions = testExecutionRepository.countByStatus(TestStatus.PASSED);
        long totalFailedExecutions = testExecutionRepository.countByStatus(TestStatus.FAILED);
        long totalBlockedExecutions = testExecutionRepository.countByStatus(TestStatus.BLOCKED);
        long totalPendingExecutions = testExecutionRepository.countByStatus(TestStatus.PENDING);

        long totalDefects = defectRepository.count();
        long openDefects = defectRepository.countByStatus(DefectStatus.OPEN);
        long inProgressDefects = defectRepository.countByStatus(DefectStatus.IN_PROGRESS);
        long resolvedDefects = defectRepository.countByStatus(DefectStatus.RESOLVED);
        long closedDefects = defectRepository.countByStatus(DefectStatus.CLOSED);

        double passRate = calculatePercentage(totalPassedExecutions, totalExecutions);
        double failRate = calculatePercentage(totalFailedExecutions, totalExecutions);

        return new DashboardSummaryResponse(
                totalProjects,
                totalModules,
                totalTestCases,
                totalExecutions,
                totalPassedExecutions,
                totalFailedExecutions,
                totalBlockedExecutions,
                totalPendingExecutions,
                totalDefects,
                openDefects,
                inProgressDefects,
                resolvedDefects,
                closedDefects,
                passRate,
                failRate
        );
    }

    private double calculatePercentage(long value, long total) {
        if (total == 0) {
            return 0.0;
        }

        double percentage = (value * 100.0) / total;
        return Math.round(percentage * 100.0) / 100.0;
    }
}

