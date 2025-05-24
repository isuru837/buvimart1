package com.mscssd.group1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;

import com.mscssd.group1.dtos.UserDto;
import com.mscssd.group1.models.User;
import com.mscssd.group1.services.UserService;
import com.mscssd.group1.util.TokenManager;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController {
    
    private final UserService userService;
    private final TokenManager tokenManager;

    @Autowired
    public UserController(UserService userService, TokenManager tokenManager) {
        this.userService = userService;
        this.tokenManager = tokenManager;
    }

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody UserDto user) {
        System.out.println("registering users "+user.toString());
        User createdUser = userService.createUser(user.toEntity());
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('REG_USER')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user, HttpServletRequest request) {
        // Get the current authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // Get the token from the Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        // Extract the token and get the user ID
        String token = authHeader.substring(7);
        String userIdFromToken = tokenManager.extractUserId(token);
        
        if (userIdFromToken == null || !userIdFromToken.equals(id.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own profile");
        }

        user.setUserId(id);
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }
} 