package com.qams.dto.request;

import com.qams.enums.DefectSeverity;
import com.qams.enums.DefectStatus;
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
public class DefectCreateRequest {

    @NotBlank(message = "Defect title is required")
    private String title;

    private String description;

    @NotNull(message = "Defect severity is required")
    private DefectSeverity severity;

    private TestPriority priority;

    private DefectStatus status;

    private Long testExecutionId;

    @NotNull(message = "Project id is required")
    private Long projectId;

    private Long reportedByUserId;

    private Long assignedToUserId;
}

