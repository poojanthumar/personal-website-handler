package com.poojanthumar.websitehandler.web;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.poojanthumar.websitehandler.config.Site;
import com.poojanthumar.websitehandler.config.SiteGuard;
import com.poojanthumar.websitehandler.config.SiteResolver;
import com.poojanthumar.websitehandler.contact.ContactMessageEntity;
import com.poojanthumar.websitehandler.contact.ContactRequest;
import com.poojanthumar.websitehandler.contact.ContactService;
import com.poojanthumar.websitehandler.wedding.WeddingContent;
import com.poojanthumar.websitehandler.wedding.WeddingContentService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class AdminController {

	private static final int PAGE_SIZE = 20;

	private final SiteResolver siteResolver;
	private final ContactService contactService;
	private final WeddingContentService weddingContentService;

	public AdminController(SiteResolver siteResolver, ContactService contactService,
			WeddingContentService weddingContentService) {
		this.siteResolver = siteResolver;
		this.contactService = contactService;
		this.weddingContentService = weddingContentService;
	}

	@GetMapping("/explorer")
	public String explorer(HttpServletRequest request, Model model) {
		requireAdmin(request);
		model.addAttribute("entities", knownEntities());
		return "admin/explorer";
	}

	@GetMapping("/explorer/contacts")
	public String contacts(HttpServletRequest request, @RequestParam(defaultValue = "0") int page, Model model) {
		requireAdmin(request);
		model.addAttribute("page", contactService.page(PageRequest.of(page, PAGE_SIZE, Sort.by("receivedAt").descending())));
		return "admin/contacts";
	}

	@GetMapping("/explorer/contacts/new")
	public String newContact(HttpServletRequest request, Model model) {
		requireAdmin(request);
		model.addAttribute("item", new ContactMessageEntity());
		model.addAttribute("create", true);
		return "admin/contact-form";
	}

	@GetMapping("/explorer/contacts/{id}")
	public String editContact(HttpServletRequest request, @PathVariable UUID id, Model model) {
		requireAdmin(request);
		model.addAttribute("item", contactService.get(id));
		model.addAttribute("create", false);
		return "admin/contact-form";
	}

	@PostMapping("/explorer/contacts")
	public String createContact(HttpServletRequest request, @RequestParam String name, @RequestParam String email,
			@RequestParam String message, RedirectAttributes redirectAttributes) {
		requireAdmin(request);
		contactService.submit(new ContactRequest(name, email, message));
		redirectAttributes.addFlashAttribute("notice", "Contact message created.");
		return "redirect:/explorer/contacts";
	}

	@PostMapping("/explorer/contacts/{id}")
	public String updateContact(HttpServletRequest request, @PathVariable UUID id, @RequestParam String name,
			@RequestParam String email, @RequestParam String message, RedirectAttributes redirectAttributes) {
		requireAdmin(request);
		contactService.update(id, new ContactRequest(name, email, message));
		redirectAttributes.addFlashAttribute("notice", "Contact message updated.");
		return "redirect:/explorer/contacts";
	}

	@PostMapping("/explorer/contacts/{id}/delete")
	public String deleteContact(HttpServletRequest request, @PathVariable UUID id, @RequestParam(defaultValue = "false") boolean confirm,
			RedirectAttributes redirectAttributes) {
		requireAdmin(request);
		if (!confirm) {
			redirectAttributes.addFlashAttribute("error", "Confirm delete before removing a row.");
			return "redirect:/explorer/contacts/" + id;
		}
		contactService.delete(id);
		redirectAttributes.addFlashAttribute("notice", "Contact message deleted.");
		return "redirect:/explorer/contacts";
	}

	@GetMapping("/explorer/wedding")
	public String wedding(HttpServletRequest request, @RequestParam(defaultValue = "0") int page, Model model) {
		requireAdmin(request);
		model.addAttribute("page", weddingContentService.page(PageRequest.of(page, PAGE_SIZE, Sort.by("pageKey"))));
		return "admin/wedding-list";
	}

	@GetMapping("/explorer/wedding/new")
	public String newWedding(HttpServletRequest request, Model model) {
		requireAdmin(request);
		model.addAttribute("item", new WeddingContent());
		model.addAttribute("create", true);
		return "admin/wedding-form";
	}

	@GetMapping("/explorer/wedding/{id}")
	public String editWedding(HttpServletRequest request, @PathVariable Long id, Model model) {
		requireAdmin(request);
		model.addAttribute("item", weddingContentService.get(id));
		model.addAttribute("create", false);
		return "admin/wedding-form";
	}

	@PostMapping("/explorer/wedding")
	public String createWedding(HttpServletRequest request, @ModelAttribute WeddingContent item,
			RedirectAttributes redirectAttributes) {
		requireAdmin(request);
		weddingContentService.create(item);
		redirectAttributes.addFlashAttribute("notice", "Wedding content created.");
		return "redirect:/explorer/wedding";
	}

	@PostMapping("/explorer/wedding/{id}")
	public String updateWedding(HttpServletRequest request, @PathVariable Long id, @ModelAttribute WeddingContent item,
			RedirectAttributes redirectAttributes) {
		requireAdmin(request);
		weddingContentService.update(id, item);
		redirectAttributes.addFlashAttribute("notice", "Wedding content updated.");
		return "redirect:/explorer/wedding";
	}

	@PostMapping("/explorer/wedding/{id}/delete")
	public String deleteWedding(HttpServletRequest request, @PathVariable Long id, @RequestParam(defaultValue = "false") boolean confirm,
			RedirectAttributes redirectAttributes) {
		requireAdmin(request);
		if (!confirm) {
			redirectAttributes.addFlashAttribute("error", "Confirm delete before removing a row.");
			return "redirect:/explorer/wedding/" + id;
		}
		weddingContentService.delete(id);
		redirectAttributes.addFlashAttribute("notice", "Wedding content deleted.");
		return "redirect:/explorer/wedding";
	}

	private void requireAdmin(HttpServletRequest request) {
		SiteGuard.require(siteResolver, request, Site.ADMIN);
	}

	private static Map<String, String> knownEntities() {
		Map<String, String> entities = new LinkedHashMap<>();
		entities.put("contacts", "Contact messages");
		entities.put("wedding", "Wedding pages / content");
		return entities;
	}
}
