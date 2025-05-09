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
        this.user = user;
        this.token = token;
        this.loginTime = loginTime;
    }

    // Getters
    public User getUser() {
        return user;
    }

    public Token getToken() {
        return token;
    }

    public String getLoginTime() {
        return loginTime;
    }

    // Setters
    public void setUser(User user) {
        this.user = user;
    }

    public void setToken(Token token) {
        this.token = token;
    }

    public void setLoginTime(String loginTime) {
        this.loginTime = loginTime;
    }
} 