package com.poojanthumar.websitehandler.web;

import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.poojanthumar.websitehandler.config.*;
import com.poojanthumar.websitehandler.wedding.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@Controller
public class WeddingResponseController {
 private final SiteResolver sites;
 private final WeddingResponseService service;
 private final WeddingAbuseGuard abuse;
 private final WeddingRsvpRepository rsvps;
 private final WeddingBlessingRepository blessings;
 public WeddingResponseController(SiteResolver sites, WeddingResponseService service, WeddingAbuseGuard abuse,
   WeddingRsvpRepository rsvps, WeddingBlessingRepository blessings) {
  this.sites=sites; this.service=service; this.abuse=abuse; this.rsvps=rsvps; this.blessings=blessings;
 }
 @PostMapping("/rsvp")
 public Object rsvp(HttpServletRequest http, @Valid @ModelAttribute RsvpRequest request, BindingResult errors, RedirectAttributes flash) {
  requireWedding(http);
  if (errors.hasErrors()) return result(http, flash, "rsvp", false);
  abuse.checkRateLimit(http);
  if (request.website()==null || request.website().isBlank()) service.submit(request);
  return result(http, flash, "rsvp", true);
 }
 @PostMapping("/guestbook")
 public Object blessing(HttpServletRequest http, @Valid @ModelAttribute BlessingRequest request, BindingResult errors, RedirectAttributes flash) {
  requireWedding(http);
  if (errors.hasErrors()) return result(http, flash, "guestbook", false);
  abuse.checkRateLimit(http);
  if (request.website()==null || request.website().isBlank()) service.submit(request);
  return result(http, flash, "guestbook", true);
 }
 private void requireWedding(HttpServletRequest http) {
  SiteGuard.require(sites, http, Site.WEDDING);
  // VM UI previews must never submit guest responses.
  String host = http.getServerName();
  if (host.startsWith("test-")) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);
 }
 private Object result(HttpServletRequest http, RedirectAttributes flash, String page, boolean success) {
  if ("application/json".equals(http.getHeader("Accept"))) return ResponseEntity.status(success ? 201 : 400).body(Map.of("saved",success));
  flash.addFlashAttribute(success ? "saved" : "submissionError", true);
  return "redirect:/"+page;
 }
 @GetMapping("/explorer/rsvps")
 public String rsvps(HttpServletRequest http, @RequestParam(defaultValue="0") int page, Model model) {
  SiteGuard.require(sites,http,Site.ADMIN);
  model.addAttribute("page",rsvps.findAll(PageRequest.of(Math.max(0,page),20,Sort.by("receivedAt").descending())));
  return "admin/rsvps";
 }
 @GetMapping("/explorer/blessings")
 public String blessings(HttpServletRequest http, @RequestParam(defaultValue="0") int page,
   @RequestParam(defaultValue="PENDING") String status, Model model) {
  SiteGuard.require(sites,http,Site.ADMIN);
  if (!java.util.Set.of("PENDING","APPROVED","REJECTED").contains(status)) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST);
  model.addAttribute("status",status);
  model.addAttribute("page",blessings.findByStatus(status,PageRequest.of(Math.max(0,page),20,Sort.by("receivedAt").descending())));
  return "admin/blessings";
 }
 @PostMapping("/explorer/blessings/{id}/moderate")
 public String moderate(HttpServletRequest http, @PathVariable UUID id, @RequestParam String status) {
  SiteGuard.require(sites,http,Site.ADMIN); service.moderate(id,status); return "redirect:/explorer/blessings";
 }
}
