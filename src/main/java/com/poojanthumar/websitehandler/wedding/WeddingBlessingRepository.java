package com.poojanthumar.websitehandler.wedding;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WeddingBlessingRepository extends JpaRepository<WeddingBlessing, UUID> {
 Page<WeddingBlessing> findByStatus(String status, Pageable page);
}
