
import React, { useState } from 'react';
import { GameState, StatEvent } from '../types';
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
      className={`${isFeedback ? activeColor : colorClass} rounded-2xl py-6 px-2 font-black text-3xl active:scale-95 transition-all shadow-xl flex items-center justify-center min-h-[80px] border border-white/5 active:brightness-125 ${className}`}
    >
      {label}
    </button>
  );
};

const BasketballInterface: React.FC<InterfaceProps> = ({ score, onAddEvent, onBack, onShowSummary }) => {
  const handleAdd = (type: string, value: number = 0) => {
    onAddEvent({ type, value });
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="space-y-6 pt-2">
        <div className="relative flex items-center justify-center py-6">
          <button 
            onClick={onBack}
            className="absolute left-0 p-4 text-white bg-purple-700 rounded-2xl active:scale-90 transition-all shadow-lg shadow-purple-900/40 border border-purple-800 z-10"
            title="Exit"
          >
            <ArrowLeftIcon className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col items-center bg-black px-12 py-4 rounded-[2rem] border border-gray-800 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            <span className="text-[11px] font-black text-blue-500 tracking-[0.3em] uppercase leading-none mb-1">SCORE</span>
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

        {/* Made Grid */}
        <div className="space-y-2">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-2">Made</div>
          <div className="grid grid-cols-3 gap-4">
            <FeedbackButton label="3" colorClass="bg-blue-600 text-white" onClick={() => handleAdd('3PT_MAKE', 3)} />
            <FeedbackButton label="2" colorClass="bg-blue-600 text-white" onClick={() => handleAdd('2PT_MAKE', 2)} />
            <FeedbackButton label="1" colorClass="bg-blue-600 text-white" onClick={() => handleAdd('FT_MAKE', 1)} />
          </div>
        </div>

        {/* Misses Grid */}
        <div className="space-y-2">
          <div className="text-[10px] font-black text-red-500 uppercase tracking-widest px-2">Missed</div>
          <div className="grid grid-cols-3 gap-4">
            <FeedbackButton label="3" colorClass="bg-red-800/60 text-white" onClick={() => handleAdd('3PT_MISS')} />
            <FeedbackButton label="2" colorClass="bg-red-800/60 text-white" onClick={() => handleAdd('2PT_MISS')} />
            <FeedbackButton label="1" colorClass="bg-red-800/60 text-white" onClick={() => handleAdd('FT_MISS')} />
          </div>
        </div>

        {/* Action Grid */}
        <div className="space-y-2">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Actions</div>
          <div className="grid grid-cols-3 gap-4">
            <FeedbackButton label="REB" colorClass="bg-gray-800 text-gray-300 text-lg" onClick={() => handleAdd('REBOUND')} />
            <FeedbackButton label="STL" colorClass="bg-gray-800 text-gray-300 text-lg" onClick={() => handleAdd('STEAL')} />
            <FeedbackButton label="BLK" colorClass="bg-gray-800 text-gray-300 text-lg" onClick={() => handleAdd('BLOCK')} />
            <FeedbackButton label="AST" colorClass="bg-gray-800 text-gray-300 text-lg" onClick={() => handleAdd('ASSIST')} />
            <FeedbackButton label="FOUL" colorClass="bg-orange-700 text-white text-lg" activeColor="bg-red-600" onClick={() => handleAdd('FOUL')} />
            <FeedbackButton label="TO" colorClass="bg-red-900/80 text-white text-lg" onClick={() => handleAdd('TURNOVER')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketballInterface;
