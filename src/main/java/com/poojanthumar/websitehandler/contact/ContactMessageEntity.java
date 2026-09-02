package com.poojanthumar.websitehandler.contact;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contact_messages")
public class ContactMessageEntity {

	@Id
	private UUID id;

	@Column(nullable = false, length = 200)
	private String name;

	@Column(nullable = false, length = 320)
	private String email;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String message;

	@Column(name = "received_at", nullable = false)
	private Instant receivedAt;

	public ContactMessageEntity() {
	}

	public ContactMessageEntity(UUID id, String name, String email, String message, Instant receivedAt) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.message = message;
		this.receivedAt = receivedAt;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Instant getReceivedAt() {
		return receivedAt;
	}

	public void setReceivedAt(Instant receivedAt) {
		this.receivedAt = receivedAt;
	}

	public ContactMessage toDto() {
		return new ContactMessage(id.toString(), name, email, message, receivedAt);
	}
}
