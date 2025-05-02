package com.mscssd.group1.services.impl;

import com.mscssd.group1.models.Transaction;
import com.mscssd.group1.repositories.TransactionRepository;
import com.mscssd.group1.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<Transaction> findAll() {
        return transactionRepository.findByDeletedFalse();
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return transactionRepository.findByTransactionId(id);
    }

    @Override
    @Transactional
    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        transactionRepository.deleteTransaction(id);
    }

    @Override
    public List<Transaction> findByCustomerUserId(Long userId) {
        return transactionRepository.findByCustomerUserIdAndDeletedFalse(userId);
    }

    @Override
    public List<Transaction> findByCustomerUserIdAndDeletedFalse(Long userId) {
        return transactionRepository.findByCustomerUserIdAndDeletedFalse(userId);
    }
} 