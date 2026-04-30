package com.qams.dto.request;

import com.qams.enums.TestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestExecutionUpdateRequest {

    @NotNull(message = "Execution status is required")
    private TestStatus status;

    private Long executedByUserId;

    private String actualResult;

    private String notes;
}

