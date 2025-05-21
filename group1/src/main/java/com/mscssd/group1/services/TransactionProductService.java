package com.mscssd.group1.services;

import com.mscssd.group1.models.TransactionProduct;
import java.util.List;

public interface TransactionProductService {
    
    /**
     * Add a new transaction product
     * @param transactionProduct The transaction product to add
     * @return The saved transaction product
     */
    TransactionProduct addTransactionProduct(TransactionProduct transactionProduct);
    
    /**
     * Find all transaction products for a specific transaction
     * @param transactionId The ID of the transaction
     * @return List of transaction products
     */
    List<TransactionProduct> findTransactionProductByTransactionId(Long transactionId);
    
    /**
     * Find all transaction products for a specific product
     * @param productId The ID of the product
     * @return List of transaction products
     */
    List<TransactionProduct> findTransactionProductByProductId(Long productId);

    List<TransactionProduct> findByTransactionId(Long transactionId);
} 