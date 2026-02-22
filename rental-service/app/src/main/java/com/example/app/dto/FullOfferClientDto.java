package com.example.app.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class FullOfferClientDto {
    private String id;
    private String title;
    private String type;
    private Integer price;

    private Map<String, Object> city;
    private Map<String, Object> location;

    private Boolean isFavorite;
    private Boolean isPremium;
    private Double rating;

    private String description;
    private Integer bedrooms;
    private List<String> goods;
    private Map<String, Object> host;
    private List<String> images;
    private Integer maxAdults;
}

