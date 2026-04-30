package com.qams.repository;

import com.qams.entity.TestSuite;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestSuiteRepository extends JpaRepository<TestSuite, Long> {

    List<TestSuite> findByProjectId(Long projectId);
}
