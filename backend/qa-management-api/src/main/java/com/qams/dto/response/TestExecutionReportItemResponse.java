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
public class TestExecutionReportItemResponse {

    private Long id;
    private Long testCaseId;
    private String testCaseTitle;
    private TestStatus status;
    private Long executedByUserId;
    private String executedByUserName;
    private String actualResult;
    private LocalDateTime executedAt;
}

