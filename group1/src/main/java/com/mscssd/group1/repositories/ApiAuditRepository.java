package com.mscssd.group1.repositories;

import com.mscssd.group1.models.ApiAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiAuditRepository extends JpaRepository<ApiAudit, Long> {
} 