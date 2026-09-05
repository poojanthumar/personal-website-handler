package com.poojanthumar.websitehandler.web;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class HostRoutingMvcTest {

	private static final String WWW = "www.poojanthumar.in";
	private static final String WEDDING = "wedding.poojanthumar.in";
	private static final String ADMIN = "admin.poojanthumar.in";

	@Autowired
	private MockMvc mockMvc;

	@Test
	void wwwHomeIsPublicPortfolio() throws Exception {
		mockMvc.perform(get("/").header("Host", WWW))
				.andExpect(status().isOk())
				.andExpect(view().name("www/index"));
	}

	@Test
	void weddingHomeAndRokaArePublic() throws Exception {
		mockMvc.perform(get("/").header("Host", WEDDING))
				.andExpect(status().isOk())
				.andExpect(view().name("wedding/page"));

		mockMvc.perform(get("/roka").header("Host", WEDDING))
				.andExpect(status().isOk())
				.andExpect(view().name("wedding/page"));
	}

	@Test
	void adminHomeUnauthenticatedRedirectsToLogin() throws Exception {
		mockMvc.perform(get("/").header("Host", ADMIN))
				.andExpect(status().isFound())
				.andExpect(redirectedUrl("/login"));
	}

	@Test
	void adminLoginPageIsReachable() throws Exception {
		mockMvc.perform(get("/login").header("Host", ADMIN))
				.andExpect(status().isOk())
				.andExpect(view().name("admin/login"));
	}

	@Test
	void adminExplorerRequiresAuth() throws Exception {
		mockMvc.perform(get("/explorer").header("Host", ADMIN))
				.andExpect(status().isFound())
				.andExpect(redirectedUrl("/login"));
	}

	@Test
	void adminDashboardWithBasicAuth() throws Exception {
		mockMvc.perform(get("/").header("Host", ADMIN).with(httpBasic("admin", "test-password")))
				.andExpect(status().isOk())
				.andExpect(view().name("admin/dashboard"));
	}

	@Test
	void wildcardDnsPreviewNamesResolveToTheirProductionSite() throws Exception {
		mockMvc.perform(get("/").header("Host", "test-www.poojanthumar.in"))
				.andExpect(status().isOk())
				.andExpect(view().name("www/index"));

		mockMvc.perform(get("/").header("Host", "test-wedding.poojanthumar.in"))
				.andExpect(status().isOk())
				.andExpect(view().name("wedding/page"));

		mockMvc.perform(get("/login").header("Host", "test-admin.poojanthumar.in"))
				.andExpect(status().isOk())
				.andExpect(view().name("admin/login"));
	}

	@Test
	void wwwContactFormPersistsWithCsrf() throws Exception {
		mockMvc.perform(post("/contact")
				.header("Host", WWW)
				.with(csrf())
				.param("name", "Grace Hopper")
				.param("email", "grace@example.com")
				.param("message", "Hello from the form"))
				.andExpect(status().isFound());
	}
}
