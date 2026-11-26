package com.poojanthumar.websitehandler.wedding;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WeddingRsvpRepository extends JpaRepository<WeddingRsvp, UUID> {
    long countByAttendance(String attendance);

    @Query("select coalesce(sum(coalesce(r.partySize, 1)), 0) from WeddingRsvp r where r.attendance = 'yes'")
    long confirmedHeadcount();
}
