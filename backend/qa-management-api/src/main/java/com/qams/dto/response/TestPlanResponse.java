package com.qams.dto.response;

import java.time.LocalDate;
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
public class TestPlanResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long projectId;
    private String projectName;
    private List<Long> testSuiteIds;
    private int totalTestSuites;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

