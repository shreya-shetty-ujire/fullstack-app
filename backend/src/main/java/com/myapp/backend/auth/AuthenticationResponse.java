package com.myapp.backend.auth;


import com.myapp.backend.dto.CustomerDTO;

public record AuthenticationResponse (
        String token,
        CustomerDTO customerDTO){
}