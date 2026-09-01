package com.poojanthumar.websitehandler.wedding;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WeddingContentRepository extends JpaRepository<WeddingContent, Long> {

	Optional<WeddingContent> findByPageKey(String pageKey);

	boolean existsByPageKey(String pageKey);
}
