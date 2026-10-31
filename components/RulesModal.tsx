import React from 'react';
import { XMarkIcon } from './icons/Icons';

export const RulesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in-fast" role="dialog" aria-modal="true" aria-labelledby="rules-title">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors z-10" aria-label="Fermer">
                    <XMarkIcon />
                </button>
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    <h2 id="rules-title" className="text-2xl font-bold text-center mb-6 text-slate-300">Règles de la Belote Coinchée</h2>
                    <div className="space-y-4 text-slate-300">
                   
                        <div>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Comptage des points</h3>
                            <p>Seule l'enchère est retenue dans le comptage des points, et le perdant fait donc zéro. Ceci force les joueurs
                            à monter leur enchère (si annoncé 100 et fait 140, on ne compte que 100). De plus on ne peut finir sans victoire. Dans ce cas la partie se joue le plus souvent en 1 000 points ou en 1 500 points,
                             et sans les annonces. Cette variante est à la fois prisée des débutants pour son décompte des points plus clair et des spécialistes pour son incitation à monter les enchères. :</p>
                            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                                <li><strong>Contrats normaux (82 à 160) :</strong> Vous devez saisir manuellement le score réalisé par chaque équipe à la fin du tour.
                                 Exemple : contrat de 120 pts honoré, le contractant marque 120 pts, si contrat chuté l'équipe adverse marque 120 pts !
                                 Contrat Coinché = x 2
                                 Contrat Surcoinché = x 4</li>
                                <li><strong>Belote-Rebelote :</strong> Le bonus de 20 points (pour le Roi et la Dame d'atout) n'est pas géré automatiquement. Pensez à l'inclure dans les points que vous saisissez manuellement pour l'équipe concernée.</li>
                                <li><strong>Capot (250 points) :</strong> Si l'équipe preneuse réussit (remporte tous les plis), elle marque 250 points. Si elle chute, l'équipe adverse marque 250 points.</li>
                                <li><strong>Générale (500 points) :</strong> Si un joueur réussit seul à remporter tous les plis, son équipe marque 500 points. Si il chute, l'équipe adverse marque 500 points.</li>
                                <li><strong>Voir "Valeur Cartes" :</strong> pour le comptage des points, notamment Sans Atout et Tout Atout.</li>
                            </ul>
                        </div>
                        <p className="text-center text-slate-400 pt-4">Cette application sert d'aide au comptage. Les règles peuvent varier, adaptez la saisie à vos habitudes de jeu !</p>
                        <div className="text-center pt-6">
                            <a 
                                href="https://fr.wikipedia.org/w/index.php?title=Coinche&oldformat=true" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 rounded-lg bg-purple-700 text-white font-bold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
                            >
                                Voir les règles complètes sur Wikipedia
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
