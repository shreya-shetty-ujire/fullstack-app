package com.myapp.backend.dto;

public record CustomerUpdateRequest(
        String name,
        String email,
        Integer age
) {
}