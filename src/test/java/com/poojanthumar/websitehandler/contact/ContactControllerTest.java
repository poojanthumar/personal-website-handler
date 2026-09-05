package com.poojanthumar.websitehandler.contact;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactControllerTest {
	private static final String WWW = "www.poojanthumar.in";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ContactMessageRepository repository;

	@Test
	void submitsPersistsAndRejectsPublicList() throws Exception {
		mockMvc.perform(post("/api/contact")
				.header("Host", WWW)
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{
						  "name": "Ada Lovelace",
						  "email": "ada@example.com",
						  "message": "Hello from the website handler"
						}
						"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("Ada Lovelace"))
				.andExpect(jsonPath("$.email").value("ada@example.com"));

		org.assertj.core.api.Assertions.assertThat(repository.findAll())
				.anyMatch(row -> "Hello from the website handler".equals(row.getMessage()));

		mockMvc.perform(get("/api/contact"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(get("/api/contact").with(httpBasic("admin", "test-password")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[?(@.message=='Hello from the website handler')]").exists());
	}

	@Test
	void rejectsBlankContactFields() throws Exception {
		mockMvc.perform(post("/api/contact")
				.header("Host", WWW)
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"name":"","email":"ada@example.com","message":"hi"}
						"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.error").value("name is required"));
	}

	@Test
	void contactSubmissionOnlyWorksOnWwwHost() throws Exception {
		mockMvc.perform(post("/api/contact")
				.header("Host", "wedding.poojanthumar.in")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"message\":\"Hello\"}"))
				.andExpect(status().isNotFound());
	}

	@Test
	void silentlyDiscardsHoneypotSubmission() throws Exception {
		long before = repository.count();
		mockMvc.perform(post("/api/contact")
				.header("Host", WWW)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Bot\",\"email\":\"bot@example.com\",\"message\":\"Spam\",\"website\":\"filled\"}"))
				.andExpect(status().isCreated());
		org.assertj.core.api.Assertions.assertThat(repository.count()).isEqualTo(before);
	}

	@Test
	void rateLimitsRepeatedSubmissionsByClientAddress() throws Exception {
		for (int i = 0; i < 5; i++) {
			mockMvc.perform(post("/api/contact")
					.header("Host", WWW)
					.with(request -> { request.setRemoteAddr("198.51.100.24"); return request; })
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"message\":\"Hello\"}"))
					.andExpect(status().isCreated());
		}
		mockMvc.perform(post("/api/contact")
				.header("Host", WWW)
				.with(request -> { request.setRemoteAddr("198.51.100.24"); return request; })
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"message\":\"Hello\"}"))
				.andExpect(status().isTooManyRequests());
	}
}
