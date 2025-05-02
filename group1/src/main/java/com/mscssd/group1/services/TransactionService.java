package com.mscssd.group1.services;

import com.mscssd.group1.models.Transaction;
import java.util.List;

public interface TransactionService extends BaseService<Transaction, Long> {
    List<Transaction> findByCustomerUserId(Long userId);
    List<Transaction> findByCustomerUserIdAndDeletedFalse(Long userId);
} 