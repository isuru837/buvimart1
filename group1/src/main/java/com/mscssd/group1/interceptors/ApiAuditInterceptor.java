package com.mscssd.group1.interceptors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mscssd.group1.services.ApiAuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.BufferedReader;
import java.io.IOException;

@Component
public class ApiAuditInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(ApiAuditInterceptor.class);

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
            Object body;
            try {
                // Try to parse as JSON first
                body = responseBody.isEmpty() ? null : objectMapper.readValue(responseBody, Object.class);
            } catch (IOException e) {
                // If JSON parsing fails, use the raw string
                body = responseBody;
            }

            ResponseEntity<?> responseEntity = ResponseEntity
                .status(response.getStatus())
                .body(body);

            apiAuditService.logApiCall(request, responseEntity, username);
        } catch (Exception e) {
            logger.error("Unexpected error during API audit", e);
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