package com.poojanthumar.websitehandler.contact;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

	private final List<ContactMessage> messages = new CopyOnWriteArrayList<>();

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ContactMessage submit(@RequestBody ContactRequest request) {
		if (request.name() == null || request.name().isBlank()) {
			throw new IllegalArgumentException("name is required");
		}
		if (request.email() == null || request.email().isBlank()) {
			throw new IllegalArgumentException("email is required");
		}
		if (request.message() == null || request.message().isBlank()) {
			throw new IllegalArgumentException("message is required");
		}

		ContactMessage message = new ContactMessage(
				UUID.randomUUID().toString(),
				request.name().trim(),
				request.email().trim(),
				request.message().trim(),
				Instant.now()
		);
		messages.add(message);
		return message;
	}

	@GetMapping
	public List<ContactMessage> list() {
		return List.copyOf(messages);
	}
}
