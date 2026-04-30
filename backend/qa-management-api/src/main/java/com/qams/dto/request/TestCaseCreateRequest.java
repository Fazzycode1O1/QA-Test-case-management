package com.qams.dto.request;

import com.qams.enums.TestPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String preconditions;

    @NotBlank(message = "Steps are required")
    private String steps;

    @NotBlank(message = "Expected result is required")
    private String expectedResult;

    @NotNull(message = "Priority is required")
    private TestPriority priority;

    @NotNull(message = "Module id is required")
    private Long moduleId;

    @NotNull(message = "Created by user id is required")
    private Long createdByUserId;
}

