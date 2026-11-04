
import React, { useState, useEffect } from 'react';
import { Team, NewRoundData, Suit, Round } from '../types';
import { XMarkIcon } from './icons/Icons';

interface AddRoundModalProps {
  onClose: () => void;
  onSave: (data: NewRoundData, id?: number) => void;
  teamNames: { nous: string; eux: string };
  roundToEdit: Round | null;
}

const contracts = [82, 90, 100, 110, 120, 130, 140, 150, 160, 250, 500];

export const AddRoundModal: React.FC<AddRoundModalProps> = ({ onClose, onSave, teamNames, roundToEdit }) => {
  const [bidder, setBidder] = useState<Team>(Team.Nous);
  const [contract, setContract] = useState<number>(82);
  const [suit, setSuit] = useState<Suit>(Suit.Heart);
  const [scoreMade, setScoreMade] = useState<number | ''>('');
  const [opponentScore, setOpponentScore] = useState<number | ''>('');
  const [checkedOff, setCheckedOff] = useState<boolean>(false);
  const [overridden, setOverridden] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (roundToEdit) {
      setBidder(roundToEdit.bidder);
      setContract(roundToEdit.contract);
      setSuit(roundToEdit.suit);
      setScoreMade(roundToEdit.scoreMade);
      setOpponentScore(roundToEdit.opponentScore);
      setCheckedOff(roundToEdit.checkedOff);
      setOverridden(roundToEdit.overridden);
    }
  }, [roundToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scoreMade === '') {
      setError("Veuillez sélectionner si le contrat est RÉUSSI ou CHUTÉ.");
      return;
    }
    setError('');
    onSave({ 
      bidder, 
      contract, 
      suit, 
      scoreMade: Number(scoreMade), 
      opponentScore: Number(opponentScore || 0), 
      checkedOff, 
      overridden 
    }, roundToEdit?.id);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 overflow-hidden animate-slide-in-down">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-100">{roundToEdit ? 'Modifier le Tour' : 'Nouveau Tour'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Qui a pris */}
          <section>
            <div className="grid grid-cols-2 gap-3 py-2 px-1 items-center">
              {[Team.Nous, Team.Eux].map(t => {
                const isSelected = bidder === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBidder(t)}
                    className={`py-3.5 rounded-xl transition-all duration-200 border-2 active:scale-95 ${
                      isSelected 
                        ? 'bg-yellow-400 border-yellow-300 text-slate-950 font-black text-xl shadow-[0_0_25px_rgba(250,204,21,0.75)] ring-2 ring-yellow-400/60 scale-[1.2] relative z-20'
                        : 'bg-slate-700/80 border-transparent text-slate-400 hover:bg-slate-700 hover:text-slate-200 font-bold'
                    }`}
                  >
                    {t === Team.Nous ? teamNames.nous : teamNames.eux}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Atout */}
          <section>
            <div className="grid grid-cols-6 gap-2 py-3 px-1 items-center">
              {Object.values(Suit).map(s => {
                const isSelected = suit === s;
                const isRedSuit = s === Suit.Heart || s === Suit.Diamond;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSuit(s)}
                    className={`p-2 rounded-xl text-xl font-bold border-2 transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? `bg-yellow-400 border-yellow-300 ${isRedSuit ? 'text-red-600' : 'text-slate-950'} shadow-[0_0_25px_rgba(250,204,21,0.75)] ring-2 ring-yellow-400/60 scale-[1.75] relative z-20 text-2xl font-black`
                        : 'bg-slate-700 border-transparent hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Contrat & Multiplicateurs */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <section>
              <select
                value={contract}
                onChange={(e) => {
                  const newContract = Number(e.target.value);
                  setContract(newContract);
                  if (scoreMade !== '' && Number(scoreMade) > 0) {
                    setScoreMade(newContract);
                  }
                }}
                className="w-full bg-yellow-400 border-2 border-yellow-300 rounded-xl p-3 text-[44px] font-black text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.65)] ring-2 ring-yellow-300/80 focus:outline-none cursor-pointer transition-all"
              >
                {contracts.map(c => (
                  <option key={c} value={c} className="bg-slate-900 text-white font-bold text-xl py-1">{c === 500 ? 'Générale' : c === 250 ? 'Capot' : c}</option>
                ))}
              </select>
            </section>
            
            <section className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = !checkedOff;
                  setCheckedOff(next);
                  if (next) setOverridden(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl font-black text-sm sm:text-base transition-all active:scale-95 border-2 ${
                  checkedOff
                    ? 'bg-yellow-400 border-yellow-300 text-slate-950 shadow-lg shadow-yellow-400/40 ring-2 ring-yellow-400/50 scale-[1.02]'
                    : 'bg-slate-700/80 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Coinché (x2)
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = !overridden;
                  setOverridden(next);
                  if (next) setCheckedOff(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl font-black text-sm sm:text-base transition-all active:scale-95 border-2 ${
                  overridden
                    ? 'bg-yellow-400 border-yellow-300 text-slate-950 shadow-lg shadow-yellow-400/40 ring-2 ring-yellow-400/50 scale-[1.02]'
                    : 'bg-slate-700/80 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Surcoinché (x4)
              </button>
            </section>
          </div>

          {/* Points */}
          <section>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setScoreMade(contract); setError(''); }}
                className={`py-4 rounded-xl font-black text-lg transition-all active:scale-95 border-2 ${
                  scoreMade !== '' && Number(scoreMade) >= contract
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50 scale-[1.02]'
                    : 'bg-slate-700/80 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                RÉUSSI
              </button>
              <button
                type="button"
                onClick={() => { setScoreMade(0); setError(''); }}
                className={`py-4 rounded-xl font-black text-lg transition-all active:scale-95 border-2 ${
                  scoreMade !== '' && Number(scoreMade) < contract
                    ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400/50 scale-[1.02]'
                    : 'bg-slate-700/80 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                CHUTÉ
              </button>
            </div>
          </section>

          {error && <p className="text-red-400 text-sm font-bold text-center animate-pulse">{error}</p>}

          <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            VALIDER LE TOUR
          </button>
        </form>
      </div>
    </div>
  );
};
