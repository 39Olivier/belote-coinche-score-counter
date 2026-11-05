import React, { useState, useEffect, useRef } from 'react';
import { Team, Round, Suit } from '../types';
import { PencilIcon, TrashIcon, PlusCircleIcon } from './icons/Icons';

interface ScoreboardProps {
  totals: { nous: number; eux: number };
  rounds: Round[];
  winner: Team | null;
  teamNames: { nous: string; eux: string };
  targetScore?: number;
  onEditTargetScore?: () => void;
  onDeleteRound: (roundId: number) => void;
  onStartEdit: (round: Round) => void;
  onAddRound?: () => void;
  winnerBanner?: React.ReactNode;
}

const SuitDisplay: React.FC<{ suit: Suit }> = ({ suit }) => {
    const isRed = suit === Suit.Heart || suit === Suit.Diamond;
    const colorClass = isRed ? 'text-red-500' : 'text-slate-300';
    return <span className={`text-xl ${colorClass}`}>{suit}</span>
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ totals, rounds, winner, teamNames, targetScore = 1000, onEditTargetScore, onDeleteRound, onStartEdit, onAddRound, winnerBanner }) => {
  const [animateNous, setAnimateNous] = useState(false);
  const [animateEux, setAnimateEux] = useState(false);
  const isInitialNous = useRef(true);
  const isInitialEux = useRef(true);

  useEffect(() => {
    if (isInitialNous.current) {
      isInitialNous.current = false;
      return;
    }
    setAnimateNous(true);
    const timer = setTimeout(() => setAnimateNous(false), 500);
    return () => clearTimeout(timer);
  }, [totals.nous]);

  useEffect(() => {
    if (isInitialEux.current) {
      isInitialEux.current = false;
      return;
    }
    setAnimateEux(true);
    const timer = setTimeout(() => setAnimateEux(false), 500);
    return () => clearTimeout(timer);
  }, [totals.eux]);

  return (
    <div className="bg-slate-800/50 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      {/* Total Scores */}
      <div className="grid grid-cols-2 text-center items-stretch">
        <div className={`p-4 sm:p-6 flex flex-col justify-between h-full ${winner === Team.Nous ? 'bg-green-800/50' : ''}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 uppercase tracking-wide break-words flex items-center justify-center flex-1 min-h-[3.5rem]">
            {teamNames.nous}
          </h2>
          <p className={`text-5xl font-bold text-cyan-400 tracking-wider mt-auto pt-2 ${animateNous ? 'animate-score-pop' : ''}`}>
            {totals.nous}
          </p>
        </div>
        <div className={`p-4 sm:p-6 border-l border-slate-700 flex flex-col justify-between h-full ${winner === Team.Eux ? 'bg-green-800/50' : ''}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 uppercase tracking-wide break-words flex items-center justify-center flex-1 min-h-[3.5rem]">
            {teamNames.eux}
          </h2>
          <p className={`text-5xl font-bold text-amber-400 tracking-wider mt-auto pt-2 ${animateEux ? 'animate-score-pop' : ''}`}>
            {totals.eux}
          </p>
        </div>
      </div>

      {/* Round History */}
      <div className="bg-slate-900/70 p-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-center gap-2.5 mb-4 sticky top-0 bg-slate-900/95 py-2.5 z-10 border-b border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-slate-300">
            Partie en <span className="text-indigo-400 font-extrabold">{targetScore.toLocaleString('fr-FR')} points</span>
          </h3>
          {onEditTargetScore && (
            <button
              type="button"
              onClick={onEditTargetScore}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 rounded-lg transition-all flex items-center gap-1 active:scale-95 shadow-sm font-semibold"
              title="Modifier l'objectif de score ou les joueurs"
            >
              <span>Modifier</span>
            </button>
          )}
        </div>

        {/* Partie gagnée : juste en-dessous de la div "Partie en X points" */}
        {winnerBanner && (
          <div className="mb-4 animate-fade-in-fast">
            {winnerBanner}
          </div>
        )}

        {/* Bouton Ajouter une manche au-dessus des manches (composants LI) */}
        {onAddRound && !winner && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onAddRound}
              className="group w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2.5"
            >
              <PlusCircleIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="text-sm sm:text-base">Ajouter une manche</span>
            </button>
          </div>
        )}

        {rounds.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Aucune manche jouée pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {rounds.map((round) => (
              <li
                key={round.id}
                className={`bg-slate-800/90 rounded-xl p-3 border border-slate-700/60 shadow-md ${round.animationClass ?? ''}`}
              >
                <div className="flex items-center justify-between gap-2 text-lg">
                  {/* Score Nous */}
                  <span className="font-extrabold text-cyan-400 w-16 sm:w-20 text-center text-xl">
                    {round.nous}
                  </span>

                  {/* Contract info */}
                  <div className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg flex-1 text-center text-xs sm:text-sm ${
                    round.bidder === Team.Nous ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40' : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                  }`}>
                    {round.checkedOff && <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full" title="Coinché">C</span>}
                    {round.overridden && <span className="text-[10px] font-black bg-purple-600 text-white px-1.5 py-0.5 rounded-full" title="Surcoinché">S</span>}
                    <span className="font-bold">{round.contract === 500 ? 'Générale' : round.contract === 250 ? 'Capot' : round.contract}</span>
                    <SuitDisplay suit={round.suit} />
                  </div>

                  {/* Score Eux */}
                  <span className="font-extrabold text-amber-400 w-16 sm:w-20 text-center text-xl">
                    {round.eux}
                  </span>

                  {/* Actions: Visibles en permanence sans masquer les points */}
                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700/60 flex-shrink-0">
                    <button
                      onClick={() => onStartEdit(round)}
                      className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition shadow-sm active:scale-95"
                      title="Modifier le tour"
                      aria-label="Modifier le tour"
                    >
                      <PencilIcon className="w-4 h-4 pointer-events-none" />
                    </button>
                    <button
                      onClick={() => onDeleteRound(round.id)}
                      className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-rose-600 text-slate-300 hover:text-white transition shadow-sm active:scale-95"
                      title="Supprimer le tour"
                      aria-label="Supprimer le tour"
                    >
                      <TrashIcon className="w-4 h-4 pointer-events-none" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};