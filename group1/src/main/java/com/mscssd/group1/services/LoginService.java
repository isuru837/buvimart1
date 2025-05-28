package com.mscssd.group1.services;

import com.mscssd.group1.dtos.CredentialDto;
import com.mscssd.group1.dtos.LoginSessionDto;

public interface LoginService {
    /**
     * Authenticates user credentials and returns login session information
     * @param credentials User credentials containing username and password
     * @return LoginSessionDto containing user information and tokens if authentication is successful
     * @throws RuntimeException if authentication fails
     */
    LoginSessionDto login(CredentialDto credentials);

   
} 