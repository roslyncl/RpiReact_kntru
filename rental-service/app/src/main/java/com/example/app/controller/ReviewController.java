package com.example.app.controller;

import com.example.app.adapter.ReviewAdapter;
import com.example.app.dto.ReviewClientDto;
import com.example.app.dto.ReviewCreateRequest;
import com.example.app.entity.Offer;
import com.example.app.entity.Review;
import com.example.app.entity.User;
import com.example.app.repository.OfferRepository;
import com.example.app.repository.ReviewRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Управление отзывами")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final OfferRepository offerRepository;

    @Value("${app.base-url:http://localhost:5000}")
    private String baseUrl;

    public ReviewController(ReviewRepository reviewRepository,
                            OfferRepository offerRepository) {
        this.reviewRepository = reviewRepository;
        this.offerRepository = offerRepository;
    }

    @PostMapping("/{offerId}")
    @Operation(summary = "Добавление отзыва к предложению")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Отзыв успешно добавлен"),
            @ApiResponse(responseCode = "400", description = "Неверные данные запроса"),
            @ApiResponse(responseCode = "401", description = "Неавторизованный доступ"),
            @ApiResponse(responseCode = "404", description = "Предложение не найдено")
    })
    public ReviewClientDto addReview(
            @Parameter(description = "ID предложения", required = true, example = "1")
            @PathVariable Long offerId,
            @RequestAttribute("currentUser") User author,
            @RequestBody ReviewCreateRequest request) {

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found"));

        Review review = new Review();
        review.setText(request.getComment());
        review.setRating(request.getRating());
        review.setOffer(offer);
        review.setAuthor(author);

        Review saved = reviewRepository.save(review);
        return ReviewAdapter.adaptReviewToClient(saved, baseUrl);
    }

    @GetMapping("/{offerId}")
    @Operation(summary = "Получение отзывов к предложению")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список отзывов успешно получен")
    })
    public List<ReviewClientDto> getReviewsByOfferId(
            @Parameter(description = "ID предложения", required = true, example = "1")
            @PathVariable Long offerId) {
        List<Review> reviews = reviewRepository.findByOfferIdOrderByPublishDateDesc(offerId);
        return reviews.stream()
                .map(review -> ReviewAdapter.adaptReviewToClient(review, baseUrl))
                .collect(Collectors.toList());
    }
}