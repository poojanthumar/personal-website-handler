package com.poojanthumar.websitehandler.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.poojanthumar.websitehandler.wedding.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class WeddingResponsesTest {
 @Autowired MockMvc mvc;
 @Autowired WeddingRsvpRepository rsvps;
 @Autowired WeddingBlessingRepository blessings;
 private static final String WEDDING="wedding.poojanthumar.in", ADMIN="admin.poojanthumar.in";

 @Test void rsvpPersistsPrivatelyAndSharedBlessingRequiresModeration() throws Exception {
  long count=rsvps.count();
  mvc.perform(post("/rsvp").header("Host",WEDDING).header("Accept","application/json").with(csrf())
    .param("name","Test Guest").param("familyName","Test Family").param("attendance","yes").param("partySize","3")
    .param("email","private@example.com").param("phone","1234567890").param("blessing","<script>test</script>").param("shareBlessing","true"))
    .andExpect(status().isCreated());
  assertThat(rsvps.count()).isEqualTo(count+1);
  var row=rsvps.findAll().stream().filter(r->r.getName().equals("Test Guest")).findFirst().orElseThrow();
  assertThat(row.getPartySize()).isEqualTo(3);
  var blessing=blessings.findAll().stream().filter(b->row.getId().equals(b.getRsvpId())).findFirst().orElseThrow();
  assertThat(blessing.getStatus()).isEqualTo("PENDING");
  String pending=mvc.perform(get("/guestbook").header("Host",WEDDING)).andReturn().getResponse().getContentAsString();
  assertThat(pending).doesNotContain("<script>test</script>","private@example.com");
  mvc.perform(post("/explorer/blessings/"+blessing.getId()+"/moderate").header("Host",ADMIN).with(httpBasic("admin","test-password")).with(csrf()).param("status","APPROVED"))
    .andExpect(status().is3xxRedirection());
  assertThat(blessings.findById(blessing.getId()).orElseThrow().getStatus()).isEqualTo("APPROVED");
  String approved=mvc.perform(get("/guestbook").header("Host",WEDDING)).andReturn().getResponse().getContentAsString();
  assertThat(approved).contains("&lt;script&gt;test&lt;/script&gt;").doesNotContain("<script>test</script>","private@example.com","1234567890");
  mvc.perform(post("/explorer/blessings/"+blessing.getId()+"/moderate").header("Host",ADMIN).with(httpBasic("admin","test-password")).with(csrf()).param("status","REJECTED"))
    .andExpect(status().is3xxRedirection());
  assertThat(mvc.perform(get("/guestbook").header("Host",WEDDING)).andReturn().getResponse().getContentAsString()).doesNotContain("&lt;script&gt;test&lt;/script&gt;");
 }
 @Test void privateBlessingsAreNotPublishedAndDeclinesHaveNoPartySize() throws Exception {
  long before=blessings.count();
  mvc.perform(post("/rsvp").header("Host",WEDDING).with(csrf()).param("name","Private Guest").param("familyName","Family").param("attendance","no").param("partySize","2").param("blessing","Private note"))
    .andExpect(redirectedUrl("/rsvp"));
  assertThat(blessings.count()).isEqualTo(before);
  assertThat(rsvps.findAll().stream().filter(r->r.getName().equals("Private Guest")).findFirst().orElseThrow().getPartySize()).isNull();
 }
 @Test void confirmsAttendanceWithoutAHouseholdAndCountsGuestsOnTheAdminHost() throws Exception {
  long before = rsvps.confirmedHeadcount();
  mvc.perform(post("/rsvp/confirm").header("Host", WEDDING).with(csrf())
      .param("name", "Attendance fixture").param("partySize", "4"))
    .andExpect(redirectedUrl("/rsvp#attendance"));
  mvc.perform(post("/rsvp/confirm").header("Host", WEDDING).header("Accept", "application/json").with(csrf())
      .param("name", "Invalid headcount").param("partySize", "0"))
    .andExpect(status().isBadRequest());
  mvc.perform(post("/rsvp/confirm").header("Host", "test-wedding.poojanthumar.in").with(csrf())
      .param("name", "Preview fixture").param("partySize", "3"))
    .andExpect(status().isForbidden());
  assertThat(rsvps.confirmedHeadcount()).isEqualTo(before + 4);

  mvc.perform(get("/wedding/rsvps").header("Host", WEDDING)).andExpect(status().isNotFound());
  mvc.perform(get("/wedding/rsvps").header("Host", ADMIN)).andExpect(status().is3xxRedirection());
  mvc.perform(get("/wedding/").header("Host", ADMIN).with(httpBasic("admin", "test-password")))
    .andExpect(redirectedUrl("/wedding/rsvps"));
  mvc.perform(get("/wedding/rsvps").header("Host", ADMIN).with(httpBasic("admin", "test-password")))
    .andExpect(status().isOk()).andExpect(model().attribute("headcount", before + 4))
    .andExpect(content().string(containsString("Attendance fixture")));
 }

 @Test void combinedPageShowsOnlySelectedBlessings() throws Exception {
  mvc.perform(post("/guestbook").header("Host", WEDDING).with(csrf())
      .param("name", "Guestbook fixture").param("message", "Have a wonderful day"))
    .andExpect(redirectedUrl("/rsvp#guestbook"));
  var blessing = blessings.findAll().stream().filter(row -> row.getName().equals("Guestbook fixture"))
    .findFirst().orElseThrow();
  mvc.perform(get("/rsvp").header("Host", WEDDING)).andExpect(status().isOk())
    .andExpect(content().string(not(containsString(blessing.getMessage()))));
  mvc.perform(get("/wedding/blessings").header("Host", ADMIN).with(httpBasic("admin", "test-password")))
    .andExpect(status().isOk()).andExpect(content().string(containsString(blessing.getMessage())));
  mvc.perform(post("/wedding/blessings/{id}/moderate", blessing.getId())
      .header("Host", "TEST-Admin.poojanthumar.in").with(httpBasic("admin", "test-password"))
      .with(csrf()).param("status", "APPROVED"))
    .andExpect(status().isForbidden());
  mvc.perform(post("/wedding/blessings/{id}/moderate", blessing.getId()).header("Host", ADMIN)
      .with(httpBasic("admin", "test-password")).with(csrf()).param("status", "APPROVED"))
    .andExpect(redirectedUrl("/wedding/blessings"));
  mvc.perform(get("/rsvp").header("Host", WEDDING)).andExpect(status().isOk())
    .andExpect(content().string(containsString(blessing.getMessage())));
 }
 @Test void validatesCsrfHostAdminAccessAndHoneypot() throws Exception {
  long before=blessings.count();
  mvc.perform(post("/guestbook").header("Host",WEDDING).param("name","Guest").param("message","Hello")).andExpect(status().isForbidden());
  mvc.perform(post("/guestbook").header("Host","www.poojanthumar.in").with(csrf()).param("name","Guest").param("message","Hello")).andExpect(status().isNotFound());
  mvc.perform(post("/guestbook").header("Host","test-wedding.poojanthumar.in").with(csrf()).param("name","Guest").param("message","Hello")).andExpect(status().isForbidden());
  mvc.perform(post("/guestbook").header("Host",WEDDING).header("Accept","application/json").with(csrf()).param("name"," ").param("message","Hello")).andExpect(status().isBadRequest());
  mvc.perform(post("/guestbook").header("Host",WEDDING).with(csrf()).param("name","Guest").param("message","Hello").param("website","spam")).andExpect(status().is3xxRedirection());
  assertThat(blessings.count()).isEqualTo(before);
  mvc.perform(get("/explorer/rsvps").header("Host",ADMIN)).andExpect(status().is3xxRedirection());
  mvc.perform(get("/explorer/rsvps").header("Host",WEDDING)).andExpect(status().isNotFound());
  for(String path:new String[]{"/explorer/rsvps","/explorer/blessings"})
   mvc.perform(get(path).header("Host",ADMIN).with(httpBasic("admin","test-password"))).andExpect(status().isOk());
 }
 @Test void rateLimitsRepeatedPublicSubmissions() throws Exception {
  for(int i=0;i<11;i++) mvc.perform(post("/guestbook").header("Host",WEDDING).header("Accept","application/json").with(csrf())
   .with(request->{request.setRemoteAddr("192.0.2.100");return request;}).param("name","Rate test").param("message","Test"))
   .andExpect(i<10?status().isCreated():status().isTooManyRequests());
 }
}
