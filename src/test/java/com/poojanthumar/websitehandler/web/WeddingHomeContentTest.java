package com.poojanthumar.websitehandler.web;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.ui.ExtendedModelMap;

import com.poojanthumar.websitehandler.config.Site;
import com.poojanthumar.websitehandler.config.SiteResolver;
import com.poojanthumar.websitehandler.contact.ContactService;
import com.poojanthumar.websitehandler.wedding.WeddingContentService;

class WeddingHomeContentTest {
	@Test
	void weddingHomeDoesNotReadDatabaseContent() {
		var resolver = mock(SiteResolver.class);
		var wedding = mock(WeddingContentService.class);
		var contact = mock(ContactService.class);
		var request = new MockHttpServletRequest();
		when(resolver.resolve(request)).thenReturn(Site.WEDDING);
		var controller = new RootController(resolver, wedding, contact);
		assertEquals("wedding/home", controller.home(request, new ExtendedModelMap()));
		verifyNoInteractions(wedding, contact);
	}
}
