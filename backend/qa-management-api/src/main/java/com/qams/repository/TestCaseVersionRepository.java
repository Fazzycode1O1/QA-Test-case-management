package com.qams.repository;

import com.qams.entity.TestCaseVersion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestCaseVersionRepository extends JpaRepository<TestCaseVersion, Long> {

    List<TestCaseVersion> findByTestCaseIdOrderByVersionNumberDesc(Long testCaseId);

    long countByTestCaseId(Long testCaseId);
}
