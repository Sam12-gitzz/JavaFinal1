package com.festiflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This annotation tells Spring Boot that this is the main class.
// It automatically configures the application and scans for components (Controllers, Services).
@SpringBootApplication
public class FestiFlowApplication {

    public static void main(String[] args) {
        // Starts the embedded Tomcat server and the Spring context
        SpringApplication.run(FestiFlowApplication.class, args);
    }
}
