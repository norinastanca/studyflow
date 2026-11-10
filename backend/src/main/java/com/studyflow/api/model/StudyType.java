package com.studyflow.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "study_types")
public class StudyType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Integer focusDurationMinutes;

    @Column(nullable = false)
    private Integer shortBreakDurationMinutes;

    private Integer longBreakDurationMinutes;

    private Integer cyclesBeforeLongBreak;

    public StudyType() {}

    public StudyType(String name, Integer focusDurationMinutes, Integer shortBreakDurationMinutes, Integer longBreakDurationMinutes, Integer cyclesBeforeLongBreak) {
        this.name = name;
        this.focusDurationMinutes = focusDurationMinutes;
        this.shortBreakDurationMinutes = shortBreakDurationMinutes;
        this.longBreakDurationMinutes = longBreakDurationMinutes;
        this.cyclesBeforeLongBreak = cyclesBeforeLongBreak;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getFocusDurationMinutes() { return focusDurationMinutes; }
    public void setFocusDurationMinutes(Integer focusDurationMinutes) { this.focusDurationMinutes = focusDurationMinutes; }

    public Integer getShortBreakDurationMinutes() { return shortBreakDurationMinutes; }
    public void setShortBreakDurationMinutes(Integer shortBreakDurationMinutes) { this.shortBreakDurationMinutes = shortBreakDurationMinutes; }

    public Integer getLongBreakDurationMinutes() { return longBreakDurationMinutes; }
    public void setLongBreakDurationMinutes(Integer longBreakDurationMinutes) { this.longBreakDurationMinutes = longBreakDurationMinutes; }

    public Integer getCyclesBeforeLongBreak() { return cyclesBeforeLongBreak; }
    public void setCyclesBeforeLongBreak(Integer cyclesBeforeLongBreak) { this.cyclesBeforeLongBreak = cyclesBeforeLongBreak; }
}