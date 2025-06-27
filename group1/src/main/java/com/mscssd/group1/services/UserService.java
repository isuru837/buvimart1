package com.mscssd.group1.services;

import java.util.Objects;
import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mscssd.group1.models.User;
import com.mscssd.group1.repositories.UserRepository;
import com.mscssd.group1.util.Encoder;

@Service
public class UserService {
    
    private final UserRepository userRepository;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = Objects.requireNonNull(userRepository, "User repository cannot be null");

    }

    @Transactional
    public User createUser(User user) {
        // Hash the password before saving
        String hashedPassword = Encoder.encodePassword(user.getPassword());
        user.setPassword(hashedPassword);
        System.out.println("############# : "+user);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(User user) {
        // Get the existing user to preserve the password
        User existingUser = userRepository.findById(user.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Preserve the existing password
        user.setPassword(existingUser.getPassword());
        
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Find a user by username and password
     * @param userName the username to search for
     * @param password the raw password to validate
     * @return Optional containing the user if found and password matches, empty otherwise
     */
    public Optional<User> findByUserNameAndPassword(String userName, String password) {
        Optional<User> userOpt = userRepository.findByUserNameAndPassword(userName, password);
        return userOpt;
    }

    public List<User> getAllActiveUsers() {
        return userRepository.findAllActive();
    }

    public long countUsers() {
        return userRepository.count();
    }
} 