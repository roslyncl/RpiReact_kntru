package com.example.app.controller;

import com.example.app.dto.FullOfferClientDto;
import com.example.app.dto.OfferClientDto;
import com.example.app.dto.OfferCreateRequest;
import com.example.app.entity.Offer;
import com.example.app.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@Tag(name = "Offers", description = "Управление предложениями по аренде")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @GetMapping
    @Operation(summary = "Получение всех предложений")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список предложений успешно получен")
    })
    public List<OfferClientDto> getAllOffers() {
        return offerService.getAllOffersForClient();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получение детальной информации о предложении")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Информация о предложении успешно получена"),
            @ApiResponse(responseCode = "404", description = "Предложение не найдено")
    })
    public FullOfferClientDto getFullOffer(
            @Parameter(description = "ID предложения", required = true, example = "1")
            @PathVariable Long id) {
        return offerService.getFullOfferForClient(id);
    }

    @GetMapping("/favorite")
    @Operation(summary = "Получение избранных предложений")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список избранных предложений успешно получен"),
            @ApiResponse(responseCode = "401", description = "Неавторизованный доступ")
    })
    public List<OfferClientDto> getFavoriteOffers() {
        return offerService.getFavoriteOffersForClient();
    }

    @PostMapping("/favorite/{offerId}/{status}")
    @Operation(summary = "Добавление/удаление предложения в избранное")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Статус избранного успешно изменен"),
            @ApiResponse(responseCode = "401", description = "Неавторизованный доступ"),
            @ApiResponse(responseCode = "404", description = "Предложение не найдено")
    })
    public OfferClientDto toggleFavorite(
            @Parameter(description = "ID предложения", required = true, example = "1")
            @PathVariable Long offerId,
            @Parameter(description = "Статус (1 - добавить, 0 - удалить)", required = true, example = "1")
            @PathVariable int status) {
        return offerService.toggleFavorite(offerId, status);
    }

    @PostMapping
    @Operation(summary = "Создание нового предложения")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Предложение успешно создано"),
            @ApiResponse(responseCode = "400", description = "Неверные данные запроса"),
            @ApiResponse(responseCode = "401", description = "Неавторизованный доступ")
    })
    public Offer createOffer(@Valid @RequestBody OfferCreateRequest request) {
        return offerService.createOffer(request);
    }
}