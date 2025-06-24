package com.mscssd.group1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;

import com.mscssd.group1.dtos.UserDto;
import com.mscssd.group1.models.User;
import com.mscssd.group1.services.UserService;
import com.mscssd.group1.util.TokenManager;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController {
    
    private final UserService userService;
    private final TokenManager tokenManager;
    private final RateLimiterRegistry rateLimiterRegistry;

    @Autowired
    public UserController(UserService userService, TokenManager tokenManager, RateLimiterRegistry rateLimiterRegistry) {
        this.userService = userService;
        this.tokenManager = tokenManager;
        this.rateLimiterRegistry = rateLimiterRegistry;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody UserDto user) {
        RateLimiter rateLimiter = rateLimiterRegistry.rateLimiter("registerRateLimiter");
        
        try {
            if (rateLimiter.acquirePermission()) {
                User createdUser = userService.createUser(user.toEntity());
                return ResponseEntity.ok(createdUser);
            } else {
                return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many registration attempts. Please try again after an hour.");
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body("Too many registration attempts. Please try again after an hour.");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User user, HttpServletRequest request) {
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
        user.setUserId(Long.parseLong(userIdFromToken));
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllActiveUsers() {
        List<User> users = userService.getAllActiveUsers();
        List<UserDto> userDtos = users.stream()
            .map(user -> {
                UserDto dto = new UserDto(user);
                dto.setPassword(null); // Ensure password is not included
                return dto;
            })
            .toList();
        return ResponseEntity.ok(userDtos);
    }

    @PutMapping("/update-active-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserActiveStatus(@RequestBody UserDto userDto) {
        if (userDto.getUserId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
        }
        Optional<User> userOpt = userService.findById(userDto.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        user.setIsActive(userDto.isActive());
        System.out.println("@@@@@@@"+user.toString());
        userService.updateUser(user);
        return ResponseEntity.ok(Map.of("message", "User active status updated successfully"));
    }
} 