package com.studyflow.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StudyTypeDTO(
        Long id,
        @NotBlank(message = "Numele tipului de sesiune este obligatoriu")
        String name,

        @NotNull(message = "Durata sesiunii de focus este obligatorie")
        @Min(value = 1, message = "Durata minima de focus este 1 minut")
        Integer focusDurationMinutes,

        @NotNull(message = "Durata pauzei este obligatorie")
        @Min(value = 1, message = "Durata minima a pauzei este 1 minut")
        Integer shortBreakDurationMinutes,

        Integer longBreakDurationMinutes,
        Integer cyclesBeforeLongBreak
) {
}