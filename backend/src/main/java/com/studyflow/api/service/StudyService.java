package com.studyflow.api.service;

import com.studyflow.api.dto.CreateSessionDTO;
import com.studyflow.api.dto.StudyTypeDTO;
import com.studyflow.api.exception.ResourceNotFoundException;
import com.studyflow.api.model.StudySession;
import com.studyflow.api.model.StudyType;
import com.studyflow.api.repository.StudySessionRepository;
import com.studyflow.api.repository.StudyTypeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudyService {

    private final StudyTypeRepository typeRepository;
    private final StudySessionRepository sessionRepository;

    public StudyService(StudyTypeRepository typeRepository, StudySessionRepository sessionRepository) {
        this.typeRepository = typeRepository;
        this.sessionRepository = sessionRepository;
    }

    @PostConstruct
    public void seedInitialData() {
        if (typeRepository.count() == 0) {
            typeRepository.save(new StudyType("Pomodoro Standard", 25, 5, 15, 4));
            typeRepository.save(new StudyType("Deep Work 90", 90, 20, 30, 2));
        }
    }

    @Transactional(readOnly = true)
    public List<StudyType> getAllTypes() {
        return typeRepository.findAll();
    }

    @Transactional
    public StudyType createType(StudyTypeDTO dto) {
        StudyType type = new StudyType(
                dto.name(),
                dto.focusDurationMinutes(),
                dto.shortBreakDurationMinutes(),
                dto.longBreakDurationMinutes(),
                dto.cyclesBeforeLongBreak()
        );
        return typeRepository.save(type);
    }

    @Transactional(readOnly = true)
    public List<StudySession> getAllSessions() {
        return sessionRepository.findAllByOrderByStartedAtDesc();
    }

    @Transactional
    public StudySession startSession(CreateSessionDTO dto) {
        StudyType type = typeRepository.findById(dto.studyTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipul de studiu cu ID-ul " + dto.studyTypeId() + " nu a fost găsit."));

        StudySession session = new StudySession(
                dto.subject(),
                type,
                StudySession.SessionStatus.IN_PROGRESS,
                LocalDateTime.now(),
                dto.notes()
        );

        return sessionRepository.save(session);
    }

    @Transactional
    public StudySession completeSession(Long id) {
        StudySession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesiunea de studiu cu ID-ul " + id + " nu a fost găsită."));

        session.setStatus(StudySession.SessionStatus.COMPLETED);
        session.setEndedAt(LocalDateTime.now());

        long minutes = Duration.between(session.getStartedAt(), session.getEndedAt()).toMinutes();
        session.setActualDurationMinutes((int) Math.max(1, minutes));

        return sessionRepository.save(session);
    }

    @Transactional
    public StudySession cancelSession(Long id) {
        StudySession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesiunea de studiu cu ID-ul " + id + " nu a fost găsită."));

        session.setStatus(StudySession.SessionStatus.CANCELLED);
        session.setEndedAt(LocalDateTime.now());

        return sessionRepository.save(session);
    }
}