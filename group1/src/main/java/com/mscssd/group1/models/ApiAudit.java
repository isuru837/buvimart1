package com.mscssd.group1.models;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_audit")
@EntityListeners(AuditingEntityListener.class)
public class ApiAudit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String endpoint;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String requestBody;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String responseBody;

    @Column(nullable = false)
    private Integer statusCode;

    @Column(nullable = false)
    private String userName;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    // Default constructor
    public ApiAudit() {
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getMethod() {
        return method;
    }

    public String getRequestBody() {
        return requestBody;
    }

    public String getResponseBody() {
        return responseBody;
    }

    public Integer getStatusCode() {
        return statusCode;
    }

    public String getUserName() {
        return userName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public void setRequestBody(String requestBody) {
        this.requestBody = requestBody;
    }

    public void setResponseBody(String responseBody) {
        this.responseBody = responseBody;
    }

    public void setStatusCode(Integer statusCode) {
        this.statusCode = statusCode;
    }

    public void setUserName(String username) {
        this.userName = username;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 