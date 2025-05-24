package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.CredentialDto;
import com.mscssd.group1.dtos.LoginSessionDto;
import com.mscssd.group1.exceptions.TokenExpiredException;
import com.mscssd.group1.models.Token;
import com.mscssd.group1.models.User;
import com.mscssd.group1.services.LoginService;
import com.mscssd.group1.services.UserService;
import com.mscssd.group1.util.TokenManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private TokenManager tokenManager;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginSessionDto> login(@RequestBody CredentialDto credentials) {
        LoginSessionDto loginSession = loginService.login(credentials);
        return ResponseEntity.ok(loginSession);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Refresh-Token") String refreshToken) {
        loginService.logout(refreshToken);
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Refresh-Token") String refreshToken) {
        try {
            // Verify the refresh token
            tokenManager.verifyToken(refreshToken);
            
            // Extract user info from refresh token
            String username = tokenManager.getUsernameFromToken(refreshToken);
            String role = tokenManager.extractRole(refreshToken);
            String userId = tokenManager.extractUserId(refreshToken);
            
            // Generate new tokens
            Token newTokens = tokenManager.generateNewToken(username, role, userId);
            
            // Get user and save new refresh token
            User user = userService.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
            tokenManager.saveRefreshToken(newTokens.getRefreshToken(), user);
            
            return ResponseEntity.ok(newTokens);
        } catch (TokenExpiredException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is expired");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
} 