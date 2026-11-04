import React, { useState } from 'react';
import { SpadeIcon, HeartIcon, DiamondIcon, ClubIcon, InformationCircleIcon } from './icons/Icons';
import { isAudioEnabled, setAudioEnabled } from '../utils/audio';

interface HeaderProps {
    onNewGame: () => void;
    onOpenInfo?: () => void;
    onOpenHistory?: () => void;
    historyCount?: number;
}

const SHARE_URL = 'https://belote-coinche-score-counter.netlify.app';

export const Header: React.FC<HeaderProps> = ({ onNewGame, onOpenInfo, onOpenHistory, historyCount }) => {
    const [copied, setCopied] = useState(false);
    const [soundActive, setSoundActive] = useState<boolean>(() => isAudioEnabled());

    const handleToggleSound = () => {
        const next = !soundActive;
        setSoundActive(next);
        setAudioEnabled(next);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Compteur de Belote Coinchée',
                    text: 'Compteur de points moderne pour vos parties de Belote Coinchée !',
                    url: SHARE_URL,
                });
                return;
            } catch (err) {
                // Annulé par l'utilisateur ou non supporté
            }
        }

        try {
            await navigator.clipboard.writeText(SHARE_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            window.prompt('Copiez le lien pour partager :', SHARE_URL);
        }
    };

    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b-2 border-slate-700">
            <div className="flex items-center gap-3">
                <div className="flex text-2xl gap-1">
                    <SpadeIcon className="text-gray-300" />
                    <HeartIcon className="text-red-500" />
                    <DiamondIcon className="text-red-500" />
                    <ClubIcon className="text-gray-300" />
                </div>
                <div>
                    <h1 className="text-[20px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 drop-shadow-[0_0_14px_rgba(239,68,68,0.5)] animate-pulse inline-block hover:scale-[1.03] transition-all duration-300 cursor-default">
                        Belotin Compteur pour Coinche
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                <button
                    onClick={handleShare}
                    className="flex items-center px-3 py-2 text-xs sm:text-sm bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold rounded-lg shadow transition-all active:scale-95 border border-sky-500/40 relative"
                    title="Partager l'application"
                    aria-label="Partager"
                >
                    <span className="hidden sm:inline">
                        {copied ? 'Lien copié !' : 'Partager'}
                    </span>
                    <span className="sm:hidden">
                        {copied ? 'Copié !' : 'Partager'}
                    </span>
                    {copied && (
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-fade-in-fast z-30">
                            ✓ Lien copié !
                        </span>
                    )}
                </button>

                {onOpenHistory && (
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg shadow transition-all active:scale-95 border border-amber-500/40"
                        title="Historique des parties"
                        aria-label="Historique"
                    >
                        <span>Historique</span>
                        {historyCount !== undefined && historyCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full leading-none">
                                {historyCount}
                            </span>
                        )}
                    </button>
                )}

                {onOpenInfo && (
                    <button
                        onClick={onOpenInfo}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm bg-indigo-700/80 hover:bg-indigo-600 text-indigo-100 font-bold rounded-lg shadow transition-all active:scale-95 border border-indigo-500/40"
                        title="Règles du jeu"
                        aria-label="Règles"
                    >
                        <InformationCircleIcon className="w-5 h-5 text-indigo-200 pointer-events-none" />
                        <span className="hidden sm:inline">Règles</span>
                    </button>
                )}

                <button
                    onClick={handleToggleSound}
                    className={`flex items-center justify-center px-2.5 py-2 text-xs sm:text-sm font-bold rounded-lg shadow transition-all active:scale-95 border ${
                        soundActive 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                            : 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border-rose-800/60'
                    }`}
                    title={soundActive ? 'Effets sonores activés (cliquer pour couper)' : 'Effets sonores coupés (cliquer pour activer)'}
                    aria-label={soundActive ? 'Couper le son' : 'Activer le son'}
                >
                    <span>{soundActive ? '🔊' : '🔇'}</span>
                </button>

                <button
                    onClick={onNewGame}
                    className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-800 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
                    title="Nouvelle partie"
                >
                    <span>Nouvelle partie</span>
                </button>
            </div>
        </header>
    );
};
