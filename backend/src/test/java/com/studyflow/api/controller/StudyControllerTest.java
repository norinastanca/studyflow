package com.studyflow.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyflow.api.dto.CreateSessionDTO;
import com.studyflow.api.exception.GlobalExceptionHandler;
import com.studyflow.api.exception.ResourceNotFoundException;
import com.studyflow.api.model.StudySession;
import com.studyflow.api.model.StudyType;
import com.studyflow.api.service.StudyService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudyController.class)
@Import(GlobalExceptionHandler.class)
class StudyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudyService studyService;

    @Test
    @DisplayName("GET /api/types - Trebuie sa returneze 200 OK si lista de tipuri")
    void getAllTypes_ShouldReturnHttp200() throws Exception {
        StudyType type = new StudyType("Pomodoro", 25, 5, 15, 4);
        when(studyService.getAllTypes()).thenReturn(List.of(type));

        mockMvc.perform(get("/api/types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Pomodoro"))
                .andExpect(jsonPath("$[0].focusDurationMinutes").value(25));
    }

    @Test
    @DisplayName("POST /api/sessions - Trebuie sa returneze 200 OK cand datele sunt valide")
    void startSession_ShouldReturnHttp200_WhenValid() throws Exception {
        CreateSessionDTO dto = new CreateSessionDTO("POO", 1L, "Pregatire test");
        StudyType type = new StudyType("Standard", 30, 5, 10, 3);
        StudySession session = new StudySession("POO", type, StudySession.SessionStatus.IN_PROGRESS, LocalDateTime.now(), "Pregatire test");

        when(studyService.startSession(any(CreateSessionDTO.class))).thenReturn(session);

        mockMvc.perform(post("/api/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject").value("POO"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    @DisplayName("PATCH /api/sessions/999/complete - Trebuie sa returneze 404 NOT FOUND prin GlobalExceptionHandler")
    void completeSession_ShouldReturnHttp404_WhenSessionNotFound() throws Exception {
        when(studyService.completeSession(999L))
                .thenThrow(new ResourceNotFoundException("Sesiunea nu a fost gasita."));

        mockMvc.perform(patch("/api/sessions/999/complete"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Sesiunea nu a fost gasita."));
    }
}
