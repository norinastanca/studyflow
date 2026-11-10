package com.studyflow.api.repository;

import com.studyflow.api.model.StudyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyTypeRepository extends JpaRepository<StudyType, Long> {
}