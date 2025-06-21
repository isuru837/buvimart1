package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.ProductDto;
import com.mscssd.group1.models.Product;
import com.mscssd.group1.services.ProductService;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    
    private final ProductService productService;
    private final RateLimiterRegistry rateLimiterRegistry;

    @Autowired
    public ProductController(ProductService productService, RateLimiterRegistry rateLimiterRegistry) {
        this.productService = productService;
        this.rateLimiterRegistry = rateLimiterRegistry;
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllProducts() {
        RateLimiter rateLimiter = rateLimiterRegistry.rateLimiter("productsRateLimiter");
        
        if (rateLimiter.acquirePermission()) {
            List<Product> products = productService.findAll();
            return ResponseEntity.ok(products);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Too many requests. Please try again after a minute.");
            return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.findById(id);
        return product.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody ProductDto productDto) {
        productDto.setActive(false);
        Product savedProduct = productService.save(productDto.toEntity());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto) {
        return productService.findById(id)
                .map(existingProduct -> {
                    Product product = productDto.toEntity();
                    product.setId(id);
                    return ResponseEntity.ok(productService.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        List<Product> products = productService.findAllNotDeleted();
        return ResponseEntity.ok(products);
    }
} 