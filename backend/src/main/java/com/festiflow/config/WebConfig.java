package com.festiflow.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration tells Spring that this class contains configuration settings.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cross-Origin Resource Sharing (CORS) setup
        // The frontend (e.g., Live Server on port 5500) and backend (port 8080) run on different ports.
        // Browsers block requests between different ports by default for security.
        // This configuration explicitly allows the frontend to talk to the backend APIs.
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://127.0.0.1:5500", 
                        "http://localhost:5500", 
                        "http://localhost:3000",
                        "http://localhost:8080"
                ) 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
