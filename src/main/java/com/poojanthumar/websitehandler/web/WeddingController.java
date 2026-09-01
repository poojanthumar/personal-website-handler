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
	private final WeddingContentService weddingContentService;

	public WeddingController(SiteResolver siteResolver, WeddingContentService weddingContentService) {
		this.siteResolver = siteResolver;
		this.weddingContentService = weddingContentService;
	}

	@GetMapping("/roka")
	public String roka(HttpServletRequest request, Model model) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		model.addAttribute("page", weddingContentService.requireByKey("roka"));
		return "wedding/page";
	}
}
