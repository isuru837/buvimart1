package com.mscssd.group1.services;

import com.mscssd.group1.dtos.TransactionProductDto;
import com.mscssd.group1.models.Transaction;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionService extends BaseService<Transaction, Long> {
    List<Transaction> findAll();
    Optional<Transaction> findById(Long id);
    Transaction save(Transaction transaction);
    void deleteById(Long id);
    List<Transaction> findByCustomerUserId(Long userId);
    List<Transaction> findByCustomerUserIdAndDeletedFalse(Long userId);
    TransactionProductDto saveTransactionWithProducts(TransactionProductDto transactionDto);
    List<Transaction> findByDateRange(LocalDate startDate, LocalDate endDate);
    List<Transaction> findByProductId(Long productId);
    List<Transaction> findTransactionsWithFilters(LocalDate startDate, LocalDate endDate, Long customerId, Long productId);
    long countTransactions();
    double getTotalTransactionValue();
} 