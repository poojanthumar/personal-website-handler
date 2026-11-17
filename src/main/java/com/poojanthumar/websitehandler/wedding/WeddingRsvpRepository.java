package com.poojanthumar.websitehandler.wedding;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WeddingRsvpRepository extends JpaRepository<WeddingRsvp, UUID> { }
