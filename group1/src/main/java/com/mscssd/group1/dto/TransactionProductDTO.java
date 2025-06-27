package com.mscssd.group1.dto;

public class TransactionProductDTO {
    private Long transactionId;
    private Long productId;
    private String productName;
    private Double transactionItemValue;
    private Integer quantity;
    private Double unitPrice;

    public TransactionProductDTO() {
    }

    public TransactionProductDTO(Long transactionId, Long productId, String productName, Double priceAtTransaction, Integer quantity) {
        this.transactionId = transactionId;
        this.productId = productId;
        this.productName = productName;
        this.transactionItemValue = priceAtTransaction != null && quantity != null ? priceAtTransaction * quantity : null;
        this.quantity = quantity;
        this.unitPrice = priceAtTransaction;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getTransactionItemValue() {
        return transactionItemValue;
    }

    public void setTransactionItemValue(Double transactionItemValue) {
        this.transactionItemValue = transactionItemValue;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }
} 