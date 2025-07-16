package com.example.api.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(info = @Info(title = "API", version = "1.0.0", description = "A real-time chat API with WebSocket and REST endpoints."))
@Configuration
public class OpenApiConfig {
}