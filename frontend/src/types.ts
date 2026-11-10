export interface StudyType {
  id: number;
  name: string;
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes?: number;
  cyclesBeforeLongBreak?: number;
}

export interface StudySession {
  id: number;
  subject: string;
  studyType: StudyType;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  endedAt?: string;
  actualDurationMinutes?: number;
  notes?: string;
}
