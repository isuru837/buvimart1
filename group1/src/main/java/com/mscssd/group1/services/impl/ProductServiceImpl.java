package com.mscssd.group1.services.impl;

import com.mscssd.group1.models.Product;
import com.mscssd.group1.repositories.ProductRepository;
import com.mscssd.group1.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = Objects.requireNonNull(productRepository,"Transaction repository cannot be null");
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findByDeletedFalseAndActiveTrue();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id)
                .filter(product -> !product.isDeleted());
    }

    @Override
    @Transactional
    public Product save(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        productRepository.deleteProduct(id);
    }

    @Override
    public List<Product> findAllNotDeleted() {
        return productRepository.findByDeletedFalse();
    }
} 