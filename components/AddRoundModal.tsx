
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

  const isSpecial = contract === 250 || contract === 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scoreMade === '') {
      setError("Veuillez saisir les points réalisés.");
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Qui a pris */}
          <section>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Annonceur</label>
            <div className="grid grid-cols-2 gap-3">
              {[Team.Nous, Team.Eux].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBidder(t)}
                  className={`py-3 rounded-xl font-bold transition-all border-2 ${
                    bidder === t 
                      ? (t === Team.Nous ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300' : 'bg-amber-600/20 border-amber-500 text-amber-300')
                      : 'bg-slate-700 border-transparent text-slate-400'
                  }`}
                >
                  {t === Team.Nous ? teamNames.nous : teamNames.eux}
                </button>
              ))}
            </div>
          </section>

          {/* Atout */}
          <section>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Atout</label>
            <div className="grid grid-cols-6 gap-2">
              {Object.values(Suit).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSuit(s)}
                  className={`p-2 rounded-lg text-xl border-2 transition-all ${
                    suit === s ? 'bg-indigo-600/20 border-indigo-500 scale-110' : 'bg-slate-700 border-transparent hover:bg-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Contrat & Multiplicateurs */}
          <div className="grid grid-cols-2 gap-4">
            <section>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Contrat</label>
              <select
                value={contract}
                onChange={(e) => setContract(Number(e.target.value))}
                className="w-full bg-[#0c0c16] border border-solid border-slate-700 rounded-xl p-3 text-[44px] font-bold text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {contracts.map(c => (
                  <option key={c} value={c}>{c === 500 ? 'Générale' : c === 250 ? 'Capot' : c}</option>
                ))}
              </select>
            </section>
            
            <section className="flex flex-col justify-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-[23px] font-semibold text-[#ed1414]">
                <input type="checkbox" checked={checkedOff} onChange={e => { setCheckedOff(e.target.checked); if(e.target.checked) setOverridden(false); }} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500" />
                Coinché (x2)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[22px] font-semibold text-[#ff00e1]">
                <input type="checkbox" checked={overridden} onChange={e => { setOverridden(e.target.checked); if(e.target.checked) setCheckedOff(false); }} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-red-500" />
                Surcoinché (x4)
              </label>
            </section>
          </div>

          {/* Points */}
          <section>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Points réalisés par le preneur</label>
            {isSpecial ? (
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setScoreMade(contract)} className={`py-4 rounded-xl font-bold transition-all ${scoreMade === contract ? 'bg-green-600 text-white' : 'bg-slate-700'}`}>RÉUSSI</button>
                <button type="button" onClick={() => setScoreMade(0)} className={`py-4 rounded-xl font-bold transition-all ${scoreMade === 0 ? 'bg-red-600 text-white' : 'bg-slate-700'}`}>CHUTÉ</button>
              </div>
            ) : (
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Points preneur"
                  value={scoreMade}
                  onChange={(e) => setScoreMade(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-2xl font-black text-center text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
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
