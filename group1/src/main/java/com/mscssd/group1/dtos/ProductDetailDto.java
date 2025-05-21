package com.mscssd.group1.dtos;

import com.mscssd.group1.models.TransactionProduct;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProductDetailDto {
    private Long productId;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    @NotNull(message = "Price at transaction is required")
    @Positive(message = "Price at transaction must be positive")
    private Double priceAtTransaction;
    
    private Double totalPrice;
    
    public ProductDetailDto() {}
    
    public ProductDetailDto(TransactionProduct tp) {
        System.out.println("%%%%%%%%%%%%%%%%%%");
        System.out.println(tp.getProduct());
        this.productId = tp.getProduct() != null ? tp.getProduct().getId() : null;
        this.quantity = tp.getQuantity();
        this.priceAtTransaction = tp.getPriceAtTransaction();
        this.totalPrice = tp.getPriceAtTransaction() * tp.getQuantity();
    }
    
    // Getters and Setters
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Double getPriceAtTransaction() {
        return priceAtTransaction;
    }
    
    public void setPriceAtTransaction(Double priceAtTransaction) {
        this.priceAtTransaction = priceAtTransaction;
    }
    
    public Double getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("ProductDetailDto{")
          .append("productId=").append(productId)
          .append(", quantity=").append(quantity)
          .append(", priceAtTransaction=").append(priceAtTransaction)
          .append(", totalPrice=").append(totalPrice)
          .append('}');
        return sb.toString();
    }
} 