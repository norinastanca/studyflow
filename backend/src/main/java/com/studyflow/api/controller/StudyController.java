package com.studyflow.api.controller;

import com.studyflow.api.dto.CreateSessionDTO;
import com.studyflow.api.dto.StudyTypeDTO;
import com.studyflow.api.model.StudySession;
import com.studyflow.api.model.StudyType;
import com.studyflow.api.service.StudyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StudyController {

    private final StudyService service;

    public StudyController(StudyService service) {
        this.service = service;
    }

    @GetMapping("/types")
    public List<StudyType> getTypes() {
        return service.getAllTypes();
    }

    @PostMapping("/types")
    public ResponseEntity<StudyType> createType(@RequestBody @Valid StudyTypeDTO dto) {
        return ResponseEntity.ok(service.createType(dto));
    }

    @GetMapping("/sessions")
    public List<StudySession> getSessions() {
        return service.getAllSessions();
    }

    @PostMapping("/sessions")
    public ResponseEntity<StudySession> startSession(@RequestBody @Valid CreateSessionDTO dto) {
        return ResponseEntity.ok(service.startSession(dto));
    }

    @PatchMapping("/sessions/{id}/complete")
    public ResponseEntity<StudySession> completeSession(@PathVariable Long id) {
        return ResponseEntity.ok(service.completeSession(id));
    }

    @PatchMapping("/sessions/{id}/cancel")
    public ResponseEntity<StudySession> cancelSession(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancelSession(id));
    }
}