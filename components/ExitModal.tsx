import React from 'react';
import { XMarkIcon } from './icons/Icons';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXOTY_URL = 'https://exoty.com/belote';

export const ExitModal: React.FC<ExitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in-fast overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Sortie de l'application"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden relative flex flex-col my-auto animate-scale-up">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition z-20 shadow-md backdrop-blur-sm active:scale-95"
          aria-label="Fermer"
          title="Revenir au compteur"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Corps avec la bannière EXOTY */}
        <div className="p-4 sm:p-6 space-y-4 pt-11 sm:pt-6">
          <p className="text-slate-300 text-sm text-center">
            Envie de prolonger la partie en ligne ou de défier d'autres joueurs ?
          </p>

          <a
            href={EXOTY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-cyan-500/40 hover:border-cyan-400 shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-98 group bg-slate-950"
            title="Accéder à Exoty Belote & Coinche en ligne (s'ouvre dans un nouvel onglet)"
          >
            <img
              src="/assets/aistudio/EXOTY_e0cefa52.jpg"
              alt="Exoty - Jeu de Belote & Coinche en ligne gratuit"
              className="w-full h-auto object-cover transition group-hover:brightness-105"
            />
          </a>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition order-2 sm:order-1"
            >
              Rester sur le compteur
            </button>
            <a
              href={EXOTY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-95"
            >
              <span>Rejoindre Exoty Belote ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
