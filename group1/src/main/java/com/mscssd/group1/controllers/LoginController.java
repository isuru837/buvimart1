package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.CredentialDto;
import com.mscssd.group1.dtos.LoginSessionDto;
import com.mscssd.group1.exceptions.AuthenticationException;
import com.mscssd.group1.services.LoginService;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import jakarta.security.auth.message.AuthException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private RateLimiterRegistry rateLimiterRegistry;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CredentialDto credentials) {
        RateLimiter rateLimiter = rateLimiterRegistry.rateLimiter("loginRateLimiter");
        
        try {
            // Try to acquire a permit from the rate limiter
            if (rateLimiter.acquirePermission()) {
                try {
                    LoginSessionDto loginSession = loginService.login(credentials);
                    return ResponseEntity.ok(loginSession);
                } catch (AuthenticationException e) {
                    return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", e.getMessage()));
                }
            } else {
                return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many failed login attempts. Please try again after 1 minute.");
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body("Too many failed login attempts. Please try again after 1 minute.");
        }
    }
} 