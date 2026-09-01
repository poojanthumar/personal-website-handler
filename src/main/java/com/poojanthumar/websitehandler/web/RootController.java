package com.poojanthumar.websitehandler.web;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import com.poojanthumar.websitehandler.config.Site;
import com.poojanthumar.websitehandler.config.SiteResolver;
import com.poojanthumar.websitehandler.contact.ContactRequest;
import com.poojanthumar.websitehandler.contact.ContactService;
import com.poojanthumar.websitehandler.wedding.WeddingContentService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class RootController {

	private final SiteResolver siteResolver;
	private final WeddingContentService weddingContentService;
	private final ContactService contactService;

	public RootController(SiteResolver siteResolver, WeddingContentService weddingContentService,
			ContactService contactService) {
		this.siteResolver = siteResolver;
		this.weddingContentService = weddingContentService;
		this.contactService = contactService;
	}

	@GetMapping("/")
	public String home(HttpServletRequest request, Model model) {
		return switch (siteResolver.resolve(request)) {
			case WWW -> {
				model.addAttribute("contactRequest", new ContactRequest("", "", ""));
				yield "www/index";
			}
			case WEDDING -> {
				model.addAttribute("page", weddingContentService.requireByKey("home"));
				yield "wedding/page";
			}
			case ADMIN -> {
				model.addAttribute("contactCount", contactService.page(Pageable.ofSize(1)).getTotalElements());
				model.addAttribute("weddingCount", weddingContentService.page(Pageable.ofSize(1)).getTotalElements());
				yield "admin/dashboard";
			}
			case UNKNOWN -> throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		};
	}

	@GetMapping("/login")
	public String login(HttpServletRequest request) {
		if (siteResolver.resolve(request) != Site.ADMIN) {
			return "error/not-found";
		}
		return "admin/login";
	}
}
