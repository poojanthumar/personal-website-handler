package com.poojanthumar.websitehandler.wedding;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AttendanceConfirmation(
        @NotBlank @Size(max = 100) String name,
        @NotNull @Min(1) @Max(30) Integer partySize,
        @Size(max = 200) String website) {}
