package com.mscssd.group1.dto;

public class CredentialDto {
    private String userName;
    private String password;

    // Default constructor
    public CredentialDto() {
    }

    // Parameterized constructor
    public CredentialDto(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    // Getter for userName
    public String getUserName() {
        return userName;
    }

    // Setter for userName
    public void setUserName(String userName) {
        this.userName = userName;
    }

    // Getter for password
    public String getPassword() {
        return password;
    }

    // Setter for password
    public void setPassword(String password) {
        this.password = password;
    }
} 