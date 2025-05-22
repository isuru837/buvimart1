package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.TransactionProductDto;
import com.mscssd.group1.dtos.TransactionDto;
import com.mscssd.group1.models.Transaction;
import com.mscssd.group1.models.TransactionProduct;
import com.mscssd.group1.services.TransactionService;
import com.mscssd.group1.services.TransactionProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController extends BaseController {
    @Autowired
     TransactionService transactionService;
    @Autowired
    TransactionProductService transactionProductService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.findAll();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.findById(id);
        return transaction.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{userId}")
    public ResponseEntity<List<TransactionDto>> getTransactionsByCustomer(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.findByCustomerUserId(userId);
        List<TransactionDto> transactionDtos = transactions.stream()
            .map(transaction -> {
                List<TransactionProduct> products = transactionProductService.findByTransactionId(transaction.getTransactionId());
                System.out.println("####################");
                System.out.println(products);
                return new TransactionDto(transaction, products);
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDtos);
    }

    @PostMapping("/create")
    public ResponseEntity<TransactionProductDto> createTransaction(@RequestBody TransactionProductDto transactionDto) {
        TransactionProductDto savedTransaction = transactionService.saveTransactionWithProducts(transactionDto);
        return ResponseEntity.ok(savedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 