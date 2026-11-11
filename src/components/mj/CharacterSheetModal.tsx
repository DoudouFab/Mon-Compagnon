/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Shield,
  Heart,
  Zap,
  Swords,
  Crosshair,
  Sparkles,
  Package,
  BookOpen,
  Info,
} from 'lucide-react';
import { Character, CaracName, ProfilData } from '../../types/chroniques';
import { calcStats, CARAC_LIST, PROFILS, RACES, VOIES_CATALOG } from '../../data/coDatabase';
import { StateBadgeList } from '../common/StateBadgeList';

interface CharacterSheetModalProps {
  pj: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleState?: (stName: string) => void;
}

export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({
  pj,
  isOpen,
  onClose,
  onToggleState,
}) => {
  if (!isOpen || !pj) return null;

  const st = calcStats(pj);
  const pr = (PROFILS.find((x) => x.id === pj.profil) as ProfilData | undefined) || {
    id: pj.profil,
    n: pj.profil,
    dv: 8,
    traits: '',
    mag: undefined,
  };
  const rc = RACES.find((x) => x.id === pj.race) || {
    id: pj.race,
    n: pj.race,
    d: '',
  };

  const hpMax = pj.hpMaxManual || (st ? st.hpMax : 10);
  const hpPct = Math.max(0, Math.min(100, Math.round((100 * pj.hp) / Math.max(1, hpMax))));
  const hpColor = hpPct > 50 ? '#6fa85b' : hpPct > 25 ? '#c97d32' : '#cf5544';

  const pmMax = st ? st.pmMax : 0;
  const pmCurrent = pj.pm !== undefined && pj.pm !== null ? pj.pm : pmMax;
  const pmPct = pmMax > 0 ? Math.max(0, Math.min(100, Math.round((100 * pmCurrent) / pmMax))) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-xl w-full max-w-4xl shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header avec Identité */}
        <div className="flex items-start justify-between border-b border-[#3d3023] pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  pj.isPnj
                    ? 'bg-[#18283a] text-[#7db5ff] border border-[#2b4c6f]'
                    : 'bg-[#291e13] text-[#f3d48d] border border-[#d4a84a]/50'
                }`}
              >
                {pj.isPnj ? pj.rolePnj || 'PNJ Allié' : 'Personnage Joueur (PJ)'}
              </span>
              <h3 className="font-serif-co text-2xl font-bold text-[#f3d48d]">
                {pj.name}
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#231c15] text-[#ede3d1] border border-[#3d3023]">
                Niveau {pj.level}
              </span>
            </div>
            <p className="text-xs text-[#9e907d] mt-1">
              <b>{rc.n}</b> · <b>{pr.n}</b> (Dé de Vie d{pr.dv}) {pj.player && <span>• Joueur : {pj.player}</span>}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Jauges Vitalité & Mana */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* PV */}
          <div className="p-3 bg-[#1e1313] border border-[#4d2828] rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#ff9999]">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#cf5544]" /> Points de Vie (PV)
              </span>
              <span className="text-[11px] text-[#9e907d]">Vitalité : {hpPct}%</span>
            </div>
            <div className="relative h-7 bg-[#0c0a08] border border-[#3d2020] rounded-lg overflow-hidden shadow-inner">
              <div
                className="h-full transition-all duration-300 rounded-l-lg"
                style={{
                  width: `${hpPct}%`,
                  background: `linear-gradient(90deg, ${hpColor}cc 0%, ${hpColor} 100%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {pj.hp} / {hpMax} PV
              </div>
            </div>
          </div>

          {/* PM */}
          <div className="p-3 bg-[#121929] border border-[#2b3d63] rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#99bbff]">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#4a85cf]" /> Points de Mana (PM)
              </span>
              <span className="text-[11px] text-[#9e907d]">Réserve : {pmPct}%</span>
            </div>
            <div className="relative h-7 bg-[#0c0a08] border border-[#1b2b4d] rounded-lg overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#214878] via-[#2d61a0] to-[#5194ea] transition-all duration-300 rounded-l-lg"
                style={{ width: `${pmPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {pmCurrent} / {pmMax} PM
              </div>
            </div>
          </div>
        </div>

        {/* Scores de Combat Clés */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 bg-[#231c15] border border-[#3d3023] rounded-xl">
            <span className="text-[10px] text-[#9e907d] uppercase font-bold block">Défense (DEF)</span>
            <b className="font-serif-co text-xl text-[#6fa85b]">{st ? st.def : 10}</b>
            <span className="text-[10px] text-[#9e907d] block mt-0.5">
              Armure: {pj.arm || 'Aucune'}
            </span>
          </div>
          <div className="p-2.5 bg-[#231c15] border border-[#3d3023] rounded-xl">
            <span className="text-[10px] text-[#9e907d] uppercase font-bold block">Initiative</span>
            <b className="font-serif-co text-xl text-[#f3d48d]">{st ? st.init : 10}</b>
            <span className="text-[10px] text-[#9e907d] block mt-0.5">DEX + Bonus</span>
          </div>
          <div className="p-2.5 bg-[#231c15] border border-[#3d3023] rounded-xl">
            <span className="text-[10px] text-[#ff9999] uppercase font-bold block flex items-center justify-center gap-1">
              <Swords className="w-3 h-3" /> Contact
            </span>
            <b className="font-serif-co text-xl text-[#ffa8a8]">
              {st && st.ct >= 0 ? `+${st.ct}` : st ? st.ct : 0}
            </b>
            <span className="text-[10px] text-[#9e907d] block mt-0.5">Niveau + FOR</span>
          </div>
          <div className="p-2.5 bg-[#231c15] border border-[#3d3023] rounded-xl">
            <span className="text-[10px] text-[#ffcc88] uppercase font-bold block flex items-center justify-center gap-1">
              <Crosshair className="w-3 h-3" /> Distance
            </span>
            <b className="font-serif-co text-xl text-[#ffd299]">
              {st && st.di >= 0 ? `+${st.di}` : st ? st.di : 0}
            </b>
            <span className="text-[10px] text-[#9e907d] block mt-0.5">Niveau + DEX</span>
          </div>
          <div className="p-2.5 bg-[#231c15] border border-[#3d3023] rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#cbafff] uppercase font-bold block flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> Magie
            </span>
            <b className="font-serif-co text-xl text-[#e4d4ff]">
              {st && st.mg !== null ? (st.mg >= 0 ? `+${st.mg}` : st.mg) : '-'}
            </b>
            <span className="text-[10px] text-[#9e907d] block mt-0.5">
              {pr.mag ? `Niveau + ${pr.mag}` : 'Non-magique'}
            </span>
          </div>
        </div>

        {/* Bloc 6 Caractéristiques (FOR, DEX, CON, INT, SAG, CHA) */}
        <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3.5 space-y-2">
          <span className="text-[10px] font-bold text-[#d4a84a] uppercase tracking-wider block">
            Caractéristiques &amp; Modificateurs
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            {CARAC_LIST.map((c) => {
              const baseVal = pj.base[c] || 10;
              const racialMod = pj.rb[c] || 0;
              const totalVal = baseVal + racialMod;
              const mod = st ? st.m[c] : 0;
              return (
                <div key={c} className="p-2 bg-[#181410] border border-[#30251a] rounded-lg">
                  <span className="text-[10px] text-[#9e907d] uppercase font-bold block">{c}</span>
                  <b className="font-serif-co text-lg text-[#ede3d1]">{totalVal}</b>
                  <div
                    className={`text-xs font-bold font-mono ${
                      mod >= 0 ? 'text-[#6fa85b]' : 'text-[#cf5544]'
                    }`}
                  >
                    {mod >= 0 ? `+${mod}` : mod}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* États Préjudiciables */}
        <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#d4a84a] uppercase tracking-wider">
              États Préjudiciables
            </span>
            <span className="text-[10px] text-[#9e907d]">
              {(pj.etats || []).length} actif(s)
            </span>
          </div>
          <StateBadgeList
            activeStates={pj.etats || []}
            onToggleState={onToggleState}
            allowEdit={!!onToggleState}
          />
        </div>

        {/* Armes & Attaques */}
        <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3.5 space-y-2">
          <span className="text-[10px] font-bold text-[#d4a84a] uppercase tracking-wider block">
            Armes Équipées &amp; Attaques
          </span>
          {pj.armes && pj.armes.length > 0 ? (
            <div className="space-y-1.5">
              {pj.armes.map((w, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-[#181410] border border-[#30251a] rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <b className="text-[#f3d48d]">{w.n}</b>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#2e1d13] text-[#f7d6a1] border border-[#523d24]">
                      {w.t}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[#ff9999] font-bold">DM : {w.dm}</span>
                    <span className="text-[#ede3d1]">Crit : {w.crit}</span>
                    <span className="text-[#99bbff]">Portée : {w.por}</span>
                  </div>
                  {w.props && <p className="w-full text-[11px] text-[#9e907d]">{w.props}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#9e907d] italic">Aucune arme équipée.</p>
          )}
        </div>

        {/* Capacités raciales */}
        {Array.isArray((rc as any).cap) && (rc as any).cap.length > 0 && (
          <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold text-[#d4a84a] uppercase tracking-wider block">
              Capacités raciales ({(rc as any).n})
            </span>
            {(rc as any).cap.map((k: any, i: number) => (
              <p key={i} className="text-[11px] text-[#ede3d1]">
                <b>{k.n} :</b> {k.t}
              </p>
            ))}
          </div>
        )}

        {/* Voies & Capacités acquises */}
        <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3.5 space-y-2">
          <span className="text-[10px] font-bold text-[#d4a84a] uppercase tracking-wider block">
            Voies &amp; Rangs de Capacités
          </span>
          {(() => {
            const ways: Record<string, number[]> = {};
            (pj.caps || []).forEach((c) => {
              (ways[c.wayKey] = ways[c.wayKey] || []).push(c.rank);
            });
            return (
              <div className="space-y-1.5">
                <div className="text-[11px] text-[#cbb8a7]">
                  Points de capacité à dépenser : <b className="text-[#f3d48d]">{pj.ptsCap || 0}</b>
                  {pj.ptsCapCadeaux ? <span> (dont {pj.ptsCapCadeaux} cadeau(x) RP)</span> : null}
                </div>
                {Object.keys(ways).map((k) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-2 text-[11px] bg-[#181410] border border-[#30251a] px-2.5 py-1.5 rounded-lg"
                  >
                    <span className="text-[#ede3d1]">{VOIES_CATALOG[k] ? VOIES_CATALOG[k].nom : k}</span>
                    <span className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <span
                          key={r}
                          className={`w-3.5 h-3.5 rounded-full border ${
                            ways[k].includes(r) ? 'bg-[#d4a84a] border-[#f3d48d]' : 'bg-transparent border-[#523d24]'
                          }`}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
          {pj.caps && pj.caps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {pj.caps.map((c, i) => {
                const way = VOIES_CATALOG[c.wayKey];
                const rankObj = way?.r?.[c.rank - 1];
                return (
                  <div
                    key={i}
                    className="p-2.5 bg-[#181410] border border-[#30251a] rounded-lg space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <b className="text-[#d4a84a]">{way ? way.nom : c.wayKey}</b>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#382b1b] text-[#f3d48d]">
                        Rang {c.rank}
                      </span>
                    </div>
                    {rankObj && (
                      <p className="text-[11px] text-[#ede3d1]">
                        <b>{rankObj.n} :</b> {rankObj.t}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#9e907d] italic">Aucune capacité apprise.</p>
          )}
        </div>

        {/* Inventaire emporté */}
        <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#d4a84a] uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Inventaire &amp; Sacoche
            </span>
            <span className="text-[10px] text-[#9e907d]">
              {(pj.inventaire || []).length} objet(s)
            </span>
          </div>
          {pj.inventaire && pj.inventaire.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {pj.inventaire.map((it, i) => (
                <div
                  key={i}
                  className="p-2 bg-[#181410] border border-[#30251a] rounded-lg flex items-center justify-between gap-2"
                >
                  <div>
                    <b className="text-[#ede3d1] block">{it.n}</b>
                    {it.desc && <p className="text-[11px] text-[#9e907d] line-clamp-1">{it.desc}</p>}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#f3d48d] px-2 py-0.5 rounded bg-[#231c15] border border-[#3d3023] shrink-0">
                    ×{it.q || 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#9e907d] italic">Sacoche vide.</p>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-[#30251a]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#d4a84a] hover:bg-[#e0b555] text-black font-bold text-xs rounded-lg shadow-md"
          >
            Fermer la Fiche
          </button>
        </div>
      </div>
    </div>
  );
};
