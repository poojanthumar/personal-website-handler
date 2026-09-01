package com.poojanthumar.websitehandler.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.poojanthumar.websitehandler.config.Site;
import com.poojanthumar.websitehandler.config.SiteGuard;
import com.poojanthumar.websitehandler.config.SiteResolver;
import com.poojanthumar.websitehandler.contact.ContactRequest;
import com.poojanthumar.websitehandler.contact.ContactService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@Controller
public class WwwController {

	private final SiteResolver siteResolver;
	private final ContactService contactService;

	public WwwController(SiteResolver siteResolver, ContactService contactService) {
		this.siteResolver = siteResolver;
		this.contactService = contactService;
	}

	@PostMapping("/contact")
	public String submitContact(HttpServletRequest request, @Valid @ModelAttribute("contactRequest") ContactRequest contactRequest,
			BindingResult bindingResult, Model model, RedirectAttributes redirectAttributes) {
		SiteGuard.require(siteResolver, request, Site.WWW);
		if (bindingResult.hasErrors()) {
			model.addAttribute("contactError", "Please fix the highlighted fields.");
			return "www/index";
		}
		contactService.submit(contactRequest);
		redirectAttributes.addFlashAttribute("contactSuccess", true);
		return "redirect:/";
	}
}
