package com.poojanthumar.websitehandler.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
		@NotBlank(message = "name is required")
		@Size(max = 200)
		String name,

		@NotBlank(message = "email is required")
		@Email(message = "email is invalid")
		@Size(max = 320)
		String email,

		@NotBlank(message = "message is required")
		@Size(max = 8000)
		String message,

		@Size(max = 200)
		String website
) {
	public ContactRequest(String name, String email, String message) {
		this(name, email, message, "");
	}

	public boolean hasFilledHoneypot() {
		return website != null && !website.isBlank();
	}
}
