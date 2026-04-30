package com.qams.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestSuiteUpdateRequest {

    @NotBlank(message = "Test suite name is required")
    private String name;

    private String description;

    @NotNull(message = "Project id is required")
    private Long projectId;

    private List<Long> testCaseIds;
}

