package com.poojanthumar.websitehandler.contact;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ContactControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void submitsAndListsContactMessages() throws Exception {
		mockMvc.perform(post("/api/contact")
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

		mockMvc.perform(get("/api/contact"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].message").value("Hello from the website handler"));
	}
}
