package com.mscssd.group1.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.mscssd.group1.models.ApiAudit;
import com.mscssd.group1.repositories.ApiAuditRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.ContentCachingRequestWrapper;
import java.nio.charset.StandardCharsets;

@Service
public class ApiAuditService {

    @Autowired
    private ApiAuditRepository apiAuditRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public void logApiCall(HttpServletRequest request, ResponseEntity<?> response, String username) {
        ApiAudit audit = new ApiAudit();
        audit.setEndpoint(request.getRequestURI());
        audit.setMethod(request.getMethod());
        audit.setUserName(username);
        audit.setStatusCode(response.getStatusCode().value());
       
        // Get request body
        String requestBody = "";
        if (request instanceof ContentCachingRequestWrapper) {
            ContentCachingRequestWrapper requestWrapper = (ContentCachingRequestWrapper) request;
            byte[] contentAsByteArray = requestWrapper.getContentAsByteArray();
            if (contentAsByteArray.length > 0) {
                requestBody = new String(contentAsByteArray, StandardCharsets.UTF_8);
            }
        } else {
            // If it's not a ContentCachingRequestWrapper, we can't safely read the body
            // as it might have already been consumed
            requestBody = "[Request body not available - request already consumed]";
        }
        audit.setRequestBody(requestBody);
       
        // Get response body
        String responseBody = "";
        if (response.getBody() != null) {
            try {
                // If the body is already a string, use it directly
                if (response.getBody() instanceof String) {
                    responseBody = (String) response.getBody();
                } else {
                    responseBody = objectMapper.writeValueAsString(response.getBody());
                }
            } catch (JsonProcessingException e) {
                responseBody = "[Error serializing response body: " + e.getMessage() + "]";
            }
        } else {
            responseBody = "[No response body]";
        }
        audit.setResponseBody(responseBody);

        apiAuditRepository.save(audit);
    }
} 