package com.mscssd.group1.services.impl;

import com.mscssd.group1.dtos.CredentialDto;
import com.mscssd.group1.dtos.LoginSessionDto;
import com.mscssd.group1.models.Token;
import com.mscssd.group1.models.User;
import com.mscssd.group1.services.LoginService;
import com.mscssd.group1.services.UserService;
import com.mscssd.group1.util.Encoder;
import com.mscssd.group1.util.MessageConstant;
import com.mscssd.group1.util.TokenManager;
import com.mscssd.group1.exceptions.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenManager tokenManager;

    @Override
    public LoginSessionDto login(CredentialDto credentials) {
        // Validate user credentials
        Optional<User> userOpt = userService.findByUserNameAndPassword(
            credentials.getUserName(),
            Encoder.encodePassword(credentials.getPassword())
        );

        if (userOpt.isPresent()) {
            // User is authenticated, generate tokens
            User authenticatedUser = userOpt.get();
            // Check if user is active
            if (!authenticatedUser.isActive()) {
                throw new AuthenticationException(MessageConstant.USER_INACTIVE);
            }
            
            System.out.println("Role Of User : "+authenticatedUser.getRole().name());
            Token tokens = tokenManager.generateNewToken(authenticatedUser.getUserName(),authenticatedUser.getRole().name(),authenticatedUser.getUserId().toString());
            
            authenticatedUser.setPassword("");
            // Create login session with current timestamp
            String loginTime = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
            return new LoginSessionDto(authenticatedUser, tokens, loginTime);
        } else {
            throw new AuthenticationException(MessageConstant.INVALID_USERNAME_OR_PASSWORD);
        }
    }

} 