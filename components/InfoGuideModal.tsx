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
                          const isHighlighted = (idx === 2 && vIdx === 7) || (idx === 3 && vIdx >= 2 && vIdx <= 7);

                          if (isHighlighted) {
                            return (
                              <td
                                key={vIdx}
                                className="p-2 sm:p-2.5 border-r border-slate-700 font-mono font-black last:border-r-0"
                              >
                                <span className="inline-flex items-center justify-center min-w-[30px] px-1.5 py-0.5 rounded-md text-amber-300 bg-amber-400/20 border border-amber-400 font-black text-[15px] sm:text-base animate-card-highlight shadow-[0_0_12px_rgba(250,204,21,0.6)]">
                                  {val}
                                </span>
                              </td>
                            );
                          }

                          const standardStyle =
                            val === '20' || val === '14'
                              ? 'text-amber-400 font-black text-base'
                              : val === '11' || val === '10'
                              ? 'text-cyan-400'
                              : val === '0'
                              ? 'text-slate-500'
                              : 'text-slate-300';

                          return (
                            <td
                              key={vIdx}
                              className={`p-3 border-r border-slate-700 font-mono font-bold last:border-r-0 ${standardStyle}`}
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
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/70 space-y-3">
                <h3 className="text-base font-bold text-cyan-400">
                  1. Comptage des points
                </h3>
                <p className="text-slate-200">
                  Dans la variante de Belote Coinchée <strong className="text-[#cd5252] bg-slate-800 px-1.5 py-0.5 rounded border border-[#cd5252]/40 font-bold">SANS ANNONCES</strong> proposée ici, <strong className="text-cyan-300 font-bold">seule l&apos;enchère annoncée est marquée</strong> par l&apos;équipe gagnante, et l&apos;équipe perdante marque systématiquement <strong className="text-rose-400 font-bold">0 point</strong>.
                </p>

                {/* Encadré Exemple en exergue */}
                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 text-xs sm:text-sm">
                  <ul className="space-y-1.5 text-slate-300">
                    <li>
                      • <strong className="text-white">Contrat réussi :</strong> Vous annoncez <strong className="text-yellow-300">100</strong> et réalisez 140 points ➔ vous marquez <strong className="text-emerald-400">100 points</strong> (vos adversaires marquent <strong className="text-slate-400">0</strong>).
                    </li>
                    <li>
                      • <strong className="text-white">Contrat échoué :</strong> Vous annoncez <strong className="text-yellow-300">100</strong> et faites moins de 100 ➔ les adversaires empochent <strong className="text-emerald-400">100 points</strong> (vous marquez <strong className="text-rose-400">0</strong>).
                    </li>
                  </ul>
                </div>

                {/* Points clés en exergue */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-amber-300 block mb-1">🎯 Enchères stimulées</span>
                    <p className="text-slate-400 leading-snug">
                      Puisque les points au-delà du contrat ne sont pas comptabilisés, les équipes sont incitées à monter leurs enchères au plus juste.
                    </p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-indigo-300 block mb-1">🏆 Objectif clair</span>
                    <p className="text-slate-400 leading-snug">
                      La partie se dispute le plus souvent en <strong className="text-slate-200">1 000</strong> ou <strong className="text-slate-200">1 500 points</strong>, sans litige ni calcul complexe d&apos;annonces.
                    </p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="font-bold text-emerald-300 block mb-1">👌 Accessible & tactique</span>
                    <p className="text-slate-400 leading-snug">
                      Prisée des débutants pour sa clarté immédiate et des experts pour sa pureté stratégique.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/70 space-y-2">
                <h3 className="text-base font-bold text-amber-400">
                  2. Contrats
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    <div className="space-y-1.5 flex-1">
                      <p>
                        <strong className="text-white">Contrats standards (82 à 160) :</strong> Enchères annoncées par paliers de 10 points, avec choix de la couleur d&apos;atout ou des variantes <strong className="text-amber-300">Tout Atout (TA)</strong> et <strong className="text-cyan-300">Sans Atout (SA)</strong>.
                      </p>
                      {/* Composant joint : Coinche à la volée & Le Belotin */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 hover:border-slate-600 transition shadow-sm">
                          <span className="font-bold text-slate-100 flex items-center gap-1.5 mb-1">
                            <span>⚡</span>
                            <span>Coinche à la volée</span>
                          </span>
                          <p className="text-slate-400 leading-relaxed">
                            Pour l&apos;ambiance, n&apos;hésitez pas à coincher et surcoincher à la volée en tapant du poing sur la table !
                          </p>
                        </div>

                        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-amber-500/30 hover:border-amber-500/50 transition shadow-sm">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                            <span>🎲</span>
                            <span>Le Belotin</span>
                          </span>
                          <p className="text-slate-400 leading-relaxed">
                            Le dé en bois (ou cette appli) marque le <strong className="text-white">donneur</strong> à chaque manche.
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.6)]" />
                    <div>
                      <strong className="text-red-400 font-bold">Coinché :</strong> Les points du contrat sont multipliés par 2.
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
                    <div>
                      <strong className="text-purple-400 font-bold">Surcoinché :</strong> Les points du contrat sont multipliés par 4.
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    <div>
                      <strong className="text-emerald-400 font-bold">Capot (250 pts) :</strong> Réaliser tous les plis de la manche (8 plis).
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-300 mt-2 shrink-0 shadow-[0_0_8px_rgba(252,211,77,0.6)]" />
                    <div>
                      <strong className="text-amber-300 font-bold">Générale (500 pts) :</strong> Un seul joueur réalise tous les plis sans l&apos;aide de son partenaire.
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-300 mt-2 shrink-0 shadow-[0_0_8px_rgba(103,232,249,0.6)]" />
                    <div>
                      <strong className="text-cyan-300 font-bold">Belote-Rebelote (+20 pts) :</strong> Roi et Dame d&apos;atout en main par le même joueur (à ajouter aux points réalisés).
                    </div>
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
                  <h4 className="text-[16px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-amber-200 tracking-tight">
                    Développé par Olivier pour ©JuraBrain - Version 1.1 du 06/11/2026
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    <a
                      href="mailto:boite151@hotmail.fr"
                      className="text-amber-400 font-bold underline underline-offset-2 hover:text-amber-200 transition-colors cursor-pointer"
                      title="Envoyer un e-mail à boite151@hotmail.fr"
                    >
                      boite151@hotmail.fr
                    </a>{' '}
                    pour suggestion, pourboire...
                  </p>

                  <div className="pt-2 flex flex-col items-center sm:items-start gap-2.5">
                    <button
                      type="button"
                      onClick={handleShareApp}
                      className="relative inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95"
                      title="Partager l'application sur tous vos réseaux !"
                    >
                      <span>{shareCopied ? '✓ Lien copié ! Merci du partage !' : "Partager l'appli sur tous vos réseaux !"}</span>
                    </button>

                    <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Belotin Compteur : compteur de points gratuit pour Belote Coinchée ! https://belote-coinche-score-counter.netlify.app")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 font-bold transition active:scale-95 flex items-center gap-1 shadow-sm"
                        title="Partager sur WhatsApp"
                      >
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`sms:?&body=${encodeURIComponent("Belotin Compteur : compteur de points gratuit pour Belote Coinchée ! https://belote-coinche-score-counter.netlify.app")}`}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-600/40 font-bold transition active:scale-95 flex items-center gap-1 shadow-sm"
                        title="Partager par SMS"
                      >
                        <span>SMS</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleShareApp}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold transition active:scale-95 flex items-center gap-1 shadow-sm"
                        title="Copier le lien"
                      >
                        <span>{shareCopied ? '✓ Copié !' : 'Copier le lien'}</span>
                      </button>
                    </div>
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
