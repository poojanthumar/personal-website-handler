package com.poojanthumar.websitehandler.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	UserDetailsService userDetailsService(AppProperties properties, PasswordEncoder encoder) {
		String rawPassword = properties.getAdmin().getPassword();
		if (rawPassword == null || rawPassword.isBlank()) {
			throw new IllegalStateException("ADMIN_PASSWORD / app.admin.password must be set");
		}
		UserDetails admin = User.builder()
				.username(properties.getAdmin().getUsername())
				.password(encoder.encode(rawPassword))
				.roles("ADMIN")
				.build();
		return new InMemoryUserDetailsManager(admin);
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, SiteResolver siteResolver) throws Exception {
		RequestMatcher adminHost = request -> siteResolver.resolve(request) == Site.ADMIN;
		RequestMatcher apiPath = PathPatternRequestMatcher.pathPattern("/api/**");

		http.authorizeHttpRequests(auth -> auth
				.requestMatchers("/login", "/css/**", "/images/**", "/favicon.ico", "/actuator/health", "/error").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/contact", "/api/contact/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.PUT, "/api/contact/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.PATCH, "/api/contact/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/api/contact/**").hasRole("ADMIN")
				.requestMatchers(adminHost).hasRole("ADMIN")
				.anyRequest().permitAll());

		http.formLogin(form -> form
				.loginPage("/login")
				.defaultSuccessUrl("/", true)
				.permitAll());

		http.httpBasic(Customizer.withDefaults());

		http.logout(logout -> logout
				.logoutUrl("/logout")
				.logoutSuccessUrl("/login?logout")
				.permitAll());

		http.exceptionHandling(ex -> ex
				.defaultAuthenticationEntryPointFor(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED), apiPath)
				.defaultAuthenticationEntryPointFor(new LoginUrlAuthenticationEntryPoint("/login"), adminHost));

		http.csrf(csrf -> csrf.ignoringRequestMatchers(apiPath));

		return http.build();
	}
}
