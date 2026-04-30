package com.qams.dto.response;

import com.qams.enums.DefectSeverity;
import com.qams.enums.DefectStatus;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DefectReportItemResponse {

    private Long id;
    private String title;
    private DefectSeverity severity;
    private DefectStatus status;
    private Long projectId;
    private String projectName;
    private Long testExecutionId;
    private LocalDateTime createdAt;
}

