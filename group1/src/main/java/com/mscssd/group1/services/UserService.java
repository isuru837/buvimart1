package com.mscssd.group1.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mscssd.group1.models.User;
import com.mscssd.group1.repositories.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = Objects.requireNonNull(userRepository, "User repository cannot be null");
        this.passwordEncoder = Objects.requireNonNull(passwordEncoder, "Password encoder cannot be null");
    }

    @Transactional
    public User createUser(User user) {
        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(User user) {
        // If password is being updated, hash the new password
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
        }
        return userRepository.save(user);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
} 