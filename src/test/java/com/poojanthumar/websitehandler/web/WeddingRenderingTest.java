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
    void invitationRendersApprovedContentAndSuppliedDoorVideo() throws Exception {
        try (HttpClient client = HttpClient.newHttpClient()) {
            var response = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/"))
                    .GET().build(), HttpResponse.BodyHandlers.ofString());
            assertThat(response.statusCode()).isEqualTo(200);
            assertThat(response.body()).contains("Dhriti", "Desai", "Poojan", "Thumar",
                    "Deepa Desai", "Deepak Desai", "Asmita Thumar", "Sanjay Thumar",
                    "12 &amp; 13", "December 2026", "Praveg Tent City", "</footer>", "</html>");
            assertThat(response.body()).doesNotContain("IIT", "Amazon", "Apple", "started dating",
                    "Poojan &amp; Partner", "12:21", "shared desserts", "couple.jpg", "courtyard.jpg");

            assertThat(response.body()).contains("/video/wedding-doors.mp4", "/video/wedding-doors-hd.mp4", "muted playsinline", "door-skip");

            var events = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/events"))
                    .GET().build(), HttpResponse.BodyHandlers.ofString());
            assertThat(events.statusCode()).isEqualTo(200);
            assertThat(events.body()).contains("2026-12-12T09:00:00+05:30", "2026-12-12T13:00:00+05:30",
                    "2026-12-12T16:00:00+05:30", "2026-12-12T21:00:00+05:30",
                    "2026-12-13T08:00:00+05:30", "8 AM onwards", "data-event-stage",
                    "/images/wedding/events/sangeet-portrait.webp", "data-event-jump");
            assertThat(events.body()).doesNotContain("12:21", "Abhijit Muhurat", "We can’t wait to see you", "site-footer");

            for (String path : new String[] {"/rsvp", "/guestbook"}) {
                var page = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                        .GET().build(), HttpResponse.BodyHandlers.ofString());
                assertThat(page.statusCode()).as(path).isEqualTo(200);
                assertThat(page.body()).contains("method=\"post\"", "_csrf", "action=\"/rsvp/confirm\"", "action=\"/guestbook\"");
                assertThat(page.body()).doesNotContain("responses are not being saved yet");
            }
        }
    }

    @Test
    void stylesScriptAndOriginalArtAreServedAsPublicAssets() throws Exception {
        try (HttpClient client = HttpClient.newHttpClient()) {
            for (String path : new String[] {"/css/wedding-home.css", "/css/wedding-garden.css", "/css/wedding-responsive.css", "/video/wedding-doors.mp4", "/video/wedding-doors-hd.mp4", "/js/wedding-home.js", "/js/wedding-site.js", "/js/wedding-i18n.js",
                    "/images/wedding/real/couple-portraits.png", "/images/wedding/logo-1f.png", "/images/wedding/wedding-celebration.ics",
                    "/images/wedding/garden.jpg", "/images/wedding/garden/ganesh.webp", "/images/wedding/garden/envelope.webp", "/images/wedding/garden/doors-hd.jpg", "/images/wedding/scene-engagement.jpg",
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
