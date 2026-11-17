package com.poojanthumar.websitehandler.wedding;

import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WeddingResponseService {
 private final WeddingRsvpRepository rsvps;
 private final WeddingBlessingRepository blessings;
 public WeddingResponseService(WeddingRsvpRepository rsvps, WeddingBlessingRepository blessings) {
  this.rsvps = rsvps; this.blessings = blessings;
 }
 @Transactional
 public void submit(RsvpRequest request) {
  WeddingRsvp row = new WeddingRsvp();
  row.setName(request.name().strip()); row.setFamilyName(request.familyName().strip());
  row.setAttendance(request.attendance()); row.setPartySize("no".equals(request.attendance()) ? null : request.partySize());
  row.setPhone(clean(request.phone())); row.setEmail(clean(request.email())); row.setBlessing(clean(request.blessing()));
  rsvps.save(row);
  if (Boolean.TRUE.equals(request.shareBlessing()) && row.getBlessing() != null) {
   WeddingBlessing blessing = pending(row.getName(), row.getFamilyName(), row.getBlessing());
   blessing.setRsvpId(row.getId()); blessings.save(blessing);
  }
 }
 @Transactional
 public void submit(BlessingRequest request) { blessings.save(pending(request.name().strip(), clean(request.relation()), request.message().strip())); }
 @Transactional
 public void moderate(UUID id, String status) {
  if (!java.util.Set.of("APPROVED", "REJECTED", "PENDING").contains(status)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
  WeddingBlessing row = blessings.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  row.setStatus(status); row.setModeratedAt(Instant.now());
 }
 private WeddingBlessing pending(String name, String relation, String message) {
  WeddingBlessing row = new WeddingBlessing(); row.setName(name); row.setRelation(relation); row.setMessage(message); row.setStatus("PENDING"); return row;
 }
 private String clean(String value) { return value == null || value.isBlank() ? null : value.strip(); }
}
