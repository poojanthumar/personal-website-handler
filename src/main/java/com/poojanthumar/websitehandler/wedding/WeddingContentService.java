package com.poojanthumar.websitehandler.wedding;

import java.time.Instant;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WeddingContentService {

	private final WeddingContentRepository repository;

	public WeddingContentService(WeddingContentRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public WeddingContent requireByKey(String pageKey) {
		return repository.findByPageKey(pageKey)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wedding page not found"));
	}

	@Transactional(readOnly = true)
	public Page<WeddingContent> page(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Transactional(readOnly = true)
	public WeddingContent get(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wedding page not found"));
	}

	@Transactional
	public WeddingContent create(WeddingContent incoming) {
		normalize(incoming);
		if (repository.existsByPageKey(incoming.getPageKey())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page key already exists");
		}
		incoming.setId(null);
		incoming.setUpdatedAt(Instant.now());
		return repository.save(incoming);
	}

	@Transactional
	public WeddingContent update(Long id, WeddingContent incoming) {
		WeddingContent existing = get(id);
		normalize(incoming);
		if (repository.findByPageKey(incoming.getPageKey())
				.filter(other -> !other.getId().equals(id))
				.isPresent()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page key already exists");
		}
		existing.setPageKey(incoming.getPageKey());
		existing.setTitle(incoming.getTitle());
		existing.setSubtitle(incoming.getSubtitle());
		existing.setCoupleNames(incoming.getCoupleNames());
		existing.setBody(incoming.getBody());
		existing.setEventDate(incoming.getEventDate());
		existing.setVenue(incoming.getVenue());
		existing.setExtraCopy(incoming.getExtraCopy());
		existing.setUpdatedAt(Instant.now());
		return repository.save(existing);
	}

	@Transactional
	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Wedding page not found");
		}
		repository.deleteById(id);
	}

	private static void normalize(WeddingContent content) {
		if (content.getPageKey() == null || content.getPageKey().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page key is required");
		}
		if (content.getTitle() == null || content.getTitle().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title is required");
		}
		content.setPageKey(content.getPageKey().trim().toLowerCase(Locale.ROOT));
		content.setTitle(content.getTitle().trim());
	}
}
