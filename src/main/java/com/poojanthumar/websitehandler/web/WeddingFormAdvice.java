package com.poojanthumar.websitehandler.web;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice(assignableTypes = {WeddingController.class, RootController.class})
public class WeddingFormAdvice {
 @ModelAttribute
 public void initializeFormSession(HttpServletRequest request) {
  // Large illustrated pages may flush before the RSVP dialog is rendered.
  // Resolve the deferred token while response headers are still writable.
  Object token = request.getAttribute(CsrfToken.class.getName());
  if (token instanceof CsrfToken csrf) csrf.getToken();
 }
}
