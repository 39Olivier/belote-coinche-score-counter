
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Team, Round, NewRoundData, GameHistoryItem } from './types';
import { AddRoundModal } from './components/AddRoundModal';
import { Scoreboard } from './components/Scoreboard';
import { Header } from './components/Header';
import { SetupGame } from './components/SetupGame';
import { PlusCircleIcon, ShareIcon } from './components/icons/Icons';
import { WelcomeModal } from './components/WelcomeModal';
import { ExitModal } from './components/ExitModal';
import { InfoGuideModal } from './components/InfoGuideModal';
import { GameHistoryModal } from './components/GameHistoryModal';
import { playButtonClick, playRoundSuccess, playVictoryCelebration, stopVictoryCelebration } from './utils/audio';

const App: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const [launchStep, setLaunchStep] = useState<'belotin' | 'cards' | 'rules' | 'done'>('belotin');
  const [infoModalTab, setInfoModalTab] = useState<'cards' | 'rules' | null>(null);
  const [isBelotinModalOpen, setIsBelotinModalOpen] = useState<boolean>(true);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState<boolean>(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [teamNames, setTeamNames] = useState<{ nous: string; eux: string } | null>(null);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [victoryShareCopied, setVictoryShareCopied] = useState<boolean>(false);
  const [savedGameId, setSavedGameId] = useState<string | null>(null);

  // Retour sonore léger sur tous les clics interactifs
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, [role="button"], input[type="radio"], input[type="checkbox"]')) {
        playButtonClick();
      }
    };
    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);
  const [targetScore, setTargetScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('beloteTargetScore');
      return saved ? parseInt(saved, 10) || 1000 : 1000;
    } catch {
      return 1000;
    }
  });

  const handleCloseBelotin = useCallback(() => {
    setIsBelotinModalOpen(false);
    if (launchStep === 'belotin') {
      setLaunchStep('cards');
      setInfoModalTab('cards');
    }
  }, [launchStep]);

  const handleInfoClose = useCallback(() => {
    setInfoModalTab(null);
    setLaunchStep('done');
  }, []);

  const handleInfoNext = useCallback(() => {
    if (launchStep === 'cards') {
      setLaunchStep('rules');
      setInfoModalTab('rules');
    } else {
      setLaunchStep('done');
      setInfoModalTab(null);
    }
  }, [launchStep]);

  // Initialisation sécurisée
  useEffect(() => {
    try {
      const savedTeamNames = localStorage.getItem('beloteTeamNames');
      if (savedTeamNames) setTeamNames(JSON.parse(savedTeamNames));

      const savedTargetScore = localStorage.getItem('beloteTargetScore');
      if (savedTargetScore) {
        const parsed = parseInt(savedTargetScore, 10);
        if (!isNaN(parsed) && parsed > 0) setTargetScore(parsed);
      }

      const savedRounds = localStorage.getItem('beloteRounds');
      if (savedRounds) {
        const parsed = JSON.parse(savedRounds);
        if (Array.isArray(parsed)) setRounds(parsed);
      }

      const savedHistory = localStorage.getItem('beloteGameHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) setGameHistory(parsedHistory);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des données", e);
    }
  }, []);

  // Sauvegarde persistante
  useEffect(() => {
    if (teamNames) {
      localStorage.setItem('beloteRounds', JSON.stringify(rounds));
    }
  }, [rounds, teamNames]);

  // Gestion des classes d'animation éphémères
  useEffect(() => {
    const hasAnimation = rounds.some(r => r.animationClass);
    if (hasAnimation) {
      const timer = setTimeout(() => {
        setRounds(current => current.map(({ animationClass, ...r }) => r as Round));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [rounds]);

  const totals = useMemo(() => rounds.reduce(
    (acc, round) => ({ nous: acc.nous + round.nous, eux: acc.eux + round.eux }),
    { nous: 0, eux: 0 }
  ), [rounds]);

  const calculateRoundScores = useCallback((data: NewRoundData) => {
    if (!teamNames) return { roundNous: 0, roundEux: 0, details: '' };

    const { bidder, contract, suit, scoreMade, checkedOff, overridden } = data;
    let multiplier = 1;
    if (checkedOff) multiplier = 2;
    if (overridden) multiplier = 4;

    const baseScore = contract * multiplier;
    const isSuccess = scoreMade >= contract;
    const bidderName = bidder === Team.Nous ? teamNames.nous : teamNames.eux;
    
    let roundNous = 0;
    let roundEux = 0;
    let status = isSuccess ? "réussi" : "échoué";

    if (isSuccess) {
      if (bidder === Team.Nous) roundNous = baseScore;
      else roundEux = baseScore;
    } else {
      // En cas de chute, c'est l'autre équipe qui marque les points du contrat
      if (bidder === Team.Nous) roundEux = baseScore;
      else roundNous = baseScore;
    }

    const multiplierLabel = overridden ? " (Surcoinché)" : (checkedOff ? " (Coinché)" : "");
    const details = `Contrat de ${contract}${multiplierLabel} en ${suit} ${status} par ${bidderName}.`;

    return { roundNous, roundEux, details };
  }, [teamNames]);

  const handleSaveRound = (data: NewRoundData, id?: number) => {
    const { roundNous, roundEux, details } = calculateRoundScores(data);
    
    if (id) {
      setRounds(prev => prev.map(r => r.id === id ? { ...r, ...data, nous: roundNous, eux: roundEux, details } : r));
    } else {
      const newRound: Round = {
        id: Date.now(),
        nous: roundNous,
        eux: roundEux,
        details,
        ...data,
        animationClass: 'animate-slide-in-down',
      };
      setRounds(prev => [newRound, ...prev]);
    }
    playRoundSuccess();
    setIsModalOpen(false);
    setEditingRound(null);
  };
  
  const saveGameToHistory = useCallback((winningTeam: Team) => {
    if (!teamNames || rounds.length === 0) return;
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);

    const winningName = winningTeam === Team.Nous ? teamNames.nous : teamNames.eux;
    const gameId = `game_${Date.now()}`;

    const newGame: GameHistoryItem = {
      id: gameId,
      date: now.toISOString(),
      formattedDate,
      teamNous: teamNames.nous,
      teamEux: teamNames.eux,
      scoreNous: totals.nous,
      scoreEux: totals.eux,
      winner: winningTeam,
      winnerName: winningName,
      totalRounds: rounds.length,
      targetScore,
    };

    setGameHistory(prev => {
      const exists = prev.some(g => 
        g.teamNous === newGame.teamNous && 
        g.teamEux === newGame.teamEux && 
        g.scoreNous === newGame.scoreNous && 
        g.scoreEux === newGame.scoreEux && 
        Math.abs(new Date(g.date).getTime() - now.getTime()) < 60000
      );
      if (exists) return prev;
      const updated = [newGame, ...prev];
      localStorage.setItem('beloteGameHistory', JSON.stringify(updated));
      return updated;
    });
    setSavedGameId(gameId);
  }, [teamNames, rounds.length, totals.nous, totals.eux, targetScore]);

  const handleDeleteHistoryGame = useCallback((id: string) => {
    setGameHistory(prev => {
      const updated = prev.filter(g => g.id !== id);
      localStorage.setItem('beloteGameHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    setGameHistory([]);
    localStorage.removeItem('beloteGameHistory');
  }, []);

  const handleNewGame = () => {
    setIsNewGameModalOpen(true);
  };

  const handleConfirmResetScores = () => {
    stopVictoryCelebration();
    setRounds([]);
    localStorage.removeItem('beloteRounds');
    setSavedGameId(null);
    setIsNewGameModalOpen(false);
  };

  const handleConfirmResetAll = () => {
    stopVictoryCelebration();
    setRounds([]);
    setTeamNames(null);
    localStorage.removeItem('beloteRounds');
    localStorage.removeItem('beloteTeamNames');
    localStorage.removeItem('beloteTargetScore');
    setSavedGameId(null);
    setIsNewGameModalOpen(false);
  };

  const handleStartGame = (names: { nous: string; eux: string }, score: number = 1000) => {
    stopVictoryCelebration();
    setTeamNames(names);
    setTargetScore(score);
    setIsSetupModalOpen(false);
    setRounds([]);
    setSavedGameId(null);
    localStorage.setItem('beloteTeamNames', JSON.stringify(names));
    localStorage.setItem('beloteTargetScore', score.toString());
    localStorage.removeItem('beloteRounds');
    setIsBelotinModalOpen(true);
  };

  const winner = useMemo(() => {
    const threshold = targetScore || 1000;
    if (totals.nous >= threshold && totals.nous > totals.eux) return Team.Nous;
    if (totals.eux >= threshold && totals.eux > totals.nous) return Team.Eux;
    return null;
  }, [totals, targetScore]);

  // Sauvegarde automatique lorsque la partie est remportée + célébration sonore (fanfare & applaudissements)
  useEffect(() => {
    if (winner && !savedGameId && rounds.length > 0) {
      saveGameToHistory(winner);
      playVictoryCelebration();
    }
  }, [winner, savedGameId, rounds.length, saveGameToHistory]);

  const nextStepLabel =
    launchStep === 'cards'
      ? 'Suivant : Voir les Règles du jeu ➔'
      : launchStep === 'rules'
      ? "C'est parti ! Commencer la partie ➔"
      : undefined;

  const onNextStep = launchStep === 'cards' || launchStep === 'rules' ? handleInfoNext : undefined;

  if (!teamNames || isSetupModalOpen) {
    return (
      <>
        <SetupGame 
          onStartGame={handleStartGame} 
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          historyCount={gameHistory.length}
          onCancel={teamNames ? () => setIsSetupModalOpen(false) : undefined}
        />
        {infoModalTab && (
          <InfoGuideModal
            initialTab={infoModalTab}
            onClose={handleInfoClose}
            nextStepLabel={nextStepLabel}
            onNextStep={onNextStep}
          />
        )}
        {isBelotinModalOpen && (
          <WelcomeModal
            isOpen={isBelotinModalOpen}
            onClose={handleCloseBelotin}
          />
        )}
        <GameHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          history={gameHistory}
          onDeleteGame={handleDeleteHistoryGame}
          onClearHistory={handleClearHistory}
        />
      </>
    );
  }

  const winnerName = winner ? (winner === Team.Nous ? teamNames.nous : teamNames.eux) : null;

  const handleShareVictory = async () => {
    if (!teamNames || !winnerName) return;
    const shareUrl = window.location.href;
    const shareTitle = `Victoire de ${winnerName} à la Belote Coinchée !`;
    const shareText = `🏆 Victoire de ${winnerName} ! Score final : ${teamNames.nous} ${totals.nous} - ${totals.eux} ${teamNames.eux} (${rounds.length} manche${rounds.length > 1 ? 's' : ''}, partie en ${targetScore.toLocaleString('fr-FR')} pts).`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareText}\n`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Annulé par l'utilisateur ou non supporté
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setVictoryShareCopied(true);
      setTimeout(() => setVictoryShareCopied(false), 2500);
    } catch {
      window.prompt('Copiez le texte pour le partager :', `${shareText}\n${shareUrl}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8 selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto">
        <Header 
          onNewGame={handleNewGame} 
          onOpenInfo={() => { setLaunchStep('done'); setInfoModalTab('cards'); }}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          historyCount={gameHistory.length}
          onExit={() => setIsExitModalOpen(true)}
        />

        <main>
          <Scoreboard 
            totals={totals} 
            rounds={rounds} 
            winner={winner} 
            teamNames={teamNames}
            targetScore={targetScore}
            onEditTargetScore={() => setIsSetupModalOpen(true)}
            onDeleteRound={(id) => setRounds(prev => prev.filter(r => r.id !== id))}
            onStartEdit={(r) => { setEditingRound(r); setIsModalOpen(true); }}
            onAddRound={() => setIsModalOpen(true)}
            winnerBanner={
              winnerName ? (
                <div className="text-center p-6 bg-green-900/40 border-2 border-green-500 rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.25)]">
                  <h2 className="text-3xl sm:text-4xl font-black text-green-300">🏆 {winnerName} TRIOMPHENT !</h2>
                  <p className="mt-2 text-green-200/80 font-medium text-sm sm:text-base">
                    Félicitations pour cette belle partie en {targetScore.toLocaleString('fr-FR')} points.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                    <span className="text-xs bg-green-950/80 text-green-300 px-3 py-1.5 rounded-full border border-green-500/50 font-semibold shadow">
                      ✓ Sauvegardée dans l'historique
                    </span>
                    <button
                      onClick={handleShareVictory}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-1.5 border border-emerald-400/40"
                      title="Partager votre score sur les réseaux sociaux"
                    >
                      <ShareIcon className="w-4 h-4" />
                      <span>{victoryShareCopied ? 'Score copié !' : 'Partager le score'}</span>
                    </button>
                    <button
                      onClick={() => setIsHistoryModalOpen(true)}
                      className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
                    >
                      Voir l'historique
                    </button>
                    <button
                      onClick={handleNewGame}
                      className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-1.5"
                      title="Démarrer une nouvelle partie"
                    >
                      <span>Nouvelle partie</span>
                    </button>
                  </div>
                </div>
              ) : undefined
            }
          />
        </main>
      </div>

      {isModalOpen && (
        <AddRoundModal
          onClose={() => { setIsModalOpen(false); setEditingRound(null); }}
          onSave={handleSaveRound}
          teamNames={teamNames}
          roundToEdit={editingRound}
        />
      )}

      {infoModalTab && (
        <InfoGuideModal
          initialTab={infoModalTab}
          onClose={handleInfoClose}
          nextStepLabel={nextStepLabel}
          onNextStep={onNextStep}
        />
      )}

      {isBelotinModalOpen && (
        <WelcomeModal
          isOpen={isBelotinModalOpen}
          onClose={handleCloseBelotin}
        />
      )}

      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
      />

      {isNewGameModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-fast" 
          role="dialog" 
          aria-modal="true"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 mx-auto flex items-center justify-center text-xl font-bold tracking-tight">
              ♠♥
            </div>
            <h3 className="text-xl font-bold text-white">Nouvelle Partie</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Voulez-vous commencer une nouvelle partie ? Tous les scores du tableau seront effacés.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center flex-wrap">
              <button
                onClick={() => setIsNewGameModalOpen(false)}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-sm transition"
              >
                Annuler
              </button>
              {rounds.length > 0 && !savedGameId && (
                <button
                  type="button"
                  onClick={() => {
                    const currentLeader = totals.nous >= totals.eux ? Team.Nous : Team.Eux;
                    saveGameToHistory(currentLeader);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg active:scale-95"
                >
                  Sauvegarder dans les stats
                </button>
              )}
              <button
                onClick={handleConfirmResetScores}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-xl text-sm transition shadow-sm active:scale-95"
                title="Conserver les mêmes joueurs et le même objectif de score"
              >
                Recommencer (mêmes joueurs)
              </button>
              <button
                onClick={() => {
                  setIsNewGameModalOpen(false);
                  setIsSetupModalOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg active:scale-95"
                title="Modifier les joueurs et l'objectif de score"
              >
                Configurer (joueurs & objectif)
              </button>
            </div>
          </div>
        </div>
      )}

      <GameHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={gameHistory}
        onDeleteGame={handleDeleteHistoryGame}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default App;
