import React from 'react';
import { SpadeIcon, HeartIcon, DiamondIcon, ClubIcon } from './icons/Icons';

interface HeaderProps {
    onNewGame: () => void;
    onOpenBelotin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewGame, onOpenBelotin }) => {
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
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400">
                        Compteur de Belote Coinchée
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
                {onOpenBelotin && (
                    <button
                        onClick={onOpenBelotin}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm bg-amber-700/80 hover:bg-amber-600 text-amber-100 font-bold rounded-lg shadow transition-all active:scale-95 border border-amber-500/30"
                        title="Lancer le dé en bois (Belotin)"
                    >
                        <span className="text-base leading-none">🎲</span>
                        <span>Belotin 3D</span>
                    </button>
                )}

                <button
                    onClick={onNewGame}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-800 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    title="Nouvelle partie"
                >
                    <span className="text-lg leading-none" aria-hidden="true">
                        <span className="text-slate-200">♠</span>
                        <span className="text-red-300">♥</span>
                        <span className="text-red-300">♦</span>
                        <span className="text-slate-200">♣</span>
                    </span>
                    <span className="hidden sm:inline">Nouvelle Partie</span>
                    <span className="sm:hidden">Nouvelle</span>
                </button>
            </div>
        </header>
    );
};
