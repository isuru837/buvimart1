package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.CredentialDto;
import com.mscssd.group1.dtos.LoginSessionDto;
import com.mscssd.group1.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CredentialDto credentials) {
        try {
            LoginSessionDto loginSession = loginService.login(credentials);
            return ResponseEntity.ok(loginSession);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Authentication failed: " + e.getMessage());
        }
    }
} 