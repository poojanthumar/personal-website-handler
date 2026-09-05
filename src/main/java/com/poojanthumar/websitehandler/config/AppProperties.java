package com.poojanthumar.websitehandler.config;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class AppProperties {

	private final Admin admin = new Admin();
	private final Hosts hosts = new Hosts();
	private final Contact contact = new Contact();

	public Admin getAdmin() {
		return admin;
	}

	public Hosts getHosts() {
		return hosts;
	}

	public Contact getContact() {
		return contact;
	}

	public static class Admin {
		private String username = "admin";
		private String password = "change-me";

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}
	}

	public static class Hosts {
		private List<String> www = new ArrayList<>();
		private List<String> wedding = new ArrayList<>();
		private List<String> admin = new ArrayList<>();

		public List<String> getWww() {
			return www;
		}

		public void setWww(List<String> www) {
			this.www = www;
		}

		public List<String> getWedding() {
			return wedding;
		}

		public void setWedding(List<String> wedding) {
			this.wedding = wedding;
		}

		public List<String> getAdmin() {
			return admin;
		}

		public void setAdmin(List<String> admin) {
			this.admin = admin;
		}
	}

	public static class Contact {
		private int maxRequests = 5;
		private Duration rateLimitWindow = Duration.ofMinutes(10);

		public int getMaxRequests() {
			return maxRequests;
		}

		public void setMaxRequests(int maxRequests) {
			this.maxRequests = maxRequests;
		}

		public Duration getRateLimitWindow() {
			return rateLimitWindow;
		}

		public void setRateLimitWindow(Duration rateLimitWindow) {
			this.rateLimitWindow = rateLimitWindow;
		}
	}
}
