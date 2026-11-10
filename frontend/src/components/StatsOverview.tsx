import React from 'react';
import { Target, Flame, CheckCircle } from 'lucide-react';
import type { StudySession } from '../services/api';

interface Props {
  sessions: StudySession[];
}

export const StatsOverview: React.FC<Props> = ({ sessions }) => {
  const completedToday = sessions.filter((s) => {
    if (s.status !== 'COMPLETED') return false;
    const sessionDate = new Date(s.startedAt).toDateString();
    return sessionDate === new Date().toDateString();
  });

  const totalMinutesToday = completedToday.reduce((acc, curr) => acc + (curr.actualDurationMinutes || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-zinc-400 font-medium">Productivity numbers today</div>
          <div className="text-xl font-bold text-zinc-100">{totalMinutesToday} min</div>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-zinc-400 font-medium">Sessions Completed</div>
          <div className="text-xl font-bold text-zinc-100">{completedToday.length}</div>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-zinc-400 font-medium">Total Sessions</div>
          <div className="text-xl font-bold text-zinc-100">{sessions.length}</div>
        </div>
      </div>
    </div>
  );
};
