package com.qams.dto.response;

import com.qams.enums.DefectSeverity;
import com.qams.enums.DefectStatus;
import com.qams.enums.TestPriority;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DefectResponse {

    private Long id;
    private String title;
    private String description;
    private DefectSeverity severity;
    private TestPriority priority;
    private DefectStatus status;
    private Long testExecutionId;
    private Long projectId;
    private String projectName;
    private Long reportedByUserId;
    private String reportedByUserName;
    private Long assignedToUserId;
    private String assignedToUserName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

