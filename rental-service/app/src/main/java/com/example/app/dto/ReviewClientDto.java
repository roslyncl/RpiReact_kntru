package com.example.app.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ReviewClientDto {
    private String id;
    private String comment;
    private Double rating;
    private String date;
    private Map<String, Object> user;
}

