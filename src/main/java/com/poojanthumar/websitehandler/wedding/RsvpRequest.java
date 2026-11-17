package com.poojanthumar.websitehandler.wedding;

import jakarta.validation.constraints.*;
public record RsvpRequest(
 @NotBlank @Size(max=100) String name, @NotBlank @Size(max=100) String familyName,
 @NotNull @Pattern(regexp="yes|maybe|no") String attendance,
 @Min(1) @Max(30) Integer partySize, @Size(max=40) String phone,
 @Email @Size(max=254) String email, @Size(max=1500) String blessing,
 Boolean shareBlessing, @Size(max=200) String website) { }
