package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.TransactionProductDto;
import com.mscssd.group1.dtos.TransactionDto;
import com.mscssd.group1.models.Transaction;
import com.mscssd.group1.models.TransactionProduct;
import com.mscssd.group1.services.TransactionService;
import com.mscssd.group1.services.TransactionProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getAllTransactions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long productId) {
        
        List<Transaction> transactions = transactionService.findTransactionsWithFilters(startDate, endDate, customerId, productId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.findById(id);
        return transaction.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{userId}")
    @PreAuthorize("hasRole('REG_USER')")
    public ResponseEntity<List<TransactionDto>> getTransactionsByCustomer(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.findByCustomerUserId(userId);
        List<TransactionDto> transactionDtos = transactions.stream()
            .map(transaction -> {
                List<TransactionProduct> products = transactionProductService.findByTransactionId(transaction.getTransactionId());
                return new TransactionDto(transaction, products);
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDtos);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('REG_USER')")
    public ResponseEntity<TransactionProductDto> createTransaction(@RequestBody TransactionProductDto transactionDto) {
        TransactionProductDto savedTransaction = transactionService.saveTransactionWithProducts(transactionDto);
        return ResponseEntity.ok(savedTransaction);
    }
} 