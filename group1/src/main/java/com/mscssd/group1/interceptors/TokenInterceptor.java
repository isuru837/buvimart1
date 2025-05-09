package com.mscssd.group1.interceptors;

import com.mscssd.group1.util.TokenManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Missing or invalid Authorization header");
            return false;
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String refreshToken = request.getHeader("Refresh-Token");

        // Verify the token
        if (!tokenManager.verifyToken(token)) {
            // If token is invalid and refresh token is provided, try to refresh
            if (refreshToken != null && tokenManager.verifyToken(refreshToken)) {
                String username = tokenManager.getUsernameFromToken(refreshToken);
                String newToken = tokenManager.generateNewToken(username).getJwToken();
                response.setHeader("New-Access-Token", newToken);
                return true;
            }
            
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Invalid or expired token");
            return false;
        }

        return true;
    }
} 