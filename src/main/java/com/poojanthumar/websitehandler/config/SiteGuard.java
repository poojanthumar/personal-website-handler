package com.poojanthumar.websitehandler.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;

public final class SiteGuard {

	private SiteGuard() {
	}

	public static void require(SiteResolver resolver, HttpServletRequest request, Site site) {
		if (!resolver.is(request, site)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
	}
}
