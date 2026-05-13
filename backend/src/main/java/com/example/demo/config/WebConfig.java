package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todos os endpoints
                .allowedOrigins("http://localhost:5173") // Origem do seu Frontend Vite
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Libera explicitamente o PUT
                .allowedHeaders("*") // Libera todos os cabeçalhos
                .allowCredentials(true);
    }
}
