package com.poojanthumar.websitehandler.wedding;

import jakarta.validation.constraints.*;
public record BlessingRequest(@NotBlank @Size(max=100) String name,
 @Size(max=100) String relation, @NotBlank @Size(max=1500) String message,
 @Size(max=200) String website) { }
