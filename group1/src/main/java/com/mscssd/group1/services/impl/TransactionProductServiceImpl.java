package com.mscssd.group1.services.impl;

import com.mscssd.group1.models.TransactionProduct;
import com.mscssd.group1.repositories.TransactionProductRepository;
import com.mscssd.group1.services.TransactionProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionProductServiceImpl implements TransactionProductService {

    private TransactionProductRepository transactionProductRepository = null;
    
        @Autowired
        public void TransactionProductService(TransactionProductRepository transactionProductRepository) {
            this.transactionProductRepository = transactionProductRepository;
    }

    /**
     * Add a new transaction product
     * @param transactionProduct The transaction product to add
     * @return The saved transaction product
     */
    public TransactionProduct addTransactionProduct(TransactionProduct transactionProduct) {
        if (transactionProduct == null) {
            throw new IllegalArgumentException("Transaction product cannot be null");
        }
        return transactionProductRepository.save(transactionProduct);
    }

    /**
     * Find all transaction products for a specific transaction
     * @param transactionId The ID of the transaction
     * @return List of transaction products
     */
    public List<TransactionProduct> findTransactionProductByTransactionId(Long transactionId) {
        if (transactionId == null) {
            throw new IllegalArgumentException("Transaction ID cannot be null");
        }
        return transactionProductRepository.findByTransactionTransactionIdAndDeletedFalse(transactionId);
    }

    /**
     * Find all transaction products for a specific product
     * @param productId The ID of the product
     * @return List of transaction products
     */
    public List<TransactionProduct> findTransactionProductByProductId(Long productId) {
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        return transactionProductRepository.findByProductIdAndDeletedFalse(productId);
    }

    /**
     * Soft delete a transaction product
     * @param id The ID of the transaction product to delete
     */
    public void deleteTransactionProduct(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        TransactionProduct transactionProduct = transactionProductRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction product not found with ID: " + id));
        transactionProduct.setDeleted(true);
        transactionProductRepository.save(transactionProduct);
    }

    /**
     * Get a transaction product by ID
     * @param id The ID of the transaction product
     * @return The transaction product
     */
    public TransactionProduct getTransactionProductById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return transactionProductRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction product not found with ID: " + id));
    }
} 