package com.studyflow.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @ManyToOne(optional = false)
    @JoinColumn(name = "study_type_id")
    private StudyType studyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Integer actualDurationMinutes;

    @Column(length = 1000)
    private String notes;

    public enum SessionStatus {
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    public StudySession() {}

    public StudySession(String subject, StudyType studyType, SessionStatus status, LocalDateTime startedAt, String notes) {
        this.subject = subject;
        this.studyType = studyType;
        this.status = status;
        this.startedAt = startedAt;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public StudyType getStudyType() { return studyType; }
    public void setStudyType(StudyType studyType) { this.studyType = studyType; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { this.endedAt = endedAt; }

    public Integer getActualDurationMinutes() { return actualDurationMinutes; }
    public void setActualDurationMinutes(Integer actualDurationMinutes) { this.actualDurationMinutes = actualDurationMinutes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}