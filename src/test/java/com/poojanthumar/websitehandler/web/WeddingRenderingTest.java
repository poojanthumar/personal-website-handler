package com.poojanthumar.websitehandler.web;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "app.hosts.wedding=localhost,127.0.0.1", "app.hosts.www=www.poojanthumar.in"
})
@ActiveProfiles("test")
class WeddingRenderingTest {
    @LocalServerPort
    private int port;

    @Test
    void invitationRendersApprovedContentWithoutPrivateBiographyOrOldVideoFrames() throws Exception {
        try (HttpClient client = HttpClient.newHttpClient()) {
            var response = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/"))
                    .GET().build(), HttpResponse.BodyHandlers.ofString());
            assertThat(response.statusCode()).isEqualTo(200);
            assertThat(response.body()).contains("Dhriti", "Desai", "Poojan", "Thumar",
                    "2026-12-12T09:00:00+05:30", "2026-12-12T16:00:00+05:30",
                    "2026-12-12T21:00:00+05:30", "2026-12-13T08:00:00+05:30",
                    "2026-12-13T12:21:00+05:30", "</footer>", "</html>");
            assertThat(response.body()).doesNotContain("IIT", "Amazon", "Apple", "started dating",
                    "Poojan &amp; Partner", "couple.jpg", "courtyard.jpg", "<video");
        }
    }

    @Test
    void stylesScriptAndOriginalArtAreServedAsPublicAssets() throws Exception {
        try (HttpClient client = HttpClient.newHttpClient()) {
            for (String path : new String[] {"/css/wedding-home.css", "/js/wedding-home.js",
                    "/images/wedding/garden.jpg", "/images/wedding/scene-engagement.jpg",
                    "/images/wedding/scene-sangeet.jpg", "/images/wedding/scene-haldi.svg",
                    "/images/wedding/scene-wedding.svg"}) {
                var response = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                        .GET().build(), HttpResponse.BodyHandlers.ofByteArray());
                assertThat(response.statusCode()).as(path).isEqualTo(200);
                assertThat(response.body().length).as(path).isGreaterThan(100);
                assertThat(response.headers().firstValue("content-type").orElse(""))
                        .as(path).doesNotContain("text/html");
            }
        }
    }
}
