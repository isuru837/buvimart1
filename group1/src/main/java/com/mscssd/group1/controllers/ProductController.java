package com.mscssd.group1.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mscssd.group1.services.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController extends BaseController {
    
    @GetMapping
    public String getAllProducts() {
       
        return "List of all products";
    }
    
    @GetMapping("/{id}")
    public String getProductById() {
        return "Product details";
    }
} 