package com.example.app.repository;

import com.example.app.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    @EntityGraph(attributePaths = {"author"})
    Optional<Offer> findWithDetailsById(Long id);

    List<Offer> findByIsFavoriteTrue();
}