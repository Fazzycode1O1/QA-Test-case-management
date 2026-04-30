package com.qams.dto.response;

import com.qams.enums.TestPriority;
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
public class TestCaseResponse {

    private Long id;
    private String title;
    private String description;
    private String preconditions;
    private String steps;
    private String expectedResult;
    private TestPriority priority;
    private TestStatus status;
    private Long moduleId;
    private String moduleName;
    private Long createdByUserId;
    private String createdByUserName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

