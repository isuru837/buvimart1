package com.mscssd.group1.config;

import com.mscssd.group1.interceptors.ApiAuditInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private ApiAuditInterceptor apiAuditInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(apiAuditInterceptor)
                .addPathPatterns("/api/**");  // Only audit API endpoints
    }
} 