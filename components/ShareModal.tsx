import React, { useState } from 'react';
import { XMarkIcon, ShareIcon } from './icons/Icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNewGameTransition?: boolean;
  onConfirmNewGame?: () => void;
}

const SHARE_URL = 'https://belote-coinche-score-counter.netlify.app';
const SHARE_TEXT = 'Belotin Compteur : compteur de points gratuit, rapide et moderne pour vos parties de Belote Coinchée !';

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  isNewGameTransition = false,
  onConfirmNewGame,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copiez le lien pour partager :', SHARE_URL);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Belotin Compteur pour Belote Coinchée',
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const encodedUrl = encodeURIComponent(SHARE_URL);
  const encodedText = encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`);

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in-fast overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Partager l'application"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative flex flex-col my-auto animate-scale-up">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition z-20 shadow-md backdrop-blur-sm active:scale-95"
          aria-label="Fermer"
          title="Fermer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* En-tête de la modale */}
        <div className="p-6 text-center space-y-2 border-b border-slate-800/80 bg-slate-800/40">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 mx-auto flex items-center justify-center shadow-lg">
            <ShareIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Partager l'application
          </h3>
          <p className="text-slate-300 text-sm max-w-sm mx-auto">
            {isNewGameTransition
              ? "Avant de lancer cette nouvelle partie, partagez le Belotin Compteur avec vos partenaires de jeu !"
              : "Partagez facilement le Belotin Compteur avec vos amis et partenaires de jeu !"}
          </p>
        </div>

        {/* Options de partage */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Lien à copier */}
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono truncate flex-1 px-2 select-all">
              {SHARE_URL}
            </span>
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {copied ? '✓ Copié !' : 'Copier'}
            </button>
          </div>

          {/* Réseaux et messageries */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <a
              href={`https://api.whatsapp.com/send?text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-600/40 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
            >
              <span>WhatsApp</span>
            </a>

            <a
              href={`sms:?&body=${encodedText}`}
              className="flex items-center justify-center gap-2 p-3 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-600/40 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
            >
              <span>SMS</span>
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent("Découvre le Belotin Compteur pour Belote Coinchée")}&body=${encodedText}`}
              className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/40 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
            >
              <span>Email</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-600/40 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
            >
              <span>Facebook</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 border border-sky-600/40 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
            >
              <span>X (Twitter)</span>
            </a>

            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 p-3 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-600/40 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
            >
              <span>Plus d'options</span>
            </button>
          </div>

          {/* Actions de bas de modale */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-end border-t border-slate-800/80">
            {isNewGameTransition && onConfirmNewGame ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onConfirmNewGame();
                  }}
                  className="px-5 py-2.5 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow-lg active:scale-95"
                >
                  Lancer la nouvelle partie ➔
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
