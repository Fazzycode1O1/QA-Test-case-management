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
public class TestCaseReportResponse {

    private long totalTestCases;
    private long lowPriorityTestCases;
    private long mediumPriorityTestCases;
    private long highPriorityTestCases;
    private long criticalPriorityTestCases;
    private List<TestCaseReportItemResponse> testCases;
}

