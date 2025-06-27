package com.mscssd.group1.services.impl;

import com.mscssd.group1.dtos.ProductDetailDto;
import com.mscssd.group1.dtos.TransactionProductDto;
import com.mscssd.group1.models.Product;
import com.mscssd.group1.models.Transaction;
import com.mscssd.group1.models.TransactionProduct;
import com.mscssd.group1.models.User;
import com.mscssd.group1.repositories.ProductRepository;
import com.mscssd.group1.repositories.TransactionRepository;
import com.mscssd.group1.services.TransactionProductService;
import com.mscssd.group1.services.TransactionService;
import com.mscssd.group1.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("transactionService")
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionProductService transactionProductService;
    private final UserService userService;
    private final ProductRepository productRepository;

    @Autowired
    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            TransactionProductService transactionProductService,
            UserService userService,
            ProductRepository productRepository) {
        this.transactionRepository = Objects.requireNonNull(transactionRepository, "Transaction repository cannot be null");
        this.transactionProductService = Objects.requireNonNull(transactionProductService, "Transaction product service cannot be null");
        this.userService = Objects.requireNonNull(userService, "User service cannot be null");
        this.productRepository = Objects.requireNonNull(productRepository, "Product repository cannot be null");
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
        List<Transaction> transactions = transactionRepository.findByCustomerUserIdAndDeletedFalse(userId);
       
        return transactions;
    }

    @Override
    public List<Transaction> findByCustomerUserIdAndDeletedFalse(Long userId) {
        return findByCustomerUserId(userId);
    }

    @Override
    public List<Transaction> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByTransactionDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
    }

    @Override
    public List<Transaction> findByProductId(Long productId) {
        return transactionRepository.findByTransactionProductsProductId(productId);
    }

    @Override
    public List<Transaction> findTransactionsWithFilters(LocalDate startDate, LocalDate endDate, Long customerId, Long productId) {
        List<Transaction> transactions = transactionRepository.findByDeletedFalse();
        
        // Apply date filter if both dates are provided
        if (startDate != null && endDate != null) {
            transactions = transactions.stream()
                .filter(t -> !t.getTransactionDate().toLocalDate().isBefore(startDate) 
                    && !t.getTransactionDate().toLocalDate().isAfter(endDate))
                .collect(Collectors.toList());
        }
        
        // Apply customer filter if provided
        if (customerId != null) {
            transactions = transactions.stream()
                .filter(t -> t.getCustomer().getUserId().equals(customerId))
                .collect(Collectors.toList());
        }
        
        // Apply product filter if provided
        if (productId != null) {
            transactions = transactions.stream()
                .filter(t -> t.getTransactionProducts().stream()
                    .anyMatch(tp -> tp.getProduct().getId().equals(productId)))
                .collect(Collectors.toList());
        }
        
        return transactions;
    }

    @Override
    @Transactional
    public TransactionProductDto saveTransactionWithProducts(TransactionProductDto transactionDto) {
        // Create and save the transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionDate(transactionDto.getTransactionDate());
        transaction.setTransactionValue(transactionDto.getTransactionValue());
        
        
        // Set customer
        User customer = userService.findById(transactionDto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + transactionDto.getCustomerId()));
        transaction.setCustomer(customer);
        
        // Save transaction
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Create and save transaction products
        List<TransactionProduct> savedProducts = new ArrayList<>();
        
            for (ProductDetailDto productDto : transactionDto.getProducts()) {
                TransactionProduct transactionProduct = new TransactionProduct();
                Product product = new Product();
                product.setId(productDto.getProductId());
                transactionProduct.setProduct(product);
                transactionProduct.setTransaction(savedTransaction);
                transactionProduct.setQuantity(productDto.getQuantity());
                transactionProduct.setPriceAtTransaction(productDto.getPriceAtTransaction());
                
                // Save transaction product
                TransactionProduct savedProduct = transactionProductService.addTransactionProduct(transactionProduct);
                savedProducts.add(savedProduct);
                updateProductQuantity(productDto);
            }
      
        
        // Return the complete DTO
        return new TransactionProductDto(savedTransaction, savedProducts);
    }
    @SuppressWarnings("UPM_UNCALLED_PRIVATE_METHOD")
    private void updateProductQuantity(ProductDetailDto productDto) {
        Product product = productRepository.findById(productDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStockQuantity(product.getStockQuantity() - productDto.getQuantity());
        productRepository.save(product);
    }

    @Override
    public long countTransactions() {
        return transactionRepository.count();
    }

    @Override
    public double getTotalTransactionValue() {
        return transactionRepository.findByDeletedFalse().stream()
                .mapToDouble(Transaction::getTransactionValue)
                .sum();
    }
} 