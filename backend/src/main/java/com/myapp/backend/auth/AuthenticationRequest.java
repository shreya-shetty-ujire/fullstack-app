package com.myapp.backend.auth;

public record AuthenticationRequest(
        String username,
        String password
) {
}