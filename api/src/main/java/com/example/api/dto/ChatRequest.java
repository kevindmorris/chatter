package com.example.api.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
        @NotBlank String username,
        @NotBlank String content) {
}
