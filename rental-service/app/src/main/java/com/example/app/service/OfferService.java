package com.example.app.service;

import com.example.app.adapter.OfferAdapter;
import com.example.app.dto.FullOfferClientDto;
import com.example.app.dto.OfferClientDto;
import com.example.app.dto.OfferCreateRequest;
import com.example.app.entity.Offer;
import com.example.app.entity.User;
import com.example.app.repository.OfferRepository;
import com.example.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.base-url:http://localhost:5000}")
    private String baseUrl;

    public List<OfferClientDto> getAllOffersForClient() {
        List<Offer> offers = offerRepository.findAll();
        return offers.stream()
                .map(offer -> OfferAdapter.adaptOfferToClient(offer, baseUrl))
                .collect(Collectors.toList());
    }

    public FullOfferClientDto getFullOfferForClient(Long id) {
        Offer offer = offerRepository.findWithDetailsById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found"));

        return OfferAdapter.adaptFullOfferToClient(offer, offer.getAuthor(), baseUrl);
    }

    @Transactional
    public Offer createOffer(OfferCreateRequest request) {
        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new IllegalArgumentException("Автор не найден"));

        Offer offer = new Offer();
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());

        try {
            offer.setCity((com.example.app.entity.City) Enum.valueOf(
                    (Class<Enum>) Class.forName("com.example.app.entity.City"),
                    request.getCity()
            ));
        } catch (Exception e) {
            throw new IllegalArgumentException("Некорректный город: " + request.getCity());
        }

        offer.setPreviewImage(request.getPreviewImage());
        offer.setPhotos(request.getPhotos() != null ? request.getPhotos() : new ArrayList<>());
        offer.setIsPremium(request.getIsPremium() != null ? request.getIsPremium() : false);
        offer.setIsFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false);
        offer.setRating(request.getRating());

        try {
            offer.setType((com.example.app.entity.OfferType) Enum.valueOf(
                    (Class<Enum>) Class.forName("com.example.app.entity.OfferType"),
                    request.getType()
            ));
        } catch (Exception e) {
            throw new IllegalArgumentException("Некорректный тип оффера: " + request.getType());
        }

        offer.setRooms(request.getRooms());
        offer.setGuests(request.getGuests());
        offer.setPrice(request.getPrice());

        List<String> featureStrings = request.getFeatures();
        List<Object> featureEnums = new ArrayList<>();
        if (featureStrings != null) {
            for (String f : featureStrings) {
                try {
                    Object enumVal = Enum.valueOf(
                            (Class<Enum>) Class.forName("com.example.app.entity.Feature"),
                            f
                    );
                    featureEnums.add(enumVal);
                } catch (Exception e) {
                    throw new IllegalArgumentException("Некорректная фича: " + f);
                }
            }
        }
        offer.setFeatures((List) featureEnums);

        offer.setLatitude(request.getLatitude());
        offer.setLongitude(request.getLongitude());
        offer.setAuthor(author);

        return offerRepository.save(offer);
    }
}