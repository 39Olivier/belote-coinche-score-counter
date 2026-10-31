import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Round, Team } from '../types';
import { ChartLineIcon } from './icons/Icons';

interface ScoreChartProps {
  rounds: Round[];
  teamNames: { nous: string; eux: string };
  targetScore?: number;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({
  rounds,
  teamNames,
  targetScore = 1000,
}) => {
  const [viewMode, setViewMode] = useState<'cumulative' | 'roundByRound'>('cumulative');

  // Rounds are stored newest-first in the parent state, so reverse for chronological order
  const chartData = useMemo(() => {
    const chronological = [...rounds].reverse();

    let cumNous = 0;
    let cumEux = 0;

    const points = [
      {
        tourLabel: 'Départ',
        tourShort: '0',
        scoreNous: 0,
        scoreEux: 0,
        roundNous: 0,
        roundEux: 0,
        details: 'Début de partie',
      },
      ...chronological.map((r, index) => {
        cumNous += r.nous;
        cumEux += r.eux;
        return {
          tourLabel: `Tour ${index + 1}`,
          tourShort: `T${index + 1}`,
          scoreNous: cumNous,
          scoreEux: cumEux,
          roundNous: r.nous,
          roundEux: r.eux,
          bidder: r.bidder,
          contract: r.contract === 500 ? 'Générale' : r.contract === 250 ? 'Capot' : `${r.contract}`,
          suit: r.suit,
          details: r.details,
        };
      }),
    ];

    return points;
  }, [rounds]);

  // Summary statistics
  const stats = useMemo(() => {
    if (rounds.length === 0) return null;
    const totals = rounds.reduce(
      (acc, r) => ({ nous: acc.nous + r.nous, eux: acc.eux + r.eux }),
      { nous: 0, eux: 0 }
    );
    const diff = Math.abs(totals.nous - totals.eux);
    const leader =
      totals.nous > totals.eux
        ? teamNames.nous
        : totals.eux > totals.nous
        ? teamNames.eux
        : null;

    let maxRoundNous = 0;
    let maxRoundEux = 0;
    rounds.forEach((r) => {
      if (r.nous > maxRoundNous) maxRoundNous = r.nous;
      if (r.eux > maxRoundEux) maxRoundEux = r.eux;
    });

    return {
      totalRounds: rounds.length,
      leader,
      diff,
      maxRoundNous,
      maxRoundEux,
    };
  }, [rounds, teamNames]);

  const maxScore = useMemo(() => {
    if (chartData.length === 0) return targetScore;
    const highestVal = Math.max(
      ...chartData.map((d) =>
        viewMode === 'cumulative'
          ? Math.max(d.scoreNous, d.scoreEux)
          : Math.max(d.roundNous, d.roundEux)
      )
    );
    return Math.max(highestVal + 100, targetScore);
  }, [chartData, viewMode, targetScore]);

  return (
    <div className="bg-slate-800/60 rounded-xl shadow-2xl p-5 border border-slate-700/80 mb-8 backdrop-blur-sm">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <ChartLineIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200">
              Évolution des Scores
            </h3>
            <p className="text-xs text-slate-400">
              Graphique dynamique de progression manche par manche
            </p>
          </div>
        </div>

        {rounds.length > 0 && (
          <div className="flex items-center p-1 bg-slate-900/80 rounded-lg border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setViewMode('cumulative')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'cumulative'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cumulé
            </button>
            <button
              onClick={() => setViewMode('roundByRound')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'roundByRound'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Par Tour
            </button>
          </div>
        )}
      </div>

      {/* Stats Quick Badges */}
      {stats && stats.totalRounds > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/40 text-center">
            <span className="block text-[11px] text-slate-400 uppercase font-medium">
              Tours joués
            </span>
            <span className="text-base font-bold text-slate-200">
              {stats.totalRounds}
            </span>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/40 text-center">
            <span className="block text-[11px] text-slate-400 uppercase font-medium">
              Avance
            </span>
            <span
              className={`text-base font-bold truncate ${
                stats.leader === teamNames.nous
                  ? 'text-cyan-400'
                  : stats.leader === teamNames.eux
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }`}
            >
              {stats.leader ? `+${stats.diff} pts` : 'Égalité'}
            </span>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-cyan-900/30 text-center">
            <span className="block text-[11px] text-cyan-400/80 uppercase font-medium truncate">
              Max {teamNames.nous}
            </span>
            <span className="text-base font-bold text-cyan-400">
              {stats.maxRoundNous} pts
            </span>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-2.5 border border-amber-900/30 text-center">
            <span className="block text-[11px] text-amber-400/80 uppercase font-medium truncate">
              Max {teamNames.eux}
            </span>
            <span className="text-base font-bold text-amber-400">
              {stats.maxRoundEux} pts
            </span>
          </div>
        </div>
      )}

      {/* Chart Canvas or Empty State */}
      {rounds.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 rounded-lg border border-dashed border-slate-700/70 mt-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
            <ChartLineIcon className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">
            Aucun tour enregistré
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Ajoutez votre premier tour pour voir la courbe de score s&apos;animer en temps réel.
          </p>
        </div>
      ) : (
        <div className="w-full h-72 sm:h-80 mt-2 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
              <XAxis
                dataKey="tourShort"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                domain={[0, viewMode === 'cumulative' ? maxScore : 'auto']}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl backdrop-blur-md text-xs min-w-[190px]">
                        <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-700 font-semibold text-slate-300">
                          <span>{data.tourLabel}</span>
                          {data.contract && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px]">
                              {data.contract} {data.suit}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-cyan-400">
                            <span className="font-semibold truncate max-w-[100px]">
                              {teamNames.nous} :
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm">
                                {viewMode === 'cumulative' ? data.scoreNous : data.roundNous}
                              </span>
                              {viewMode === 'cumulative' && data.roundNous > 0 && (
                                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1 rounded">
                                  +{data.roundNous}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-amber-400">
                            <span className="font-semibold truncate max-w-[100px]">
                              {teamNames.eux} :
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm">
                                {viewMode === 'cumulative' ? data.scoreEux : data.roundEux}
                              </span>
                              {viewMode === 'cumulative' && data.roundEux > 0 && (
                                <span className="text-[10px] bg-amber-950 text-amber-300 px-1 rounded">
                                  +{data.roundEux}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {data.details && data.tourShort !== '0' && (
                          <p className="mt-2 text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 truncate">
                            {data.details}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  paddingBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              />

              {viewMode === 'cumulative' && (
                <ReferenceLine
                  y={targetScore}
                  stroke="#22c55e"
                  strokeDasharray="4 4"
                  label={{
                    value: `Victoire (${targetScore} pts)`,
                    fill: '#86efac',
                    fontSize: 11,
                    position: 'insideTopRight',
                  }}
                />
              )}

              <Line
                type="monotone"
                dataKey={viewMode === 'cumulative' ? 'scoreNous' : 'roundNous'}
                name={teamNames.nous}
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ fill: '#22d3ee', stroke: '#083344', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#67e8f9', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey={viewMode === 'cumulative' ? 'scoreEux' : 'roundEux'}
                name={teamNames.eux}
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', stroke: '#451a03', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#fcd34d', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
