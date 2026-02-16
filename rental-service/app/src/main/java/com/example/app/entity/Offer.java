package com.example.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "offers")
@Data
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1024)
    private String description;

    @Column(name = "publish_date", nullable = false)
    private LocalDateTime publishDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private City city;

    @Column(name = "preview_image", nullable = false)
    private String previewImage;

    @ElementCollection
    @CollectionTable(name = "offer_photos", joinColumns = @JoinColumn(name = "offer_id"))
    private List<String> photos;

    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Column(name = "is_favorite", nullable = false)
    private Boolean isFavorite = false;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferType type;

    @Column(nullable = false)
    private Integer rooms;

    @Column(nullable = false)
    private Integer guests;

    @Column(nullable = false)
    private Integer price;

    @ElementCollection
    @CollectionTable(name = "offer_features", joinColumns = @JoinColumn(name = "offer_id"))
    @Enumerated(EnumType.STRING)
    private List<Feature> features;

    @Column(name = "comments_count")
    private Integer commentsCount = 0;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
}

enum City {
    Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf
}

enum OfferType {
    apartment, house, room, hotel
}

enum Feature {
    Breakfast, Air_conditioning, Laptop_friendly_workspace,
    Baby_seat, Washer, Towels, Fridge
}