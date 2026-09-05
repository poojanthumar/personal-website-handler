package com.poojanthumar.websitehandler.contact;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poojanthumar.websitehandler.config.Site;
import com.poojanthumar.websitehandler.config.SiteGuard;
import com.poojanthumar.websitehandler.config.SiteResolver;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

	private final ContactService contactService;
	private final ContactAbuseGuard abuseGuard;
	private final SiteResolver siteResolver;

	public ContactController(ContactService contactService, ContactAbuseGuard abuseGuard, SiteResolver siteResolver) {
		this.contactService = contactService;
		this.abuseGuard = abuseGuard;
		this.siteResolver = siteResolver;
	}

	@PostMapping
	public ResponseEntity<ContactMessage> submit(HttpServletRequest servletRequest, @Valid @RequestBody ContactRequest request) {
		SiteGuard.require(siteResolver, servletRequest, Site.WWW);
		if (abuseGuard.shouldDiscard(request)) {
			return ResponseEntity.status(HttpStatus.CREATED).build();
		}
		abuseGuard.checkRateLimit(servletRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(contactService.submit(request));
	}

	@GetMapping
	public List<ContactMessage> list() {
		return contactService.listAll();
	}
}
