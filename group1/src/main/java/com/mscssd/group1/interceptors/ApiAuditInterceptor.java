package com.mscssd.group1.interceptors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mscssd.group1.services.ApiAuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

@Component
public class ApiAuditInterceptor implements HandlerInterceptor {

    @Autowired
    private ApiAuditService apiAuditService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Wrap the request to make it readable multiple times
        if (!(request instanceof ContentCachingRequestWrapper)) {
            return true;
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            String username = "anonymous";
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                username = authentication.getName();
            }

            // Get response body from ContentCachingResponseWrapper
            String responseBody = "";
            if (response instanceof ContentCachingResponseWrapper) {
                ContentCachingResponseWrapper responseWrapper = (ContentCachingResponseWrapper) response;
                byte[] contentAsByteArray = responseWrapper.getContentAsByteArray();
                if (contentAsByteArray.length > 0) {
                    responseBody = new String(contentAsByteArray, java.nio.charset.StandardCharsets.UTF_8);
                }
            }

            // Create ResponseEntity with the actual response body
            ResponseEntity<?> responseEntity = ResponseEntity
                .status(response.getStatus())
                .body(responseBody.isEmpty() ? null : objectMapper.readValue(responseBody, Object.class));

            apiAuditService.logApiCall(request, responseEntity, username);
        } catch (Exception e) {
            // Log the error but don't throw it
            e.printStackTrace();
        }
    }
    public String getRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line);
        }
        return stringBuilder.toString();
    }
} 