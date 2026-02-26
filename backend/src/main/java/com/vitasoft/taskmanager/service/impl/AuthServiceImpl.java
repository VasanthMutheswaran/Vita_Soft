package com.vitasoft.taskmanager.service.impl;

import com.vitasoft.taskmanager.dto.AuthResponse;
import com.vitasoft.taskmanager.dto.LoginDto;
import com.vitasoft.taskmanager.dto.RegisterDto;
import com.vitasoft.taskmanager.model.Role;
import com.vitasoft.taskmanager.model.User;
import com.vitasoft.taskmanager.repository.UserRepository;
import com.vitasoft.taskmanager.security.JwtTokenProvider;
import com.vitasoft.taskmanager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(token, loginDto.getUsername());
    }

    @Override
    public String register(RegisterDto registerDto) {
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }

        User user = User.builder()
                .username(registerDto.getUsername())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return "User registered successfully.";
    }
}
