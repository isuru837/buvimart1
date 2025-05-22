package com.mscssd.group1.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "transaction_products")
public class TransactionProduct {
    public TransactionProduct() {
       
    }
    public TransactionProduct(Product product, Transaction transaction) {
        this.product = new Product(product);
        this.transaction = new Transaction(transaction);
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Price at time of transaction is required")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    private Double priceAtTransaction;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    // Getters
    public Long getId() {
        return id;
    }

    public Transaction getTransaction() {
        return new Transaction(transaction);
    }

    public Product getProduct() {
        return new Product(product);
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getPriceAtTransaction() {
        return priceAtTransaction;
    }

    public boolean isDeleted() {
        return deleted;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = new Transaction(transaction);
    }

    public void setProduct(Product product) {
        this.product = new Product(product);
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setPriceAtTransaction(Double priceAtTransaction) {
        this.priceAtTransaction = priceAtTransaction;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("TransactionProduct{")
          .append("id=").append(id)
          .append(", transactionId=").append(this.transaction.getTransactionId())
          .append(", productId=").append(this.product.getId())
          .append(", quantity=").append(quantity)
          .append(", priceAtTransaction=").append(priceAtTransaction)
          .append(", deleted=").append(deleted)
          .append('}');
        return sb.toString();
    }
} 