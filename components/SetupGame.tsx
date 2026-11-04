import React, { useState, useEffect } from 'react';

interface SetupGameProps {
  onStartGame: (teamNames: { nous: string; eux: string }, targetScore: number) => void;
  onOpenHistory?: () => void;
  historyCount?: number;
  onCancel?: () => void;
}

const randomNames = [
  'Alice', 'Bob', 'Charlie', 'Dana', 'Eve', 'Frank', 'Grace', 'Heidi', 
  'Ivan', 'Judy', 'Léo', 'Mia', 'Noa', 'Eli', 'Olivia', 'Hugo', 'Chloé', 'Louis'
];

const getUniqueRandomNames = (count: number): string[] => {
  const shuffled = [...randomNames].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const SetupGame: React.FC<SetupGameProps> = ({ onStartGame, onOpenHistory, historyCount, onCancel }) => {
  const [nousP1, setNousP1] = useState('');
  const [nousP2, setNousP2] = useState('');
  const [euxP1, setEuxP1] = useState('');
  const [euxP2, setEuxP2] = useState('');
  const [targetScore, setTargetScore] = useState<number>(1000);
  const [isCustomTarget, setIsCustomTarget] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedTeamNames = localStorage.getItem('beloteTeamNames');
      if (savedTeamNames) {
        const parsedNames = JSON.parse(savedTeamNames);
        const [savedNousP1 = '', savedNousP2 = ''] = parsedNames.nous.split(' & ');
        const [savedEuxP1 = '', savedEuxP2 = ''] = parsedNames.eux.split(' & ');
        setNousP1(savedNousP1);
        setNousP2(savedNousP2);
        setEuxP1(savedEuxP1);
        setEuxP2(savedEuxP2);
      } else {
        const [name1, name2, name3, name4] = getUniqueRandomNames(4);
        setNousP1(name1);
        setNousP2(name2);
        setEuxP1(name3);
        setEuxP2(name4);
      }

      const savedTarget = localStorage.getItem('beloteTargetScore');
      if (savedTarget) {
        const parsed = parseInt(savedTarget, 10);
        if (!isNaN(parsed) && parsed > 0) {
          setTargetScore(parsed);
          if (![500, 1000, 1500, 2000].includes(parsed)) {
            setIsCustomTarget(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to process setup data, falling back to defaults.", error);
      const [name1, name2, name3, name4] = getUniqueRandomNames(4);
      setNousP1(name1);
      setNousP2(name2);
      setEuxP1(name3);
      setEuxP2(name4);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nousName = `${nousP1.trim()} & ${nousP2.trim()}`;
    const euxName = `${euxP1.trim()} & ${euxP2.trim()}`;
    const finalScore = targetScore && targetScore > 0 ? targetScore : 1000;
    onStartGame({ nous: nousName, eux: euxName }, finalScore);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg border border-slate-700 p-6 sm:p-8 text-center animate-fade-in relative my-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
            aria-label="Fermer"
            title="Revenir à la partie en cours"
          >
            ✕
          </button>
        )}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500 mb-6">
          Configuration de la Partie
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="border-2 border-cyan-700/50 p-4 rounded-lg">
            <legend className="px-2 font-semibold text-cyan-400">Équipe 1</legend>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Prénom Joueur 1"
                value={nousP1}
                onChange={(e) => setNousP1(e.target.value)}
                className="w-full bg-slate-900 text-cyan-400 placeholder:text-cyan-600/60 font-semibold border border-cyan-700/60 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              />
              <input
                type="text"
                placeholder="Prénom Joueur 2"
                value={nousP2}
                onChange={(e) => setNousP2(e.target.value)}
                className="w-full bg-slate-900 text-cyan-400 placeholder:text-cyan-600/60 font-semibold border border-cyan-700/60 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                required
              />
            </div>
          </fieldset>

          <fieldset className="border-2 border-amber-700/50 p-4 rounded-lg">
            <legend className="px-2 font-semibold text-amber-400">Équipe 2</legend>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Prénom Joueur 3"
                value={euxP1}
                onChange={(e) => setEuxP1(e.target.value)}
                className="w-full bg-slate-900 text-amber-400 placeholder:text-amber-600/60 font-semibold border border-amber-700/60 rounded-md p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                required
              />
              <input
                type="text"
                placeholder="Prénom Joueur 4"
                value={euxP2}
                onChange={(e) => setEuxP2(e.target.value)}
                className="w-full bg-slate-900 text-amber-400 placeholder:text-amber-600/60 font-semibold border border-amber-700/60 rounded-md p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                required
              />
            </div>
          </fieldset>

          <fieldset className="border-2 border-indigo-700/50 p-4 rounded-lg text-left">
            <div className={`flex items-center gap-2 flex-wrap ${isCustomTarget ? 'mb-3' : ''}`}>
              {[500, 1000, 1500, 2000].map((pts) => {
                const isSelected = targetScore === pts && !isCustomTarget;
                return (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => {
                      setTargetScore(pts);
                      setIsCustomTarget(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {pts === 1000 ? `${pts.toLocaleString('fr-FR')} pts (défaut)` : `${pts.toLocaleString('fr-FR')} pts`}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomTarget(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isCustomTarget
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Personnalisé
              </button>
            </div>

            {isCustomTarget && (
              <div className="flex items-center gap-3 animate-fade-in-fast mb-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="10"
                    value={targetScore}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setTargetScore(isNaN(val) ? 0 : val);
                    }}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-2.5 text-center font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Ex: 1200"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold pointer-events-none">
                    points
                  </span>
                </div>
              </div>
            )}
          </fieldset>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-1/3 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
            >
              {onCancel ? 'Valider les modifications' : 'Démarrer la partie'}
            </button>
          </div>

          {onOpenHistory && historyCount !== undefined && historyCount > 0 && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="w-full mt-3 py-2.5 px-4 bg-slate-700/60 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-sm border border-amber-500/30 flex items-center justify-center gap-2 transition"
            >
              Voir l'historique des parties ({historyCount})
            </button>
          )}
        </form>
      </div>
    </div>
  );
};