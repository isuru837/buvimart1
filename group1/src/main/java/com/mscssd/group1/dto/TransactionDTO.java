package com.mscssd.group1.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TransactionDTO {
    private Long transactionId;
    private LocalDateTime transactionDate;
    private Long customerId;
    private String customerName;
    private List<TransactionProductDTO> products;

    public TransactionDTO() {
    }

    public TransactionDTO(Long transactionId, LocalDateTime transactionDate, Long customerId, String customerName, List<TransactionProductDTO> products) {
        this.transactionId = transactionId;
        this.transactionDate = transactionDate;
        this.customerId = customerId;
        this.customerName = customerName;
        this.products = products;
    }

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

    public List<TransactionProductDTO> getProducts() {
        return products;
    }

    public void setProducts(List<TransactionProductDTO> products) {
        this.products = products;
    }
} 