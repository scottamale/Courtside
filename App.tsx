import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameMetadata, GameState, StatEvent } from './types.ts';
import SetupForm from './components/SetupForm.tsx';
import BasketballInterface from './components/BasketballInterface.tsx';
import VolleyballInterface from './components/VolleyballInterface.tsx';
import SummaryModal from './components/SummaryModal.tsx';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [view, setView] = useState<'setup' | 'game'>('setup');
  const [game, setGame] = useState<GameState | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  // Timer State
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('courtside_last_game');
    const savedTimer = localStorage.getItem('courtside_timer');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGame(parsed);
        setView('game');
        if (savedTimer) setSeconds(parseInt(savedTimer, 10));
      } catch (e) {
        console.error("Failed to parse saved game", e);
      }
    }
  }, []);

  useEffect(() => {
    if (game) {
      localStorage.setItem('courtside_last_game', JSON.stringify(game));
      localStorage.setItem('courtside_timer', seconds.toString());
    }
  }, [game, seconds]);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const score = useMemo(() => {
    if (!game) return 0;
    if (game.metadata.sport === 'Basketball') {
      return game.events
        .filter(e => e.type === '3PT_MAKE' || e.type === '2PT_MAKE' || e.type === 'FT_MAKE')
        .reduce((acc, curr) => acc + (curr.value || 0), 0);
    } else {
      return game.events.filter(e => e.type === 'POINT').length;
    }
  }, [game]);

  const handleStartGame = (metadata: GameMetadata) => {
    setGame({
      metadata,
      events: []
    });
    setSeconds(0);
    setTimerActive(false);
    setView('game');
  };

  const handleResumeGame = () => {
    if ('vibrate' in navigator) navigator.vibrate(30);
    setView('game');
  };

  const handleAddEvent = useCallback((event: Omit<StatEvent, 'id' | 'timestamp' | 'team'>) => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    setGame(prev => {
      if (!prev) return null;
      const newEvent: StatEvent = {
        ...event,
        team: 'home',
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      return { ...prev, events: [...prev.events, newEvent] };
    });
  }, []);

  const handleManualStatUpdate = useCallback((_team: 'home' | 'away', type: string, delta: number, value?: number) => {
    if ('vibrate' in navigator) navigator.vibrate(30);
    setGame(prev => {
      if (!prev) return null;
      if (delta > 0) {
        const newEvent: StatEvent = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          type,
          team: 'home',
          value
        };
        return { ...prev, events: [...prev.events, newEvent] };
      } else {
        const lastIdx = [...prev.events].reverse().findIndex(e => e.type === type);
        if (lastIdx === -1) return prev;
        const actualIdx = prev.events.length - 1 - lastIdx;
        const newEvents = [...prev.events];
        newEvents.splice(actualIdx, 1);
        return { ...prev, events: newEvents };
      }
    });
  }, []);

  const handleUndo = useCallback(() => {
    if ('vibrate' in navigator) navigator.vibrate([30, 30]);
    setGame(prev => {
      if (!prev || prev.events.length === 0) return prev;
      return { ...prev, events: prev.events.slice(0, -1) };
    });
  }, []);

  const handleEndGame = () => {
    if (window.confirm("End this session? Data will be cleared.")) {
      localStorage.removeItem('courtside_last_game');
      localStorage.removeItem('courtside_timer');
      setGame(null);
      setView('setup');
      setSeconds(0);
      setTimerActive(false);
    }
  };

  const handleGoToSetup = () => {
    if ('vibrate' in navigator) navigator.vibrate(30);
    setView('setup');
  };

  const toggleTimer = () => {
    if ('vibrate' in navigator) navigator.vibrate(40);
    setTimerActive(!timerActive);
  };

  const handleResetTimer = () => {
    if (window.confirm("Reset timer?")) {
      setSeconds(0);
      setTimerActive(false);
    }
  };

  if (view === 'setup') {
    return <SetupForm onStart={handleStartGame} onResume={game ? handleResumeGame : undefined} />;
  }

  if (!game) return null;

  const isVolleyball = game.metadata.sport === 'Volleyball';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col select-none overflow-hidden font-sans">
      <header className="px-4 py-4 flex items-center justify-center bg-gray-950 border-b border-gray-900 sticky top-0 z-40 shadow-2xl">
        <div className="text-center">
          <span className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase block leading-none mb-1">Session Active</span>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{game.metadata.sport} Stats</h2>
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto relative ${isVolleyball ? 'pb-6' : 'pb-28'}`}>
        {game.metadata.sport === 'Basketball' ? (
          <BasketballInterface 
            game={game} 
            score={score}
            onAddEvent={handleAddEvent} 
            onBack={handleGoToSetup} 
            onShowSummary={() => setShowSummary(true)} 
          />
        ) : (
          <VolleyballInterface 
            game={game} 
            score={score}
            onAddEvent={handleAddEvent} 
            onBack={handleGoToSetup} 
            onShowSummary={() => setShowSummary(true)}
          />
        )}
      </main>

      {!isVolleyball && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-t border-gray-900 px-6 py-4 flex items-center justify-center z-[100] shadow-[0_-15px_40px_rgba(0,0,0,0.9)]">
          <div className="flex items-center w-full max-w-[340px] justify-between gap-4">
            <button 
              onClick={handleResetTimer}
              className="p-3 text-gray-500 hover:text-white transition-colors bg-gray-900 rounded-2xl shrink-0"
              title="Reset Timer"
            >
              <ArrowPathIcon className="w-6 h-6" />
            </button>

            <button 
              onClick={toggleTimer}
              className={`py-3 px-6 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl border-b-4 border-black/30 flex items-center justify-center flex-1 ${
                timerActive 
                  ? 'bg-green-600 shadow-green-900/30' 
                  : 'bg-red-700 shadow-red-900/30'
              }`}
            >
              <span className="text-3xl font-mono font-black tracking-tighter text-white drop-shadow-md leading-none">
                {formatTime(seconds)}
              </span>
            </button>
          </div>
        </footer>
      )}

      {showSummary && (
        <SummaryModal 
          game={game} 
          onClose={() => setShowSummary(false)} 
          onUpdateStat={handleManualStatUpdate}
          timerSeconds={seconds}
          timerActive={timerActive}
          onToggleTimer={toggleTimer}
          onResetTimer={handleResetTimer}
          onUndo={handleUndo}
          onEndGame={handleEndGame}
        />
      )}
    </div>
  );
};

export default App;