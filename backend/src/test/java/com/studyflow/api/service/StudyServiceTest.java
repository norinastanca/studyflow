package com.studyflow.api.service;

import com.studyflow.api.dto.CreateSessionDTO;
import com.studyflow.api.dto.StudyTypeDTO;
import com.studyflow.api.exception.ResourceNotFoundException;
import com.studyflow.api.model.StudySession;
import com.studyflow.api.model.StudyType;
import com.studyflow.api.repository.StudySessionRepository;
import com.studyflow.api.repository.StudyTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudyServiceTest {

    @Mock
    private StudyTypeRepository typeRepository;

    @Mock
    private StudySessionRepository sessionRepository;

    @InjectMocks
    private StudyService studyService;

    private StudyType sampleType;
    private StudySession sampleSession;

    @BeforeEach
    void setUp() {
        sampleType = new StudyType("Pomodoro", 25, 5, 15, 4);
        sampleSession = new StudySession(
                "Algoritmi",
                sampleType,
                StudySession.SessionStatus.IN_PROGRESS,
                LocalDateTime.now().minusMinutes(25),
                "Pregatire colocviu"
        );
    }

    @Test
    @DisplayName("Trebuie sa returneze toate tipurile de studiu din baza de date")
    void getAllTypes_ShouldReturnList() {
        when(typeRepository.findAll()).thenReturn(List.of(sampleType));

        List<StudyType> result = studyService.getAllTypes();

        assertEquals(1, result.size());
        assertEquals("Pomodoro", result.get(0).getName());
        verify(typeRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Trebuie sa creeze si sa salveze un nou tip de studiu")
    void createType_ShouldSaveAndReturnStudyType() {
        StudyTypeDTO dto = new StudyTypeDTO(1L,"Deep Work", 50, 10, 20, 3);
        when(typeRepository.save(any(StudyType.class))).thenAnswer(i -> i.getArgument(0));

        StudyType created = studyService.createType(dto);

        assertNotNull(created);
        assertEquals("Deep Work", created.getName());
        assertEquals(50, created.getFocusDurationMinutes());
        verify(typeRepository, times(1)).save(any(StudyType.class));
    }

    @Test
    @DisplayName("Trebuie sa porneasca o sesiune noua cand tipul de studiu exista")
    void startSession_ShouldSaveSession_WhenTypeExists() {
        CreateSessionDTO dto = new CreateSessionDTO("Structuri de Date", 1L, "Arbori AVL");
        when(typeRepository.findById(1L)).thenReturn(Optional.of(sampleType));
        when(sessionRepository.save(any(StudySession.class))).thenAnswer(i -> i.getArgument(0));

        StudySession started = studyService.startSession(dto);

        assertNotNull(started);
        assertEquals("Structuri de Date", started.getSubject());
        assertEquals(StudySession.SessionStatus.IN_PROGRESS, started.getStatus());
        assertEquals(sampleType, started.getStudyType());
        verify(sessionRepository, times(1)).save(any(StudySession.class));
    }

    @Test
    @DisplayName("Trebuie sa arunce ResourceNotFoundException la start daca tipul specificat nu exista")
    void startSession_ShouldThrowException_WhenTypeNotFound() {
        CreateSessionDTO dto = new CreateSessionDTO("Geometrie", 99L, null);
        when(typeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studyService.startSession(dto));
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Trebuie sa finalizeze sesiunea, calculand durata minima de 1 minut chiar daca a durat sub 60 secunde")
    void completeSession_ShouldEnsureMinimumOneMinuteDuration() {
        StudySession quickSession = new StudySession(
                "Test Rapid",
                sampleType,
                StudySession.SessionStatus.IN_PROGRESS,
                LocalDateTime.now(), // pornita chiar acum (0 minute diferenta)
                null
        );
        when(sessionRepository.findById(2L)).thenReturn(Optional.of(quickSession));
        when(sessionRepository.save(any(StudySession.class))).thenAnswer(i -> i.getArgument(0));

        StudySession completed = studyService.completeSession(2L);

        assertEquals(StudySession.SessionStatus.COMPLETED, completed.getStatus());
        assertEquals(1, completed.getActualDurationMinutes());
        assertNotNull(completed.getEndedAt());
    }

    @Test
    @DisplayName("Trebuie sa anuleze sesiunea si sa seteze statusul pe CANCELLED")
    void cancelSession_ShouldUpdateStatusToCancelled() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(sampleSession));
        when(sessionRepository.save(any(StudySession.class))).thenAnswer(i -> i.getArgument(0));

        StudySession cancelled = studyService.cancelSession(1L);

        assertEquals(StudySession.SessionStatus.CANCELLED, cancelled.getStatus());
        assertNotNull(cancelled.getEndedAt());
        verify(sessionRepository, times(1)).save(sampleSession);
    }
}