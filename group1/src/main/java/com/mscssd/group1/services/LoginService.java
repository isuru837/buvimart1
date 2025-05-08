package com.mscssd.group1.services;

import com.mscssd.group1.dto.CredentialDto;
import com.mscssd.group1.models.Token;

public interface LoginService {
    /**
     * Authenticates user credentials and returns tokens
     * @param credentials User credentials containing username and password
     * @return Token containing JWT and refresh tokens if authentication is successful
     * @throws RuntimeException if authentication fails
     */
    Token login(CredentialDto credentials);
} 