package com.myapp.backend.dto;

import com.myapp.backend.entity.Gender;

public record CustomerRegistrationRequest(
        String name,
        String email,
        String password,
        Integer age,
        Gender gender
) {
}