package com.example.app.dto;

import lombok.Data;

@Data
public class ReviewCreateRequest {
    private String comment;
    private Integer rating;
}

