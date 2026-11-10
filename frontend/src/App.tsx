import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle2, XCircle, Plus, BookOpen, Coffee } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { api } from './services/api';
import type { StudyType, StudySession } from './services/api';
import { TypeSelector } from './components/TypeSelector';
import { StatsOverview } from './components/StatsOverview';
import { SessionHistory } from './components/SessionHistory';

export default function App() {
  const [types, setTypes] = useState<StudyType[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);

  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  const [showModal, setShowModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newFocusMinutes, setNewFocusMinutes] = useState(40);
  const [newBreakMinutes, setNewBreakMinutes] = useState(10);

  const loadData = async () => {
    try {
      const [typesData, sessionsData] = await Promise.all([
        api.getStudyTypes(),
        api.getSessions(),
      ]);
      setTypes(typesData);
      setSessions(sessionsData);
      if (typesData.length > 0 && !selectedTypeId) {
        setSelectedTypeId(typesData[0].id);
        setSecondsLeft(typesData[0].focusDurationMinutes * 60);
      }
    } catch (err: any) {
      toast.error(err.message || "Couldn't reach the backend. Is Docker asleep?");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    } else if (secondsLeft === 0 && isRunning) {
      if (mode === 'FOCUS') {
        toast.success("Boom, you crushed it! Go touch some grass.", { duration: 6000 });
        const currentType = types.find((t) => t.id === selectedTypeId);
        setMode('BREAK');
        setSecondsLeft((currentType?.shortBreakDurationMinutes || 5) * 60);
      } else {
        toast.info("Break's over, back to the grind!", { duration: 6000 });
        const currentType = types.find((t) => t.id === selectedTypeId);
        setMode('FOCUS');
        setSecondsLeft((currentType?.focusDurationMinutes || 25) * 60);
        setIsRunning(false);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, mode, types, selectedTypeId]);

  const handleSelectType = (id: number) => {
    setSelectedTypeId(id);
    const chosen = types.find((t) => t.id === id);
    if (chosen && !activeSession) {
      setSecondsLeft(chosen.focusDurationMinutes * 60);
      setMode('FOCUS');
      setIsRunning(false);
    }
  };

  const handleStart = async () => {
    if (!subject.trim()) {
      toast.error("Hey, you gotta tell me what you're studying first!");
      return;
    }
    try {
      const session = await api.startSession({
        subject: subject.trim(),
        studyTypeId: selectedTypeId!,
        notes: notes.trim(),
      });
      setActiveSession(session);
      setIsRunning(true);
      toast.success(`Locked in on: ${session.subject}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleComplete = async () => {
    if (!activeSession) return;
    try {
      await api.completeSession(activeSession.id);
      toast.success('Session saved! Look at you being productive.');
      setIsRunning(false);
      setActiveSession(null);
      setSubject('');
      setNotes('');
      const currentType = types.find((t) => t.id === selectedTypeId);
      setSecondsLeft((currentType?.focusDurationMinutes || 25) * 60);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCancel = async () => {
    if (!activeSession) return;
    try {
      await api.cancelSession(activeSession.id);
      toast.info('Session scrapped. No worries, happens to the best of us.');
      setIsRunning(false);
      setActiveSession(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateCustomType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createStudyType({
        name: newTypeName,
        focusDurationMinutes: Number(newFocusMinutes),
        shortBreakDurationMinutes: Number(newBreakMinutes),
      });
      setShowModal(false);
      setNewTypeName('');
      toast.success(`Sweet! "${created.name}" is ready to roll.`);
      await loadData();
      handleSelectType(created.id);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-12 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Toaster position="top-right" richColors theme="dark" />
      
      <main className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                StudyFlow
              </h1>
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Lock in, track your hours, avoid cramming.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-amber-500/80 hover:text-amber-400 transition"
          >
            <Plus className="w-4 h-4" /> New Preset
          </button>
        </header>

        <StatsOverview sessions={sessions} />

        <section className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Pick your vibe</div>
          <TypeSelector
            types={types}
            selectedId={selectedTypeId}
            onSelect={handleSelectType}
            disabled={activeSession !== null}
          />
        </section>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-zinc-900 border border-zinc-800 text-zinc-300">
            {mode === 'FOCUS' ? <BookOpen className="w-3.5 h-3.5 text-amber-500" /> : <Coffee className="w-3.5 h-3.5 text-emerald-400" />}
            {mode === 'FOCUS' ? 'Focus Mode 🧠' : 'Chilling ☕'}
          </div>

          <div className="text-8xl md:text-9xl font-extrabold font-mono tracking-tighter text-zinc-100">
            {formatTimer(secondsLeft)}
          </div>

          {!activeSession ? (
            <div className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                placeholder="What are we working on? (e.g. Data Structures)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500/80"
              />
              <input
                type="text"
                placeholder="Got a quick goal? (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500/80"
              />
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm tracking-wide transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
              >
                <Play className="w-4 h-4 fill-current" /> Let's Do This
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-zinc-400 text-sm">
                Locked in on: <span className="font-semibold text-zinc-100 text-base">{activeSession.subject}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={handleComplete}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Done!
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 text-xs font-semibold flex items-center gap-2 transition"
                >
                  <XCircle className="w-4 h-4" /> Give Up
                </button>
              </div>
            </div>
          )}
        </div>

        <SessionHistory sessions={sessions} />

      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-100">Make your own preset</h3>
            <form onSubmit={handleCreateCustomType} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 font-medium">Preset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Panic"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Focus (mins)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFocusMinutes}
                    onChange={(e) => setNewFocusMinutes(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Break (mins)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newBreakMinutes}
                    onChange={(e) => setNewBreakMinutes(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300"
                >
                  Nevermind
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-zinc-950"
                >
                  Save It
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}