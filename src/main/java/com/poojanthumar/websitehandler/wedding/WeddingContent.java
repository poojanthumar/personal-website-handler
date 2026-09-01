package com.poojanthumar.websitehandler.wedding;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "wedding_content")
public class WeddingContent {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "page_key", nullable = false, unique = true, length = 64)
	private String pageKey;

	@Column(nullable = false)
	private String title;

	private String subtitle;

	@Column(name = "couple_names")
	private String coupleNames;

	@Column(columnDefinition = "TEXT")
	private String body;

	@Column(name = "event_date")
	private String eventDate;

	private String venue;

	@Column(name = "extra_copy", columnDefinition = "TEXT")
	private String extraCopy;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt = Instant.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPageKey() {
		return pageKey;
	}

	public void setPageKey(String pageKey) {
		this.pageKey = pageKey;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSubtitle() {
		return subtitle;
	}

	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}

	public String getCoupleNames() {
		return coupleNames;
	}

	public void setCoupleNames(String coupleNames) {
		this.coupleNames = coupleNames;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getEventDate() {
		return eventDate;
	}

	public void setEventDate(String eventDate) {
		this.eventDate = eventDate;
	}

	public String getVenue() {
		return venue;
	}

	public void setVenue(String venue) {
		this.venue = venue;
	}

	public String getExtraCopy() {
		return extraCopy;
	}

	public void setExtraCopy(String extraCopy) {
		this.extraCopy = extraCopy;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}
}
