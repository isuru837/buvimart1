package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.TransactionProductDto;
import com.mscssd.group1.dtos.TransactionDto;
import com.mscssd.group1.exceptions.TokenExpiredException;
import com.mscssd.group1.models.Transaction;
import com.mscssd.group1.models.TransactionProduct;
import com.mscssd.group1.services.TransactionService;
import com.mscssd.group1.services.TransactionProductService;
import com.mscssd.group1.util.TokenManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController extends BaseController {
    
    private final TransactionService transactionService;
    private final TransactionProductService transactionProductService;
    private final TokenManager tokenManager;
    
    @Autowired
    public TransactionController(
            @Qualifier("transactionService") TransactionService transactionService, 
            @Qualifier("transactionProductService") TransactionProductService transactionProductService,
            @Qualifier("tokenManager") TokenManager tokenManager) {
        // Create defensive copies of the services
        this.transactionService = Objects.requireNonNull(transactionService, "Transaction service cannot be null");
        this.transactionProductService = Objects.requireNonNull(transactionProductService, "Transaction product service cannot be null");
        this.tokenManager = Objects.requireNonNull(tokenManager, "Token manager cannot be null");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long productId) {
        try {
            List<Transaction> transactions = transactionService.findTransactionsWithFilters(startDate, endDate, customerId, productId);
            return ResponseEntity.ok(transactions);
        } catch (AccessDeniedException e) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied: Only administrators can view all transactions");
        }
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
    public ResponseEntity<?> getTransactionsByCustomer(@PathVariable Long userId, HttpServletRequest request) {
        // Get the token from the Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        try {
            // Extract the token and get the user ID
            String token = authHeader.substring(7);
            String userIdFromToken = tokenManager.extractUserId(token);
            
            if (userIdFromToken == null || !userIdFromToken.equals(userId.toString())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only view your own transactions");
            }

            List<Transaction> transactions = transactionService.findByCustomerUserId(userId);
            List<TransactionDto> transactionDtos = transactions.stream()
                .map(transaction -> {
                    List<TransactionProduct> products = transactionProductService.findByTransactionId(transaction.getTransactionId());
                    return new TransactionDto(transaction, products);
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(transactionDtos);
        } catch (TokenExpiredException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access token is expired");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('REG_USER')")
    public ResponseEntity<TransactionProductDto> createTransaction(@RequestBody TransactionProductDto transactionDto, HttpServletRequest request) {
        System.out.println(transactionDto);
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String token = authHeader.substring(7);
        String userIdFromToken = tokenManager.extractUserId(token);
        
        if (!userIdFromToken.equals(transactionDto.getCustomerId().toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        // Calculate total amount from products
        double totalAmount = transactionDto.getProducts().stream()
            .mapToDouble(product -> product.getPrice() * product.getQuantity())
            .sum();
        transactionDto.setTotalAmount(totalAmount);

        TransactionProductDto savedTransaction = transactionService.saveTransactionWithProducts(transactionDto);
        return ResponseEntity.ok(savedTransaction);
    }
} 