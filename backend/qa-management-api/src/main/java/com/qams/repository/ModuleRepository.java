package com.qams.repository;

import com.qams.entity.Module;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<Module, Long> {

    List<Module> findByProjectId(Long projectId);
}
