import React, { useState } from 'react';
import { GameHistoryItem, Team } from '../types';
import { XMarkIcon, TrophyIcon, TrashIcon } from './icons/Icons';

interface GameHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GameHistoryItem[];
  onDeleteGame: (id: string) => void;
  onClearHistory: () => void;
}

export const GameHistoryModal: React.FC<GameHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onDeleteGame,
  onClearHistory,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  // Calculs
  const totalRoundsPlayed = history.reduce((acc, g) => acc + g.totalRounds, 0);
  const avgRounds = history.length > 0 ? (totalRoundsPlayed / history.length).toFixed(1) : 0;

  const handleExportCSV = () => {
    if (!history || history.length === 0) return;

    const headers = [
      'Date',
      'Objectif_Points',
      'Equipe_1',
      'Score_Equipe_1',
      'Equipe_2',
      'Score_Equipe_2',
      'Equipe_Gagnante',
      'Ecart_Points',
      'Nombre_De_Manches',
    ];

    const escapeCSV = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = history.map((g) => [
      escapeCSV(g.formattedDate || g.date),
      escapeCSV(g.targetScore || 1000),
      escapeCSV(g.teamNous),
      escapeCSV(g.scoreNous),
      escapeCSV(g.teamEux),
      escapeCSV(g.scoreEux),
      escapeCSV(g.winnerName),
      escapeCSV(Math.abs(g.scoreNous - g.scoreEux)),
      escapeCSV(g.totalRounds),
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `belotin_historique_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-history-title"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrophyIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 id="game-history-title" className="text-lg sm:text-xl font-black text-white">
                Historique des parties
              </h2>
              <p className="text-xs text-slate-400">
                Données sauvegardées localement dans votre navigateur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
            aria-label="Fermer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">

          {/* Liste des parties */}
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Dernières parties enregistrées ({history.length})
              </h3>
              {history.length > 0 && !showClearConfirm && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="text-xs bg-emerald-700/80 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold shadow transition active:scale-95 flex items-center gap-1.5 border border-emerald-500/40"
                    title="Télécharger l'historique complet en fichier CSV pour analyse"
                  >
                    <span>Exporter CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 font-medium transition"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Tout effacer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Confirmation suppression totale */}
            {showClearConfirm && (
              <div className="p-3 mb-3 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-200">
                <span>Voulez-vous vraiment effacer tout l&apos;historique ?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-semibold"
                  >
                    Non
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setShowClearConfirm(false);
                    }}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 rounded text-white font-bold"
                  >
                    Oui, effacer
                  </button>
                </div>
              </div>
            )}

            {history.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-700/60 text-slate-400">
                <span className="text-4xl block mb-2">🃏</span>
                <p className="font-semibold text-slate-300">Aucune partie enregistrée pour le moment</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Les parties terminées (dès qu&apos;une équipe atteint 1 000 points) ou sauvegardées apparaîtront automatiquement ici avec la date et les scores.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((game) => {
                  const isNousWinner = game.winner === Team.Nous;
                  return (
                    <div
                      key={game.id}
                      className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-md hover:border-slate-600 transition"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 pb-2 border-b border-slate-800">
                        <span className="font-medium text-slate-300">📅 {game.formattedDate}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-bold px-2 py-0.5 rounded text-[11px]">
                            {(game.targetScore || 1000).toLocaleString('fr-FR')} pts
                          </span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-400">
                            {game.totalRounds} {game.totalRounds > 1 ? 'tours' : 'tour'}
                          </span>
                          <button
                            type="button"
                            onClick={() => onDeleteGame(game.id)}
                            className="p-1 hover:text-rose-400 text-slate-500 transition"
                            title="Supprimer cette partie"
                            aria-label="Supprimer"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Équipes & Scores */}
                      <div className="grid grid-cols-2 gap-3 items-center">
                        {/* Équipe Nous */}
                        <div
                          className={`p-3 rounded-lg border ${
                            isNousWinner
                              ? 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-500/40'
                              : 'bg-slate-800/40 border-slate-700/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-400 truncate max-w-[130px] sm:max-w-[180px]">
                              {game.teamNous}
                            </span>
                            {isNousWinner && <span className="text-xs font-bold text-yellow-400">🏆 Vainqueur</span>}
                          </div>
                          <p className={`text-2xl font-black mt-1 ${isNousWinner ? 'text-cyan-300' : 'text-slate-400'}`}>
                            {game.scoreNous} <span className="text-xs font-normal text-slate-400">pts</span>
                          </p>
                        </div>

                        {/* Équipe Eux */}
                        <div
                          className={`p-3 rounded-lg border ${
                            !isNousWinner
                              ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/40'
                              : 'bg-slate-800/40 border-slate-700/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-400 truncate max-w-[130px] sm:max-w-[180px]">
                              {game.teamEux}
                            </span>
                            {!isNousWinner && <span className="text-xs font-bold text-yellow-400">🏆 Vainqueur</span>}
                          </div>
                          <p className={`text-2xl font-black mt-1 ${!isNousWinner ? 'text-amber-300' : 'text-slate-400'}`}>
                            {game.scoreEux} <span className="text-xs font-normal text-slate-400">pts</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400 flex-wrap gap-2">
          <span>Moyenne : {avgRounds} manches / partie</span>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition active:scale-95 text-xs sm:text-sm flex items-center gap-1.5 shadow"
                title="Télécharger l'historique au format CSV pour Excel"
              >
                <span>Exporter CSV</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition active:scale-95 text-xs sm:text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
