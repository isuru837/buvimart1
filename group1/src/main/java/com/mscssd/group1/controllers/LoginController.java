package com.mscssd.group1.controllers;

import com.mscssd.group1.dtos.CredentialDto;
import com.mscssd.group1.dtos.LoginSessionDto;
import com.mscssd.group1.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<LoginSessionDto> login(@RequestBody CredentialDto credentials) {
        LoginSessionDto loginSession = loginService.login(credentials);
        return ResponseEntity.ok(loginSession);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Refresh-Token") String refreshToken) {
        loginService.logout(refreshToken);
        return ResponseEntity.ok("Logged out successfully");
    }

   
} 