package com.qams.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestExecutionReportResponse {

    private long totalExecutions;
    private long totalPassedExecutions;
    private long totalFailedExecutions;
    private long totalBlockedExecutions;
    private long totalPendingExecutions;
    private List<TestExecutionReportItemResponse> testExecutions;
}

