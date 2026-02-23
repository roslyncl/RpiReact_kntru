package com.example.app.controller;

import com.example.app.dto.FullOfferClientDto;
import com.example.app.dto.OfferClientDto;
import com.example.app.dto.OfferCreateRequest;
import com.example.app.entity.Offer;
import com.example.app.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @GetMapping
    public List<OfferClientDto> getAllOffers() {
        return offerService.getAllOffersForClient();
    }

    @GetMapping("/{id}")
    public FullOfferClientDto getFullOffer(@PathVariable Long id) {
        return offerService.getFullOfferForClient(id);
    }

    @GetMapping("/favorite")
    public List<OfferClientDto> getFavoriteOffers() {
        return offerService.getFavoriteOffersForClient();
    }

    @PostMapping("/favorite/{offerId}/{status}")
    public OfferClientDto toggleFavorite(@PathVariable Long offerId, @PathVariable int status) {
        return offerService.toggleFavorite(offerId, status);
    }

    @PostMapping
    public Offer createOffer(@Valid @RequestBody OfferCreateRequest request) {
        return offerService.createOffer(request);
    }
}