package com.qams.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseVersionResponse {

    private Long id;
    private Long testCaseId;
    private Integer versionNumber;
    private String snapshotData;
    private Long updatedByUserId;
    private String updatedByUserName;
    private LocalDateTime createdAt;
}

