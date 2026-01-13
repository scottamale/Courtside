
import React from 'react';
import { GameState } from '../types';
import { XMarkIcon, PlusIcon, MinusIcon, ArrowPathIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

interface SummaryModalProps {
  game: GameState;
  onClose: () => void;
  onUpdateStat: (team: 'home' | 'away', type: string, delta: number, value?: number) => void;
  timerSeconds: number;
  timerActive: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onUndo: () => void;
  onEndGame: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ 
  game, 
  onClose, 
  onUpdateStat,
  timerSeconds,
  timerActive,
  onToggleTimer,
  onResetTimer,
  onUndo,
  onEndGame
}) => {
  const isVolleyball = game.metadata.sport === 'Volleyball';
  const findCount = (type: string) => 
    game.events.filter(e => e.type === type).length;

  const getPoints = () => {
    return (findCount('3PT_MAKE') * 3) + 
           (findCount('2PT_MAKE') * 2) + 
           (findCount('FT_MAKE') * 1);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPercentage = (makes: number, misses: number) => {
    const total = makes + misses;
    return total > 0 ? (makes / total * 100).toFixed(1) : '0.0';
  };

  const StatAdjuster = ({ 
    type, 
    value = 0, 
    pointsValue 
  }: { 
    type: string, 
    value: number, 
    pointsValue?: number 
  }) => (
    <div className="flex items-center justify-end space-x-3">
      <button 
        onClick={() => onUpdateStat('home', type, -1)}
        className="p-2 rounded-lg bg-gray-800 text-gray-400 active:bg-red-900 active:text-white transition-colors border border-gray-700"
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-black text-white tabular-nums text-xl">{value}</span>
      <button 
        onClick={() => onUpdateStat('home', type, 1, pointsValue)}
        className="p-2 rounded-lg bg-gray-800 text-gray-400 active:bg-blue-600 active:text-white transition-colors border border-gray-700"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pt-6 pb-2 border-b border-gray-800 mb-2">
      {title}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="w-full max-w-lg bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,1)] border border-gray-900 flex flex-col max-h-[92vh]">
        <header className="p-6 bg-gray-900/50 flex justify-between items-center border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">Stat Summary</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={onUndo}
              className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors border border-gray-700"
              title="Undo Last"
            >
              <ArrowUturnLeftIcon className="w-6 h-6 text-gray-300" />
            </button>
            <button onClick={onClose} className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-full transition-colors border border-gray-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2 custom-scrollbar">
          {game.metadata.sport === 'Basketball' ? (
            <div className="space-y-1">
              <div className="flex justify-between items-center py-4 border-b border-gray-800 mb-2">
                <span className="text-lg font-black text-[#2563EB] uppercase italic">Total Points</span>
                <span className="text-4xl font-black text-white tabular-nums">{getPoints()}</span>
              </div>

              <SectionTitle title="Efficiency" />
              <div className="grid grid-cols-2 py-3 border-b border-gray-800/50 text-sm items-center text-yellow-500 font-black uppercase tracking-wider">
                <div>Field Goal %</div>
                <div className="text-right text-2xl">{getPercentage(findCount('3PT_MAKE') + findCount('2PT_MAKE'), findCount('3PT_MISS') + findCount('2PT_MISS'))}%</div>
              </div>
              <div className="grid grid-cols-2 py-3 border-b border-gray-800/50 text-sm items-center text-yellow-500 font-black uppercase tracking-wider">
                <div>Free Throw %</div>
                <div className="text-right text-2xl">{getPercentage(findCount('FT_MAKE'), findCount('FT_MISS'))}%</div>
              </div>

              <SectionTitle title="Makes" />
              {[
                { label: '3-Point Makes', type: '3PT_MAKE', val: 3, color: 'text-green-500' },
                { label: '2-Point Makes', type: '2PT_MAKE', val: 2, color: 'text-green-500' },
                { label: 'Free Throws', type: 'FT_MAKE', val: 1, color: 'text-green-500' }
              ].map(s => (
                <div key={s.type} className="flex justify-between items-center py-2.5 border-b border-gray-800/30">
                  <div className={`${s.color} font-black uppercase text-xs tracking-widest`}>{s.label}</div>
                  <StatAdjuster type={s.type} value={findCount(s.type)} pointsValue={s.val} />
                </div>
              ))}

              <SectionTitle title="Misses" />
              {[
                { label: '3-Point Miss', type: '3PT_MISS' },
                { label: '2-Point Miss', type: '2PT_MISS' },
                { label: 'Free Throw Miss', type: 'FT_MISS' }
              ].map(s => (
                <div key={s.type} className="flex justify-between items-center py-2.5 border-b border-gray-800/30 text-xs">
                  <div className="text-red-500 font-black uppercase tracking-widest">{s.label}</div>
                  <StatAdjuster type={s.type} value={findCount(s.type)} />
                </div>
              ))}

              <SectionTitle title="Activities" />
              {[
                { label: 'Rebounds', type: 'REBOUND' },
                { label: 'Assists', type: 'ASSIST' },
                { label: 'Steals', type: 'STEAL' },
                { label: 'Blocks', type: 'BLOCK' },
                { label: 'Turnovers', type: 'TURNOVER' },
                { label: 'Fouls', type: 'FOUL' }
              ].map(s => (
                <div key={s.type} className="flex justify-between items-center py-2.5 border-b border-gray-800/30 text-xs">
                  <div className="text-gray-300 font-black uppercase tracking-widest">{s.label}</div>
                  <StatAdjuster type={s.type} value={findCount(s.type)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
               <div className="flex justify-between items-center py-6 border-b border-gray-800 mb-4">
                <span className="text-2xl font-black text-purple-500 uppercase italic">Total Points</span>
                <span className="text-6xl font-black text-white tabular-nums">{findCount('POINT')}</span>
              </div>

              <SectionTitle title="Offense" />
              {[
                { label: 'Aces', type: 'ACE' },
                { label: 'Kills', type: 'KILL' },
                { label: 'Good Serves', type: 'GOOD_SRV' },
                { label: 'Bad Serves', type: 'BAD_SRV', color: 'text-red-500' }
              ].map(s => (
                <div key={s.type} className="flex justify-between items-center py-3 border-b border-gray-800/30">
                  <div className={`${s.color || 'text-white'} font-black uppercase text-xs tracking-widest`}>{s.label}</div>
                  <StatAdjuster type={s.type} value={findCount(s.type)} />
                </div>
              ))}
              
              <SectionTitle title="Defense" />
              {[
                { label: 'Blocks', type: 'BLOCK' },
                { label: 'Digs', type: 'DIG' },
                { label: 'Good Rec.', type: 'GOOD_REC' },
                { label: 'Bad Rec.', type: 'BAD_REC', color: 'text-red-500' }
              ].map(s => (
                <div key={s.type} className="flex justify-between items-center py-3 border-b border-gray-800/30">
                  <div className={`${s.color || 'text-white'} font-black uppercase text-xs tracking-widest`}>{s.label}</div>
                  <StatAdjuster type={s.type} value={findCount(s.type)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="p-6 bg-gray-900 border-t border-gray-800 space-y-4">
          {!isVolleyball && (
            <div className="flex items-center justify-center space-x-6 pb-2">
              <button 
                onClick={onResetTimer}
                className="p-3 text-gray-500 hover:text-white transition-colors bg-gray-800 rounded-xl border border-gray-700"
                title="Reset Timer"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={onToggleTimer}
                className={`py-2 px-6 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl border-b-4 border-black/30 flex items-center justify-center min-w-[120px] ${
                  timerActive 
                    ? 'bg-green-600 shadow-green-900/30' 
                    : 'bg-red-700 shadow-red-900/30'
                }`}
              >
                <span className="text-2xl font-mono font-black tracking-tighter text-white drop-shadow-md leading-none">
                  {formatTime(timerSeconds)}
                </span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onEndGame}
              className="bg-red-950/40 hover:bg-red-900/60 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center border border-red-900/30"
            >
              End Session
            </button>
            <button 
              onClick={onClose}
              className="bg-[#2563EB] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-sm flex items-center justify-center"
            >
              Return
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SummaryModal;
