package com.qams.repository;

import com.qams.entity.TestPlan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestPlanRepository extends JpaRepository<TestPlan, Long> {

    List<TestPlan> findByProjectId(Long projectId);
}
