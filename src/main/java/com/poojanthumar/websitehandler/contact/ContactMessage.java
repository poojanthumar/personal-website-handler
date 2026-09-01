package com.poojanthumar.websitehandler.contact;

import java.time.Instant;

public record ContactMessage(
		String id,
		String name,
		String email,
		String message,
		Instant receivedAt
) {
}
