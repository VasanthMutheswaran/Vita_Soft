package com.vitasoft.taskmanager.service;

import com.vitasoft.taskmanager.dto.AuthResponse;
import com.vitasoft.taskmanager.dto.LoginDto;
import com.vitasoft.taskmanager.dto.RegisterDto;

public interface AuthService {
    AuthResponse login(LoginDto loginDto);
    String register(RegisterDto registerDto);
}
