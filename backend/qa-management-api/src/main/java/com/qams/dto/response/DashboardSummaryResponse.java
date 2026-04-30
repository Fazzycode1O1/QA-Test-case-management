package com.qams.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private long totalProjects;
    private long totalModules;
    private long totalTestCases;
    private long totalExecutions;
    private long totalPassedExecutions;
    private long totalFailedExecutions;
    private long totalBlockedExecutions;
    private long totalPendingExecutions;
    private long totalDefects;
    private long openDefects;
    private long inProgressDefects;
    private long resolvedDefects;
    private long closedDefects;
    private double passRate;
    private double failRate;
}

