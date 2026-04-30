package com.qams.dto.response;

import com.qams.enums.TestStatus;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestExecutionResponse {

    private Long id;
    private Long testCaseId;
    private String testCaseTitle;
    private Long testPlanId;
    private String testPlanName;
    private Long executedByUserId;
    private String executedByUserName;
    private TestStatus status;
    private String actualResult;
    private String notes;
    private LocalDateTime executedAt;
    private Long defectId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

