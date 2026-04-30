package com.qams.dto.request;

import com.qams.enums.DefectStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DefectStatusUpdateRequest {

    @NotNull(message = "Defect status is required")
    private DefectStatus status;
}

