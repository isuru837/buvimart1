package com.mscssd.group1.repositories;

import com.mscssd.group1.models.TransactionProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionProductRepository extends JpaRepository<TransactionProduct, Long> {
    
    /**
     * Find all transaction products for a specific transaction
     * @param transactionId The ID of the transaction
     * @return List of transaction products
     */
    List<TransactionProduct> findByTransactionTransactionId(Long transactionId);
    
    /**
     * Find all transaction products for a specific product
     * @param productId The ID of the product
     * @return List of transaction products
     */
    List<TransactionProduct> findByProductId(Long productId);
    
    /**
     * Find all non-deleted transaction products for a specific transaction
     * @param transactionId The ID of the transaction
     * @return List of non-deleted transaction products
     */
    List<TransactionProduct> findByTransactionTransactionIdAndDeletedFalse(Long transactionId);
    
    /**
     * Find all non-deleted transaction products for a specific product
     * @param productId The ID of the product
     * @return List of non-deleted transaction products
     */
    List<TransactionProduct> findByProductIdAndDeletedFalse(Long productId);
} 