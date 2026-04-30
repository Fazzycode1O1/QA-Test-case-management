package com.qams.repository;

import com.qams.entity.TestExecution;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestExecutionRepository extends JpaRepository<TestExecution, Long> {

    List<TestExecution> findByTestCaseId(Long testCaseId);
}
