package com.poojanthumar.websitehandler.contact;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessageEntity, UUID> {
}
