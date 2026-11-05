import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';

interface InfoGuideModalProps {
  initialTab?: 'cards' | 'rules' | 'author';
  onClose: () => void;
  nextStepLabel?: string;
  onNextStep?: () => void;
}

export const InfoGuideModal: React.FC<InfoGuideModalProps> = ({ 
  initialTab = 'cards', 
  onClose,
  nextStepLabel,
  onNextStep
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'rules' | 'author'>(initialTab);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleShareApp = async () => {
    const shareUrl = 'https://belote-coinche-score-counter.netlify.app';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Belotin Compteur pour Belote Coinchée !',
          text: 'Découvrez cette super appli pour compter les points de Belote Coinchée et le Belotin !',
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Dialogue fermé
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch (err) {
      window.prompt('Copiez le lien pour partager :', shareUrl);
    }
  };

  const cardValues = {
    headers: ['7', '8', '9', '10', 'V', 'D', 'R', 'AS'],
    rows: [
      { suit: 'HORS ATOUT', values: ['0', '0', '0', '10', '2', '3', '4', '11'], badge: '162 pts' },
      { suit: 'ATOUT', values: ['0', '0', '14', '10', '20', '3', '4', '11'], badge: '162 pts' },
      { suit: 'SANS ATOUT (SA)', values: ['0', '0', '0', '10', '2', '3', '4', '19'], badge: '130 pts' },
      { suit: 'TOUT ATOUT (TA)', values: ['0', '0', '9', '5', '14', '1', '3', '6'], badge: '162 pts' },
    ],
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[70] animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
      aria-label="Guide et Règles"
    >
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-700 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header with Tabs */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-700 bg-slate-800/95 gap-3">
          <div className="flex items-center gap-2 w-full justify-between flex-wrap">
            {/* Tab switchers */}
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700 text-xs font-semibold flex-wrap gap-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'cards'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Valeur Cartes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rules')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'rules'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Règles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('author')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'author'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Créateur
              </button>
              <a
                href="https://exoty.com/belote"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap"
                title="Jouer à la Belote & Coinche en ligne gratuitement sur Exoty"
              >
                <span>Jouer en ligne ↗</span>
              </a>
              <a
                href="https://www.jeujura.fr/accessoires-pour-jeux/9026-de-belote-de-d-atout-en-bois.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all text-amber-400 hover:text-amber-300 hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap"
                title="Acheter un dé Belotin en bois fabriqué dans le Jura sur JeuJura"
              >
                <span>Belotin en bois ↗</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
              aria-label="Fermer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-200">
          {/* TAB 1: VALEUR DES CARTES */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-lg">
                <table className="min-w-full text-center text-white">
                  <thead className="bg-slate-900/90 text-xs text-slate-300 uppercase">
                    <tr>
                      <th className="px-2 py-2 border-r border-slate-700 font-bold text-left w-px whitespace-nowrap">Carte</th>
                      {cardValues.headers.map((h) => (
                        <th key={h} className="p-3 border-r border-slate-700 font-black text-sm last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/80 text-sm">
                    {cardValues.rows.map((row, idx) => (
                      <tr
                        key={row.suit}
                        className={idx % 2 === 0 ? 'bg-slate-800/70 hover:bg-slate-700/50' : 'bg-slate-800/40 hover:bg-slate-700/50'}
                      >
                        <td className="px-2 py-2 border-r border-slate-700 text-left font-bold text-xs uppercase tracking-wider text-indigo-300 whitespace-nowrap w-px">
                          {row.suit}
                        </td>
                        {row.values.map((val, vIdx) => {
                          let cellStyle = '';
                          
                          if (idx === 3) {
                            if (vIdx === 2) cellStyle = 'text-[#f0e616] text-[17px]';
                            else if (vIdx === 3) cellStyle = 'text-[#dddd1e] text-[17px]';
                            else if (vIdx === 4) cellStyle = 'text-[#e7de1a] text-[17px]';
                            else if (vIdx === 5) cellStyle = 'text-[#dbea3c] text-[17px]';
                            else if (vIdx === 6) cellStyle = 'text-[#d6de24] text-[17px]';
                            else if (vIdx === 7) cellStyle = 'text-[#e4e416] text-[17px]';
                          } else if (idx === 2) {
                            if (vIdx === 3) cellStyle = 'text-[#ffffff]';
                            else if (vIdx === 7) cellStyle = 'text-[#cce21f]';
                          } else if (idx === 0) {
                            if (vIdx === 3 || vIdx === 7) cellStyle = 'text-[#ffffff]';
                          } else if (idx === 1) {
                            if (vIdx === 2 || vIdx === 3 || vIdx === 4 || vIdx === 7) cellStyle = 'text-[#ffffff]';
                          }

                          const fallbackStyle =
                            val === '20' || val === '19' || val === '14'
                              ? 'text-amber-400 font-black text-base'
                              : val === '11' || val === '10'
                              ? 'text-cyan-400'
                              : 'text-slate-300';

                          return (
                            <td
                              key={vIdx}
                              className={`p-3 border-r border-slate-700 font-mono font-bold last:border-r-0 ${
                                cellStyle || fallbackStyle
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: RÈGLES DU JEU */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/70">
                <h3 className="text-base font-bold text-cyan-400 mb-2">
                  1. Comptage des points
                </h3>
                <p>
                  Dans la variante de Belote Coinchée en 1 000 points proposée ici, <strong className="text-white">seul le contrat annoncé est marqué</strong> par l&apos;équipe qui l&apos;emporte, et l&apos;équipe perdante marque <strong>zéro point</strong>.
                </p>
                <p className="mt-1.5 text-slate-400">
                  Exemple : Si vous annoncez 100 et réalisez 130 points, vous marquez <strong>100 points</strong> (et vos adversaires 0). Si vous chutez votre contrat (vous faites moins de 100), l&apos;équipe adverse encaisse les 100 points et vous marquez 0.
                </p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/70 space-y-2">
                <h3 className="text-base font-bold text-amber-400">
                  2. Contrats
                </h3>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
                  <li>
                    <strong className="text-white">Contrats de 80 à 160 :</strong> Saisie normale par paliers de 10, N'oubliez pas les contrats tout atouts (TA) et sans atouts (SA).
                    Et pour s'amuser, n'hésitez pas à coincher et surcoincher à la volée en tapant du poing sur la table ! (le dé de bois appelé belotin marque le donneur)
                  </li>
                  <li>
                    <strong className="text-red-400">Coinché (x2) :</strong> Les points du contrat sont multipliés par 2.
                  </li>
                  <li>
                    <strong className="text-purple-400">Surcoinché (x4) :</strong> Les points du contrat sont multipliés par 4.
                  </li>
                  <li>
                    <strong className="text-emerald-400">Capot (250 pts) :</strong> Réaliser tous les plis de la manche (8 plis).
                  </li>
                  <li>
                    <strong className="text-amber-300">Générale (500 pts) :</strong> Un seul joueur réalise tous les plis sans l&apos;aide de son partenaire.
                  </li>
                  <li>
                    <strong className="text-cyan-300">Belote-Rebelote (+20 pts) :</strong> Roi et Dame d&apos;atout en main par le même joueur (à ajouter aux points réalisés).
                  </li>
                </ul>
              </div>

              <div className="text-center pt-2">
                <a
                  href="https://fr.wikipedia.org/w/index.php?title=Coinche&oldformat=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-lg transition active:scale-95"
                >
                  <span>Consulter les variantes sur Wikipédia ↗</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: À PROPOS DU CRÉATEUR & COPYRIGHT */}
          {activeTab === 'author' && (
            <div className="space-y-4 text-center sm:text-left">
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center gap-6">
                <img
                  src="/assets/aistudio/IMG_20230902_094732_3_345663aa.jpg"
                  alt="OFE"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-indigo-400 shadow-2xl flex-shrink-0"
                />
                <div className="space-y-3">
                  <h4 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-amber-200 animate-pulse tracking-tight">
                    Développé par ©JuraBrain - tout droit récservé - 2026
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    Contact pour suggestion, pourboire...{' '}
                    <a
                      href="mailto:boite151@hotmail.fr"
                      className="text-amber-400 font-bold underline underline-offset-2 hover:text-amber-200 transition-colors cursor-pointer"
                      title="Envoyer un e-mail à boite151@hotmail.fr"
                    >
                      boite151@hotmail.fr
                    </a>
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleShareApp}
                      className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse"
                      title="Partager l'application sur tous vos réseaux !"
                    >
                      <span className="text-base group-hover:rotate-12 transition-transform inline-block">📢</span>
                      <span>{shareCopied ? '✓ Lien copié ! Merci du partage !' : "Partager l'appli sur tous vos réseaux !"}</span>
                      <span className="text-amber-300 animate-bounce">✨</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/95 border-t border-slate-700 flex items-center justify-end">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onNextStep && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl text-xs sm:text-sm transition"
              >
                Passer
              </button>
            )}
            <button
              type="button"
              onClick={onNextStep || onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{nextStepLabel || "J'ai compris / Continuer vers le jeu"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
