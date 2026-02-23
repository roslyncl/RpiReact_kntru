package com.example.app.adapter;

import com.example.app.dto.ReviewClientDto;
import com.example.app.entity.Review;
import com.example.app.entity.User;
import com.example.app.entity.UserType;

import java.time.ZoneOffset;
import java.util.Map;

public final class ReviewAdapter {

    private static String fullUrl(String path, String baseUrl) {
        if (path == null || path.isBlank() || path.startsWith("http")) return path;
        return baseUrl.replaceAll("/$", "") + (path.startsWith("/") ? path : "/" + path);
    }

    public static ReviewClientDto adaptReviewToClient(Review review, String baseUrl) {
        User author = review.getAuthor();

        String isoDate = review.getPublishDate()
                .atZone(ZoneOffset.systemDefault())
                .toInstant()
                .toString();

        Map<String, Object> user = Map.of(
                "name", author != null && author.getUsername() != null ? author.getUsername() : "Unknown",
                "avatarUrl", author != null ? fullUrl(author.getAvatar(), baseUrl) : null,
                "isPro", author != null && author.getUserType() == UserType.pro
        );

        return ReviewClientDto.builder()
                .id(String.valueOf(review.getId()))
                .comment(review.getText())
                .rating(review.getRating() != null ? review.getRating().doubleValue() : 0)
                .date(isoDate)
                .user(user)
                .build();
    }
}

