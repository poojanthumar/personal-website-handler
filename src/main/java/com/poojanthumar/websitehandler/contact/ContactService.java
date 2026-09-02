package com.poojanthumar.websitehandler.contact;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ContactService {

	private final ContactMessageRepository repository;

	public ContactService(ContactMessageRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public ContactMessage submit(ContactRequest request) {
		ContactMessageEntity entity = new ContactMessageEntity(
				UUID.randomUUID(),
				request.name().trim(),
				request.email().trim(),
				request.message().trim(),
				Instant.now());
		return repository.save(entity).toDto();
	}

	@Transactional(readOnly = true)
	public List<ContactMessage> listAll() {
		return repository.findAll().stream().map(ContactMessageEntity::toDto).toList();
	}

	@Transactional(readOnly = true)
	public Page<ContactMessageEntity> page(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Transactional(readOnly = true)
	public ContactMessageEntity get(UUID id) {
		return repository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact message not found"));
	}

	@Transactional
	public ContactMessageEntity update(UUID id, ContactRequest request) {
		ContactMessageEntity entity = get(id);
		entity.setName(request.name().trim());
		entity.setEmail(request.email().trim());
		entity.setMessage(request.message().trim());
		return repository.save(entity);
	}

	@Transactional
	public void delete(UUID id) {
		if (!repository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact message not found");
		}
		repository.deleteById(id);
	}
}
