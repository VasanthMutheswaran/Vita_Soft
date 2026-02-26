package com.vitasoft.taskmanager.controller;

import com.vitasoft.taskmanager.dto.AuthResponse;
import com.vitasoft.taskmanager.dto.LoginDto;
import com.vitasoft.taskmanager.dto.RegisterDto;
import com.vitasoft.taskmanager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Authenticaton.
 * Exposes endpoints for user registration and JWT login.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Authenticates a user and generates a JWT token.
     * 
     * @param loginDto login payload containing username and password
     * @return AuthResponse containing the JWT access token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDto loginDto) {
        AuthResponse response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        String response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
