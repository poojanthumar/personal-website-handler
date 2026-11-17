package com.poojanthumar.websitehandler.wedding;

import java.time.Instant;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(name="wedding_blessings")
public class WeddingBlessing {
 @Id private UUID id = UUID.randomUUID();
 @Column(nullable=false)
 private Instant receivedAt = Instant.now();
 private UUID rsvpId;
 @Column(length=100, nullable=false)
 private String name;
 @Column(length=100)
 private String relation;
 @Column(length=1500, nullable=false)
 private String message;
 @Column(length=10, nullable=false)
 private String status;
 private Instant moderatedAt;
 public UUID getId() { return id; }
 public Instant getReceivedAt() { return receivedAt; }
 public UUID getRsvpId() { return rsvpId; }
 public void setRsvpId(UUID value) { rsvpId = value; }
 public String getName() { return name; }
 public void setName(String value) { name = value; }
 public String getRelation() { return relation; }
 public void setRelation(String value) { relation = value; }
 public String getMessage() { return message; }
 public void setMessage(String value) { message = value; }
 public String getStatus() { return status; }
 public void setStatus(String value) { status = value; }
 public Instant getModeratedAt() { return moderatedAt; }
 public void setModeratedAt(Instant value) { moderatedAt = value; }
}
