package com.mscssd.group1.repositories;

import com.mscssd.group1.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Product> findByStockQuantityGreaterThan(Integer quantity);
    List<Product> findAll();
    // Find only non-deleted products
    List<Product> findByDeletedFalse();
    
    // Custom add product method
    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.deleted = false WHERE p.id = :id")
    void addProduct(@Param("id") Long id);
    
    // Custom update product method
    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.name = :name, p.description = :description, " +
           "p.price = :price, p.stockQuantity = :stockQuantity WHERE p.id = :id")
    void updateProduct(@Param("id") Long id, 
                      @Param("name") String name,
                      @Param("description") String description,
                      @Param("price") Double price,
                      @Param("stockQuantity") Integer stockQuantity);
    
    // Soft delete method
    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.deleted = true WHERE p.id = :id")
    void deleteProduct(@Param("id") Long id);
} 