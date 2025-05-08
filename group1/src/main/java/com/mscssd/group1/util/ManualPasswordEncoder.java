package com.mscssd.group1.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class ManualPasswordEncoder {
    
    public static void main(String[] args) {
      

        String rawPassword = "123456";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(rawPassword);
        
        System.out.println("Original Password: " + rawPassword);
        System.out.println("Encoded Password: " + encodedPassword);
        System.out.println("\nTo verify this password later, use:");
        System.out.println("boolean matches = encoder.matches(\"" + rawPassword + "\", \"" + encodedPassword + "\");");
    }
} 