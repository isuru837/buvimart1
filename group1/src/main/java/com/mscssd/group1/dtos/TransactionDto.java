package com.mscssd.group1.dtos;

import com.mscssd.group1.models.Transaction;
import com.mscssd.group1.models.TransactionProduct;
import com.mscssd.group1.models.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TransactionDto {
    private Long transactionId;
    
    @NotNull(message = "Transaction date is required")
    @PastOrPresent(message = "Transaction date cannot be in the future")
    private LocalDateTime transactionDate;
    
    @NotNull(message = "Transaction value is required")
    @Positive(message = "Transaction value must be positive")
    private Double transactionValue;
    
    private Long customerId;
    private String customerName;
    private List<ProductDetailDto> products;
    
    // Default constructor
    public TransactionDto() {
        this.products = new ArrayList<>();
    }
    
    // Constructor from Transaction and List<TransactionProduct>
    public TransactionDto(Transaction transaction, List<TransactionProduct> transactionProducts) {
        this.transactionId = transaction.getTransactionId();
        this.transactionDate = transaction.getTransactionDate();
        this.transactionValue = transaction.getTransactionValue();
        
        User customer = transaction.getCustomer();
        System.out.println("Customer in TransactionDto: " + customer);
        this.customerId = customer != null ? customer.getUserId() : null;
        this.customerName = customer != null ? customer.getUserName() : null;
        
        this.products = new ArrayList<>();
        
        if (transactionProducts != null) {
            for (TransactionProduct tp : transactionProducts) {
                this.products.add(new ProductDetailDto(tp));
            }
        }
    }
    
    // Getters and Setters
    public Long getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }
    
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public Double getTransactionValue() {
        return transactionValue;
    }
    
    public void setTransactionValue(Double transactionValue) {
        this.transactionValue = transactionValue;
    }
    
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public List<ProductDetailDto> getProducts() {
        return new ArrayList<>(products);
    }
    
    public void setProducts(List<ProductDetailDto> products) {
        this.products = new ArrayList<>(products);
    }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("TransactionDto{")
          .append("transactionId=").append(transactionId)
          .append(", transactionDate=").append(transactionDate)
          .append(", transactionValue=").append(transactionValue)
          .append(", customerId=").append(customerId)
          .append(", customerName='").append(customerName).append('\'')
          .append(", products=").append(products)
          .append('}');
        return sb.toString();
    }
} 