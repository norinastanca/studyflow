import React from 'react';
import { Clock, Coffee } from 'lucide-react';
import type { StudyType } from '../services/api';

interface Props {
  types: StudyType[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  disabled: boolean;
}

export const TypeSelector: React.FC<Props> = ({ types, selectedId, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {types.map((t) => {
        const isSelected = selectedId === t.id;
        return (
          <button
            key={t.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(t.id)}
            className={`p-4 rounded-xl text-left border transition-all duration-150 ${
              isSelected
                ? 'bg-amber-500/10 border-amber-500/80 shadow-sm'
                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`text-sm font-semibold ${isSelected ? 'text-amber-400' : 'text-zinc-200'}`}>
              {t.name}
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.focusDurationMinutes}m focus</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.shortBreakDurationMinutes}m chill</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};