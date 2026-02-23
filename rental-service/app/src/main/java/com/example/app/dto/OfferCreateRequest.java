package com.example.app.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OfferCreateRequest {

    @NotBlank
    private String title;

    @NotBlank
    @Size(max = 1024)
    private String description;

    @NotBlank
    private String city;

    @NotBlank
    private String previewImage;

    private List<String> photos;

    private Boolean isPremium = false;

    private Boolean isFavorite = false;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    private BigDecimal rating;

    @NotBlank
    private String type;

    @NotNull
    @Min(1)
    private Integer rooms;

    @NotNull
    @Min(1)
    private Integer guests;

    @NotNull
    @Min(0)
    private Integer price;

    private List<String> features;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @NotNull
    private Long authorId;
}

