import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { StudySession } from '../services/api';

interface Props {
  sessions: StudySession[];
}

export const SessionHistory: React.FC<Props> = ({ sessions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = sessions.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studyType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-200">Jurnal de Studiu</h3>
          <p className="text-xs text-zinc-400">Istoricul complet sincronizat cu PostgreSQL</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrează după materie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 placeholder-zinc-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-950/70 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3">Materie / Subiect</th>
              <th className="px-4 py-3">Tip Sesiune</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Durată</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-normal">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-500 text-xs">
                  Nu a fost găsită nicio sesiune.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-100">{s.subject}</div>
                    {s.notes && <div className="text-xs text-zinc-500">{s.notes}</div>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{s.studyType.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide ${
                        s.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : s.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 text-xs font-mono">
                    {s.actualDurationMinutes ? `${s.actualDurationMinutes} min` : '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {new Date(s.startedAt).toLocaleString('ro-RO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
