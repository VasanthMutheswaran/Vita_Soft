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
 * Handles user registration and login flows.
 * This is public, so no JWT required here obviously!
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Checks credentials and issues a JWT token if they are valid.
     * 
     * @param loginDto username and password payload
     * @return the generated JWT token inside an AuthResponse
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
