package com.mscssd.group1.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordHashing {
    private final BCryptPasswordEncoder encoder;

    public PasswordHashing() {
        this.encoder = new BCryptPasswordEncoder();
    }

    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
} 