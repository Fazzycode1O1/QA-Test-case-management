package com.qams.repository;

import com.qams.entity.Defect;
import com.qams.enums.DefectStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DefectRepository extends JpaRepository<Defect, Long> {

    List<Defect> findByProjectId(Long projectId);

    Optional<Defect> findByTestExecutionId(Long testExecutionId);

    long countByStatus(DefectStatus status);
}
