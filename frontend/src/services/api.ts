const BASE_URL = 'http://localhost:8080/api';

export interface StudyType {
  id: number;
  name: string;
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
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

export const api = {
  async getStudyTypes(): Promise<StudyType[]> {
    const res = await fetch(`${BASE_URL}/types`);
    if (!res.ok) throw new Error('Nu s-au putut încărca tipurile de sesiune');
    return res.json();
  },

  async getSessions(): Promise<StudySession[]> {
    const res = await fetch(`${BASE_URL}/sessions`);
    if (!res.ok) throw new Error('Nu s-au putut încărca sesiunile');
    return res.json();
  },

  async startSession(payload: { subject: string; studyTypeId: number; notes?: string }): Promise<StudySession> {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Eroare la pornirea sesiunii');
    return res.json();
  },

  async completeSession(id: number): Promise<StudySession> {
    const res = await fetch(`${BASE_URL}/sessions/${id}/complete`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Eroare la finalizarea sesiunii');
    return res.json();
  },

  async cancelSession(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/sessions/${id}/cancel`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Eroare la anularea sesiunii');
  },

  async createStudyType(payload: { name: string; focusDurationMinutes: number; shortBreakDurationMinutes: number }): Promise<StudyType> {
    const res = await fetch(`${BASE_URL}/types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Eroare la crearea noului tip');
    return res.json();
  }
};
