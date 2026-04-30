package com.qams.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestPlanUpdateRequest {

    @NotBlank(message = "Test plan name is required")
    private String name;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;

    @NotNull(message = "Project id is required")
    private Long projectId;

    private List<Long> testSuiteIds;
}

