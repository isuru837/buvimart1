package com.mscssd.group1.services.impl;

import com.mscssd.group1.dto.CredentialDto;
import com.mscssd.group1.models.Token;
import com.mscssd.group1.models.User;
import com.mscssd.group1.services.LoginService;
import com.mscssd.group1.services.UserService;
import com.mscssd.group1.util.TokenManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenManager tokenManager;

    @Override
    public Token login(CredentialDto credentials) {
        // Validate user credentials
        Optional<User> userOpt = userService.findUserByUserNameAndPassword(
            credentials.getUserName(),
            encodePassword(credentials.getPassword())
        );

        if (userOpt.isPresent()) {
            // User is authenticated, generate tokens
            User authenticatedUser = userOpt.get();
            return tokenManager.generateNewToken(authenticatedUser.getUserName());
        } else {
            throw new RuntimeException("Invalid username or password");
        }
    }

    private String encodePassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            System.out.println("Encoded password: " + Base64.getEncoder().encodeToString(hash));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error encoding password", e);
        }
    }
} 