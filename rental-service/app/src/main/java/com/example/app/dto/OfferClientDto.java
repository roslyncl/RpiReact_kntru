package com.example.app.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class OfferClientDto {
    private String id;
    private String title;
    private String type;
    private Integer price;
    private Map<String, Object> city;
    private Map<String, Object> location;
    private Boolean isFavorite;
    private Boolean isPremium;
    private Double rating;
    private String previewImage;
    private List<String> photos;
}
