package com.mscssd.group1.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class Encoder {
    
    /**
     * Encodes a password using SHA-256 algorithm and Base64 encoding
     * @param password The password to encode
     * @return The encoded password
     * @throws RuntimeException if encoding fails
     */
    public static String encodePassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error encoding password", e);
        }
    }

    /**
     * Verifies if a raw password matches an encoded password
     * @param rawPassword The raw password to check
     * @param encodedPassword The encoded password to compare against
     * @return true if the passwords match, false otherwise
     */
    public static boolean verifyPassword(String rawPassword, String encodedPassword) {
        String encodedRawPassword = encodePassword(rawPassword);
        return encodedRawPassword.equals(encodedPassword);
    }
} 