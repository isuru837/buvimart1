package com.mscssd.group1.interceptors;

import com.mscssd.group1.exceptions.TokenExpiredException;
import com.mscssd.group1.util.TokenManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private TokenManager tokenManager;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Skip token verification for login and registration endpoints
        if (request.getRequestURI().contains("/api/auth/") || 
            request.getRequestURI().contains("/api/users/register")) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authorization token is required");
            return false;
        }

        // Remove "Bearer " prefix
        String token = authHeader.substring(7);

        try {
            tokenManager.verifyToken(token);
            return true;
        } catch (TokenExpiredException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token is expired");
            return false;
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return false;
        }
    }
} 