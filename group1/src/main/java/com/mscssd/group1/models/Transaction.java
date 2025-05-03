package com.mscssd.group1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @NotNull(message = "Transaction date is required")
    @PastOrPresent(message = "Transaction date cannot be in the future")
    private LocalDateTime transactionDate;

    @NotNull(message = "Transaction value is required")
    @Positive(message = "Transaction value must be positive")
    private Double transactionValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    // Getters
    public Long getTransactionId() {
        return transactionId;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public Double getTransactionValue() {
        return transactionValue;
    }

    public User getCustomer() {
        return new User(customer);
    }

    public boolean isDeleted() {
        return deleted;
    }

    // Setters
    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public void setTransactionValue(Double transactionValue) {
        this.transactionValue = transactionValue;
    }

    public void setCustomer(User customer) {
        this.customer = new User(customer);
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    // Copy constructor
    public Transaction(Transaction other) {
        this.transactionId = other.transactionId;
        this.transactionDate = other.transactionDate;
        this.transactionValue = other.transactionValue;
        this.customer = new User(other.customer);
        this.deleted = other.deleted;
    }
} 