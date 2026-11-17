package com.poojanthumar.websitehandler.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.poojanthumar.websitehandler.config.Site;
import com.poojanthumar.websitehandler.config.SiteGuard;
import com.poojanthumar.websitehandler.config.SiteResolver;
import com.poojanthumar.websitehandler.wedding.WeddingContentService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class WeddingController {

	private final SiteResolver siteResolver;
	private final com.poojanthumar.websitehandler.wedding.WeddingBlessingRepository blessings;
	private final WeddingContentService weddingContentService;

	public WeddingController(SiteResolver siteResolver, WeddingContentService weddingContentService, com.poojanthumar.websitehandler.wedding.WeddingBlessingRepository blessings) {
		this.blessings = blessings;
		this.siteResolver = siteResolver;
		this.weddingContentService = weddingContentService;
	}

	@GetMapping("/events")
	public String events(HttpServletRequest request) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		return "wedding/events";
	}

	@GetMapping("/rsvp")
	public String rsvp(HttpServletRequest request) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		return "wedding/rsvp";
	}

	@GetMapping("/guestbook")
	public String guestbook(HttpServletRequest request, @org.springframework.web.bind.annotation.RequestParam(defaultValue="0") int page, Model model) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		model.addAttribute("blessings", blessings.findByStatus("APPROVED", org.springframework.data.domain.PageRequest.of(Math.max(0,page),20,org.springframework.data.domain.Sort.by("receivedAt").descending())));
		return "wedding/guestbook";
	}

	@GetMapping("/roka")
	public String roka(HttpServletRequest request, Model model) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		model.addAttribute("page", weddingContentService.requireByKey("roka"));
		return "wedding/page";
	}
}
