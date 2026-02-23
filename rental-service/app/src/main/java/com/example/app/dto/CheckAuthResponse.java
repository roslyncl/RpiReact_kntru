package com.example.app.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckAuthResponse {
    private Long id;
    private String email;
    private String username;
    private String avatar;
    private Boolean isPro;
    private String token;
}
