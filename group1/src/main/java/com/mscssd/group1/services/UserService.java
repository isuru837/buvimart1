package com.mscssd.group1.services;

import java.util.Objects;
import java.util.Optional;

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
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(User user) {
        // If password is being updated, hash the new password
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String hashedPassword = Encoder.encodePassword(user.getPassword());
            user.setPassword(hashedPassword);
        }
        return userRepository.save(user);
    }

   

    /**
     * Find a user by username and password
     * @param userName the username to search for
     * @param password the raw password to validate
     * @return Optional containing the user if found and password matches, empty otherwise
     */
    public Optional<User> findUserByUserNameAndPassword(String userName, String password) {
        System.out.println("Finding user by username and password: " + userName + " " + password);
       
        Optional<User> userOpt = userRepository.findUserByUserName(userName);
        System.out.println("User found: " + userOpt.isPresent());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify the password matches
            if (password.equals(user.getPassword())) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }
} 