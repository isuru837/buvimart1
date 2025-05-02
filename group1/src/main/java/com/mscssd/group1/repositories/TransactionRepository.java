package com.mscssd.group1.repositories;

import com.mscssd.group1.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Find all non-deleted transactions
    List<Transaction> findByDeletedFalse();
    
    // Find transaction by ID (including deleted ones)
    Optional<Transaction> findByTransactionId(Long transactionId);
    
    // Find all transactions for a specific customer
    List<Transaction> findByCustomerUserIdAndDeletedFalse(Long userId);
    
    // Custom add transaction method
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.deleted = false WHERE t.transactionId = :id")
    void addTransaction(@Param("id") Long id);
    
    // Soft delete method
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.deleted = true WHERE t.transactionId = :id")
    void deleteTransaction(@Param("id") Long id);
} 