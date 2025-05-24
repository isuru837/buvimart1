package com.mscssd.group1.models;

public class Token {
    private String jwToken;
    private String refreshToken;

    // Default constructor
    public Token() {
    }

    // Parameterized constructor
    public Token(String jwToken, String refreshToken) {
        this.jwToken = jwToken;
        this.refreshToken = refreshToken;
    }

    // Copy constructor
    public Token(Token token) {
        if (token != null) {
            this.jwToken = token.jwToken;
            this.refreshToken = token.refreshToken;
        }
    }

    // Getter for jwToken
    public String getJwToken() {
        return jwToken;
    }

    // Setter for jwToken
    public void setJwToken(String jwToken) {
        this.jwToken = jwToken;
    }

    // Getter for refreshToken
    public String getRefreshToken() {
        return refreshToken;
    }

    // Setter for refreshToken
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
} 