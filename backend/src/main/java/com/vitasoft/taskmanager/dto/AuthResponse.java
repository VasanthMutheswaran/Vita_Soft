package com.vitasoft.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;

    public AuthResponse(String accessToken, String username) {
        this.accessToken = accessToken;
        this.username = username;
    }
}
