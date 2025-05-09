package com.mscssd.group1.dto;

import com.mscssd.group1.models.User;
import com.mscssd.group1.models.Token;

public class LoginSessionDto {
    private User user;
    private Token token;
    private String loginTime;

    // Default constructor
    public LoginSessionDto() {
    }

    // Parameterized constructor
    public LoginSessionDto(User user, Token token, String loginTime) {
        this.user = new User(user);     // Copy
        this.token = new Token(token);  // Copy
        this.loginTime = loginTime;
    }

    // Getters
    public User getUser() {
        return new User(user);
    }

    public Token getToken() {
        return new Token(token);
    }

    public String getLoginTime() {
        return loginTime;
    }

    // Setters
    public void setUser(User user) {
        this.user = new User(user);
    }

    public void setToken(Token token) {
        this.token = new Token(token);
    }

    public void setLoginTime(String loginTime) {
        this.loginTime = loginTime;
    }
} 