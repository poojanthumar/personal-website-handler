package com.poojanthumar.websitehandler.wedding;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.poojanthumar.websitehandler.config.AppProperties;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class WeddingAbuseGuard {

	private static final int MAX_TRACKED_CLIENTS = 10_000;

	private final ConcurrentHashMap<String, Window> clients = new ConcurrentHashMap<>();
	private final int maxRequests;
	private final Duration windowLength;
	private final Clock clock;

	@Autowired
	public WeddingAbuseGuard(AppProperties properties) {
		this(10, Duration.ofMinutes(10), Clock.systemUTC());
	}

	WeddingAbuseGuard(int maxRequests, Duration windowLength, Clock clock) {
		if (maxRequests < 1 || windowLength == null || windowLength.isZero() || windowLength.isNegative()) {
			throw new IllegalArgumentException("contact rate limit must have a positive count and window");
		}
		this.maxRequests = maxRequests;
		this.windowLength = windowLength;
		this.clock = clock;
	}

	public void checkRateLimit(HttpServletRequest request) {
		Instant now = clock.instant();
		String client = request.getRemoteAddr();
		if (clients.size() >= MAX_TRACKED_CLIENTS && !clients.containsKey(client)) {
			clients.entrySet().removeIf(entry -> !now.isBefore(entry.getValue().startedAt().plus(windowLength)));
			if (clients.size() >= MAX_TRACKED_CLIENTS) {
				throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
						"Wedding submission capacity reached. Please try again later.");
			}
		}
		Window current = clients.compute(client, (ignored, previous) -> {
			if (previous == null || !now.isBefore(previous.startedAt().plus(windowLength))) {
				return new Window(now, 1);
			}
			return new Window(previous.startedAt(), previous.requests() + 1);
		});

		if (current.requests() > maxRequests) {
			throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
					"Too many wedding submissions. Please try again later.");
		}
	}

	private record Window(Instant startedAt, int requests) {
	}
}
