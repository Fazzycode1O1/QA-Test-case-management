package com.qams.repository;

import com.qams.entity.TestExecution;
import com.qams.enums.TestStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestExecutionRepository extends JpaRepository<TestExecution, Long> {

    List<TestExecution> findByTestCaseId(Long testCaseId);

    long countByStatus(TestStatus status);
}
