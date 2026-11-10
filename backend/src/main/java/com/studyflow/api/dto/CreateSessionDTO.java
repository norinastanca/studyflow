package com.studyflow.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSessionDTO(
        @NotBlank(message = "Materia sau subiectul este obligatoriu")
        String subject,

        @NotNull(message = "Trebuie selectat un tip de sesiune valid")
        Long studyTypeId,

        String notes
) {
}