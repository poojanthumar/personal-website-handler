package com.poojanthumar.websitehandler.wedding;

import java.time.Instant;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(name="wedding_rsvps")
public class WeddingRsvp {
 @Id private UUID id = UUID.randomUUID();
 @Column(nullable=false)
 private Instant receivedAt = Instant.now();
 @Column(length=100, nullable=false)
 private String name;
 @Column(length=100, nullable=false)
 private String familyName;
 @Column(length=5, nullable=false)
 private String attendance;
 private Integer partySize;
 @Column(length=40)
 private String phone;
 @Column(length=254)
 private String email;
 @Column(length=1500)
 private String blessing;
 public UUID getId() { return id; }
 public Instant getReceivedAt() { return receivedAt; }
 public String getName() { return name; }
 public void setName(String value) { name = value; }
 public String getFamilyName() { return familyName; }
 public void setFamilyName(String value) { familyName = value; }
 public String getAttendance() { return attendance; }
 public void setAttendance(String value) { attendance = value; }
 public Integer getPartySize() { return partySize; }
 public void setPartySize(Integer value) { partySize = value; }
 public String getPhone() { return phone; }
 public void setPhone(String value) { phone = value; }
 public String getEmail() { return email; }
 public void setEmail(String value) { email = value; }
 public String getBlessing() { return blessing; }
 public void setBlessing(String value) { blessing = value; }
}
