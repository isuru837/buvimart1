package com.mscssd.group1.services;

import com.mscssd.group1.models.Product;
import java.util.List;

public interface ProductService extends BaseService<Product, Long> {
    // Additional product-specific service methods can be added here
    List<Product> findAllNotDeleted();
    long countNotDeleted();
} 