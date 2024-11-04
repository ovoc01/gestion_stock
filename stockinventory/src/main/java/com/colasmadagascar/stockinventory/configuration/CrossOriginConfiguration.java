package com.colasmadagascar.stockinventory.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;


@Configuration
public class CrossOriginConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/**")
                .allowCredentials(true)
                .allowedMethods("*")
                .allowedOriginPatterns("*") // Specify your allowed origins
                .allowedHeaders("*")
                .exposedHeaders("Content-Disposition");
    }
}
