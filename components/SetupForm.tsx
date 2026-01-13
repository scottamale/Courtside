
import React, { useState } from 'react';
import { GameMetadata, Sport } from '../types';

interface SetupFormProps {
  onStart: (metadata: GameMetadata) => void;
  onResume?: () => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onStart, onResume }) => {
  const [sport, setSport] = useState<Sport>('Basketball');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ sport });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#2563EB] mb-2 italic tracking-tighter">COURTSIDE</h1>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Select a sport to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={() => setSport('Basketball')}
              className={`py-6 rounded-2xl font-black text-xl transition-all border-2 flex flex-col items-center justify-center space-y-2 ${
                sport === 'Basketball' 
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg shadow-blue-900/40 scale-[1.02]' 
                  : 'bg-gray-800 border-gray-800 text-gray-500 hover:border-gray-700'
              }`}
            >
              <span>BASKETBALL</span>
            </button>
            <button
              type="button"
              onClick={() => setSport('Volleyball')}
              className={`py-6 rounded-2xl font-black text-xl transition-all border-2 flex flex-col items-center justify-center space-y-2 ${
                sport === 'Volleyball' 
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg shadow-blue-900/40 scale-[1.02]' 
                  : 'bg-gray-800 border-gray-800 text-gray-500 hover:border-gray-700'
              }`}
            >
              <span>VOLLEYBALL</span>
            </button>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-800">
            <button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200 font-black py-5 rounded-2xl text-lg shadow-xl transition-all active:scale-95 uppercase tracking-widest"
            >
              Start Recording
            </button>
            {onResume && (
              <button
                type="button"
                onClick={onResume}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 border border-gray-700 uppercase text-sm tracking-widest"
              >
                Resume Session
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupForm;
