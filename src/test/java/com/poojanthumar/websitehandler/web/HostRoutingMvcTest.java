package com.poojanthumar.websitehandler.web;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

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
	void workPageOnlyRendersOnPortfolioHosts() throws Exception {
		for (String host : new String[] {WWW, "test-www.poojanthumar.in"}) {
			mockMvc.perform(get("/work").header("Host", host))
					.andExpect(status().isOk()).andExpect(view().name("www/work"));
		}
		for (String host : new String[] {WEDDING, "test-wedding.poojanthumar.in", "unknown.example"}) {
			mockMvc.perform(get("/work").header("Host", host)).andExpect(status().isNotFound());
		}
		mockMvc.perform(get("/work").header("Host", ADMIN))
				.andExpect(status().isFound()).andExpect(redirectedUrl("/login"));
		for (String host : new String[] {ADMIN, "test-admin.poojanthumar.in"}) {
			mockMvc.perform(get("/work").header("Host", host).with(httpBasic("admin", "test-password")))
					.andExpect(status().isNotFound());
		}
	}

	@Test
	void weddingHomeAndRokaArePublic() throws Exception {
		mockMvc.perform(get("/").header("Host", WEDDING))
				.andExpect(status().isOk())
				.andExpect(view().name("wedding/home"));

		mockMvc.perform(get("/roka").header("Host", WEDDING))
				.andExpect(status().isOk())
				.andExpect(view().name("wedding/page"));
	}

	@Test
	void weddingInvitationUsesApprovedScheduleAndOmitsPrivateBackground() throws Exception {
		mockMvc.perform(get("/").header("Host", WEDDING))
				.andExpect(status().isOk())
				.andExpect(content().string(containsString("2026-12-12T09:00:00+05:30")))
				.andExpect(content().string(containsString("2026-12-12T16:00:00+05:30")))
				.andExpect(content().string(containsString("2026-12-12T21:00:00+05:30")))
				.andExpect(content().string(containsString("2026-12-13T08:00:00+05:30")))
				.andExpect(content().string(not(containsString("12:21"))))
				.andExpect(content().string(not(containsString("IIT"))))
				.andExpect(content().string(not(containsString("Amazon"))))
				.andExpect(content().string(not(containsString("Apple"))));
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
				.andExpect(view().name("wedding/home"));

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
