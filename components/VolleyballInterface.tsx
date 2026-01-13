
import React, { useState } from 'react';
import { GameState, StatEvent } from '../types.ts';
import { ArrowLeftIcon, BoltIcon } from '@heroicons/react/24/solid';

interface InterfaceProps {
  game: GameState;
  score: number;
  onAddEvent: (event: Omit<StatEvent, 'id' | 'timestamp' | 'team'>) => void;
  onBack: () => void;
  onShowSummary: () => void;
}

const FeedbackButton: React.FC<{
  label: string;
  onClick: () => void;
  colorClass: string;
  activeColor?: string;
  className?: string;
}> = ({ label, onClick, colorClass, activeColor = 'bg-green-500', className = '' }) => {
  const [isFeedback, setIsFeedback] = useState(false);

  const handleClick = () => {
    setIsFeedback(true);
    onClick();
    setTimeout(() => setIsFeedback(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`${isFeedback ? activeColor : colorClass} rounded-2xl py-5 px-2 font-black text-xl uppercase active:scale-95 transition-all shadow-xl flex items-center justify-center min-h-[72px] border border-white/5 ${className}`}
    >
      {label}
    </button>
  );
};

const VolleyballInterface: React.FC<InterfaceProps> = ({ game, score, onAddEvent, onBack, onShowSummary }) => {
  const handleAdd = (type: string, value: number = 0) => {
    onAddEvent({ type, value });
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="space-y-4">
        <div className="relative flex items-center justify-center py-6">
          <button 
            onClick={onBack}
            className="absolute left-0 p-4 text-white bg-purple-700 rounded-2xl active:scale-90 transition-all shadow-lg shadow-purple-900/40 border border-purple-800 z-10"
            title="Exit"
          >
            <ArrowLeftIcon className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col items-center bg-black px-12 py-4 rounded-[2rem] border border-gray-800 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <span className="text-[11px] font-black text-purple-500 tracking-[0.3em] uppercase leading-none mb-1">POINTS</span>
            <span className="text-white font-black text-7xl leading-none tabular-nums tracking-tighter">{score}</span>
          </div>

          <button 
            onClick={onShowSummary}
            className="absolute right-0 p-4 text-black bg-yellow-400 rounded-2xl active:scale-90 transition-all shadow-lg shadow-yellow-900/40 border border-yellow-500 z-10"
            title="Summary"
          >
            <BoltIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1">
          <FeedbackButton label="POINT" colorClass="bg-blue-600 text-white py-12 text-4xl" onClick={() => handleAdd('POINT')} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FeedbackButton label="ACE" colorClass="bg-blue-800 text-white" onClick={() => handleAdd('ACE')} />
          <FeedbackButton label="KILL" colorClass="bg-blue-800 text-white" onClick={() => handleAdd('KILL')} />
          <FeedbackButton label="BLOCK" colorClass="bg-blue-800 text-white" onClick={() => handleAdd('BLOCK')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FeedbackButton label="GOOD SRV" colorClass="bg-gray-700 text-white" onClick={() => handleAdd('GOOD_SRV')} />
          <FeedbackButton label="BAD SRV" colorClass="bg-red-900/70 text-white" activeColor="bg-red-500" onClick={() => handleAdd('BAD_SRV')} />
          <FeedbackButton label="GOOD REC" colorClass="bg-gray-700 text-white" onClick={() => handleAdd('GOOD_REC')} />
          <FeedbackButton label="BAD REC" colorClass="bg-red-900/70 text-white" activeColor="bg-red-500" onClick={() => handleAdd('BAD_REC')} />
        </div>

        <div className="grid grid-cols-1">
          <FeedbackButton label="DIG" colorClass="bg-purple-700 text-white py-8 text-2xl" onClick={() => handleAdd('DIG')} />
        </div>
      </div>
    </div>
  );
};

export default VolleyballInterface;
