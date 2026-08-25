package com.festiflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

// @RestController marks this class as a REST API handler. 
// It automatically converts the returned data into JSON format for the frontend.
@RestController
// @RequestMapping("/api") means every endpoint in this file starts with /api
@RequestMapping("/api")
public class HelloController {

    // @GetMapping("/hello") maps HTTP GET requests from /api/hello to this method
    @GetMapping("/hello")
    public Map<String, String> sayHello() {
        // We use a Map which Spring automatically converts into a JSON object
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Hello from FestiFlow Spring Boot Backend!");
        
        return response;
    }
}
