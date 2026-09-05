package com.poojanthumar.websitehandler.config;

import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class SiteResolver {
	private static final String PREVIEW_PREFIX = "test-";
	private static final String PREVIEW_DOMAIN = ".poojanthumar.in";

	private final Set<String> wwwHosts;
	private final Set<String> weddingHosts;
	private final Set<String> adminHosts;

	public SiteResolver(AppProperties properties) {
		this.wwwHosts = normalizeAll(properties.getHosts().getWww());
		this.weddingHosts = normalizeAll(properties.getHosts().getWedding());
		this.adminHosts = normalizeAll(properties.getHosts().getAdmin());
	}

	public Site resolve(HttpServletRequest request) {
		String hostHeader = request.getHeader("Host");
		if (hostHeader == null || hostHeader.isBlank()) {
			hostHeader = request.getServerName();
		}
		return resolveHost(hostHeader);
	}

	public Site resolveHost(String hostHeader) {
		String host = normalize(hostHeader);
		host = productionAlias(host);
		if (wwwHosts.contains(host)) {
			return Site.WWW;
		}
		if (weddingHosts.contains(host)) {
			return Site.WEDDING;
		}
		if (adminHosts.contains(host)) {
			return Site.ADMIN;
		}
		return Site.UNKNOWN;
	}

	private static String productionAlias(String host) {
		if (host.startsWith(PREVIEW_PREFIX) && host.endsWith(PREVIEW_DOMAIN)) {
			String site = host.substring(PREVIEW_PREFIX.length(), host.length() - PREVIEW_DOMAIN.length());
			if (!site.isBlank() && site.chars().allMatch(character ->
					Character.isLowerCase(character) || Character.isDigit(character) || character == '-')) {
				return site + PREVIEW_DOMAIN;
			}
		}
		return host;
	}

	public boolean is(HttpServletRequest request, Site site) {
		return resolve(request) == site;
	}

	private static Set<String> normalizeAll(java.util.List<String> hosts) {
		return hosts.stream().map(SiteResolver::normalize).collect(Collectors.toUnmodifiableSet());
	}

	static String normalize(String hostHeader) {
		if (hostHeader == null) {
			return "";
		}
		String host = hostHeader.trim().toLowerCase(Locale.ROOT);
		int slash = host.indexOf('/');
		if (slash >= 0) {
			host = host.substring(0, slash);
		}
		if (host.startsWith("[")) {
			int end = host.indexOf(']');
			if (end > 0) {
				return host.substring(0, end + 1);
			}
		}
		int colon = host.lastIndexOf(':');
		if (colon > 0 && host.indexOf(':') == colon) {
			host = host.substring(0, colon);
		}
		return host;
	}
}
