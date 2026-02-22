package com.example.app.adapter;

import com.example.app.dto.FullOfferClientDto;
import com.example.app.dto.OfferClientDto;
import com.example.app.entity.Offer;
import com.example.app.entity.User;
import com.example.app.entity.UserType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class OfferAdapter {

    private static String fullUrl(String path, String baseUrl) {
        if (path == null || path.isBlank() || path.startsWith("http")) return path;
        return baseUrl.replaceAll("/$", "") + (path.startsWith("/") ? path : "/" + path);
    }

    private static Map<String, Object> loc(double lat, double lng) {
        return Map.of("latitude", lat, "longitude", lng, "zoom", 13);
    }

    private static Map<String, Object> city(Offer o) {
        double lat = o.getLatitude() != null ? o.getLatitude() : 0;
        double lng = o.getLongitude() != null ? o.getLongitude() : 0;
        return Map.of("name", o.getCity().name(), "location", loc(lat, lng));
    }

    public static OfferClientDto adaptOfferToClient(Offer offer, String baseUrl) {
        List<String> photos = offer.getPhotos() == null ? List.of()
                : offer.getPhotos().stream().map(p -> fullUrl(p, baseUrl)).collect(Collectors.toList());

        double lat = offer.getLatitude() != null ? offer.getLatitude() : 0;
        double lng = offer.getLongitude() != null ? offer.getLongitude() : 0;
        return OfferClientDto.builder()
                .id(String.valueOf(offer.getId()))
                .title(offer.getTitle())
                .type(offer.getType().name())
                .price(offer.getPrice())
                .city(city(offer))
                .location(loc(lat, lng))
                .isFavorite(Boolean.TRUE.equals(offer.getIsFavorite()))
                .isPremium(Boolean.TRUE.equals(offer.getIsPremium()))
                .rating(offer.getRating() != null ? offer.getRating().doubleValue() : 0)
                .previewImage(fullUrl(offer.getPreviewImage(), baseUrl))
                .photos(photos)
                .build();
    }

    public static FullOfferClientDto adaptFullOfferToClient(Offer offer, User author, String baseUrl) {
        OfferClientDto base = adaptOfferToClient(offer, baseUrl);
        List<String> images = new ArrayList<>();
        if (offer.getPreviewImage() != null) images.add(fullUrl(offer.getPreviewImage(), baseUrl));
        if (offer.getPhotos() != null) offer.getPhotos().stream().limit(6)
                .map(p -> fullUrl(p, baseUrl)).forEach(images::add);

        List<String> goods = offer.getFeatures() == null ? List.of()
                : offer.getFeatures().stream().map(Enum::name).collect(Collectors.toList());

        Map<String, Object> host = Map.of(
                "name", author != null ? author.getUsername() : "Unknown",
                "avatarUrl", fullUrl(author != null ? author.getAvatar() : null, baseUrl),
                "isPro", author != null && author.getUserType() == UserType.pro
        );

        return FullOfferClientDto.builder()
                .id(base.getId()).title(base.getTitle()).type(base.getType()).price(base.getPrice())
                .city(base.getCity()).location(base.getLocation())
                .isFavorite(base.getIsFavorite()).isPremium(base.getIsPremium()).rating(base.getRating())
                .description(offer.getDescription())
                .bedrooms(offer.getRooms()).goods(goods).host(host).images(images).maxAdults(offer.getGuests())
                .build();
    }
}
