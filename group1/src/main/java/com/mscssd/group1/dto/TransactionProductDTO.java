package com.mscssd.group1.dto;

public class TransactionProductDTO {
    private Long transactionId;
    private Long productId;
    private String productName;

    public TransactionProductDTO() {
    }

    public TransactionProductDTO(Long transactionId, Long productId, String productName) {
        this.transactionId = transactionId;
        this.productId = productId;
        this.productName = productName;
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
} 