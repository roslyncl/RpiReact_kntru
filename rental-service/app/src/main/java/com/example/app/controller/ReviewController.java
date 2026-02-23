package com.example.app.controller;

import com.example.app.adapter.ReviewAdapter;
import com.example.app.dto.ReviewClientDto;
import com.example.app.dto.ReviewCreateRequest;
import com.example.app.entity.Offer;
import com.example.app.entity.Review;
import com.example.app.entity.User;
import com.example.app.repository.OfferRepository;
import com.example.app.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
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
    public ReviewClientDto addReview(@PathVariable Long offerId,
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
    public List<ReviewClientDto> getReviewsByOfferId(@PathVariable Long offerId) {
        List<Review> reviews = reviewRepository.findByOfferIdOrderByPublishDateDesc(offerId);
        return reviews.stream()
                .map(review -> ReviewAdapter.adaptReviewToClient(review, baseUrl))
                .collect(Collectors.toList());
    }
}

