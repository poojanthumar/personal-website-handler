package com.poojanthumar.websitehandler.web;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.poojanthumar.websitehandler.config.Site;
import com.poojanthumar.websitehandler.config.SiteGuard;
import com.poojanthumar.websitehandler.config.SiteResolver;
import com.poojanthumar.websitehandler.wedding.WeddingContentService;
import com.poojanthumar.websitehandler.wedding.WeddingBlessingRepository;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class WeddingController {

	private final SiteResolver siteResolver;
	private static final List<Celebration> CELEBRATIONS = List.of(
			new Celebration("engagement", "Engagement", "Sunheri Sagai", "2026-12-12T09:00:00+05:30",
					"12 December · 9 AM", "Two families come together to celebrate a beautiful beginning."),
			new Celebration("mandvo", "Mandvo", "Shubh Mandvo", "2026-12-12T13:00:00+05:30",
					"12 December · 1 PM onwards", "An auspicious gathering to bless the beginning of our wedding celebrations."),
			new Celebration("haldi", "Haldi", "Rangi Saari", "2026-12-12T16:00:00+05:30",
					"12 December · 4 PM", "An afternoon of colour, blessings and laughter."),
			new Celebration("sangeet", "Sangeet", "Blinding Lights, Bollywood Nights", "2026-12-12T21:00:00+05:30",
					"12 December · 9 PM", "An evening of music, dance and celebration beneath the stars."),
			new Celebration("wedding", "Wedding", "Mangal Milan", "2026-12-13T08:00:00+05:30",
					"13 December · 8 AM onwards", "Two families, two traditions and one beautiful forever."));

	public record Celebration(String key, String type, String name, String startsAt, String time, String description) {}

	private final WeddingBlessingRepository blessings;
	private final WeddingContentService weddingContentService;

	public WeddingController(SiteResolver siteResolver, WeddingContentService weddingContentService, WeddingBlessingRepository blessings) {
		this.blessings = blessings;
		this.siteResolver = siteResolver;
		this.weddingContentService = weddingContentService;
	}

	@GetMapping("/events")
	public String events(HttpServletRequest request, Model model) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		model.addAttribute("celebrations", CELEBRATIONS);
		return "wedding/events";
	}

	@GetMapping({"/rsvp", "/guestbook"})
	public String responses(HttpServletRequest request, @RequestParam(defaultValue = "0") int page, Model model) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		model.addAttribute("blessings", blessings.findByStatus("APPROVED",
				PageRequest.of(Math.max(0, page), 20, Sort.by("receivedAt", "id").descending())));
		return "wedding/rsvp";
	}

	@GetMapping("/roka")
	public String roka(HttpServletRequest request, Model model) {
		SiteGuard.require(siteResolver, request, Site.WEDDING);
		model.addAttribute("page", weddingContentService.requireByKey("roka"));
		return "wedding/page";
	}
}
