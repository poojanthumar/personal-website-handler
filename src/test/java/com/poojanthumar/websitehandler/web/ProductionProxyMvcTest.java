package com.poojanthumar.websitehandler.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"test", "prod"})
class ProductionProxyMvcTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void adminLoginRedirectKeepsOriginalHttpsScheme() throws Exception {
		mockMvc.perform(get("/")
				.header("Host", "admin.poojanthumar.in")
				.header("X-Forwarded-Proto", "https"))
				.andExpect(status().isFound())
				.andExpect(header().string("Location", "https://admin.poojanthumar.in/login"));
	}
}
