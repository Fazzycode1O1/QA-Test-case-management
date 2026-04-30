package com.qams.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestSuiteResponse {

    private Long id;
    private String name;
    private String description;
    private Long projectId;
    private String projectName;
    private List<Long> testCaseIds;
    private int totalTestCases;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

