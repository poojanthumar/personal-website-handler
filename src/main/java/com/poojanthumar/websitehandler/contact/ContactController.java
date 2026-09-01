package com.poojanthumar.websitehandler.contact;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

	private final ContactService contactService;

	public ContactController(ContactService contactService) {
		this.contactService = contactService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ContactMessage submit(@Valid @RequestBody ContactRequest request) {
		return contactService.submit(request);
	}

	@GetMapping
	public List<ContactMessage> list() {
		return contactService.listAll();
	}
}
