import React from 'react';
import { XMarkIcon } from './icons/Icons';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in-fast overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenue sur Belotin Compteur"
    >
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg border border-slate-700/80 overflow-hidden relative flex flex-col items-center my-auto animate-scale-up">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition z-20 shadow-md backdrop-blur-sm active:scale-95"
          aria-label="Fermer et continuer"
          title="Fermer et continuer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Image d'ouverture / Affiche Belotin */}
        <div 
          className="w-full relative flex items-center justify-center bg-emerald-950/40 p-2 sm:p-3 cursor-pointer" 
          onClick={onClose}
          title="Cliquez pour continuer"
        >
          <img
            src="/assets/aistudio/Belote_Coinch_e_d5d372a9.png"
            alt="Belotin Compteur pour Belote Coinchée"
            className="w-full max-h-[72vh] object-contain rounded-xl shadow-2xl transition hover:brightness-105"
          />
        </div>

        {/* Bouton Continuer */}
        <div className="w-full px-5 pb-5 pt-3 text-center flex flex-col items-center gap-2 bg-slate-900/95 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-w-[220px] px-8 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-base rounded-xl shadow-xl transition-all active:scale-95 transform hover:scale-[1.02]"
          >
            Continuer
          </button>
          <span className="text-[11px] font-medium text-slate-500 tracking-wider">
            © JuraBrain - 2026
          </span>
        </div>
      </div>
    </div>
  );
};
