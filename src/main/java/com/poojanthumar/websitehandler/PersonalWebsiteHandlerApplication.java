package com.poojanthumar.websitehandler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class PersonalWebsiteHandlerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersonalWebsiteHandlerApplication.class, args);
	}

}
