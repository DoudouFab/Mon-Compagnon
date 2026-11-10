import React from 'react';
import { X, Printer, Shield, Swords, Sparkles, Heart, Zap, User } from 'lucide-react';
import { Character, ClassWay, ProfilData, RaceData } from '../../types/chroniques';
import { calcStats, PROFILS, RACES, VOIES_CATALOG } from '../../data/coDatabase';

interface BbeOfficialSheetModalProps {
  pj: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BbeOfficialSheetModal: React.FC<BbeOfficialSheetModalProps> = ({
  pj,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !pj) return null;

  const st = calcStats(pj);
  const pr: ProfilData = PROFILS.find((x) => x.id === pj.profil) || {
    id: pj.profil,
    n: pj.profil,
    dv: 8,
    traits: '',
    eq: '',
    ar: '',
  };
  const rc: RaceData = RACES.find((x) => x.id === pj.race) || {
    id: pj.race,
    n: pj.race,
    defb: 0,
    d: '',
    t: '',
    traits: '',
    cap: [],
    b: {},
  };

  // Get active class ways for this hero
  const activeWays: { wayKey: string; way: ClassWay; currentRank: number }[] = [];
  const knownWayKeys = new Set<string>();

  pj.caps.forEach((c) => {
    if (!knownWayKeys.has(c.wayKey) && VOIES_CATALOG[c.wayKey]) {
      knownWayKeys.add(c.wayKey);
      activeWays.push({
        wayKey: c.wayKey,
        way: VOIES_CATALOG[c.wayKey],
        currentRank: c.rank,
      });
    }
  });

  // If less than 5, complete with class ways
  if (activeWays.length < 5) {
    Object.entries(VOIES_CATALOG).forEach(([k, w]) => {
      if (activeWays.length < 5 && w.profil === pj.profil && !knownWayKeys.has(k)) {
        knownWayKeys.add(k);
        activeWays.push({ wayKey: k, way: w, currentRank: 0 });
      }
    });
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      {/* Container A4 format */}
      <div className="bg-[#fcfaf7] text-[#111111] w-full max-w-4xl rounded-xl shadow-2xl border-2 border-[#8a6828] max-h-[96vh] flex flex-col overflow-hidden">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="no-print bg-[#1a130b] text-[#ede3d1] px-5 py-3 border-b border-[#d4a84a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#f3d48d] font-bold font-serif-co text-base">
              Fiche de Personnage Officielle A4 · Chroniques Oubliées Fantasy
            </span>
            <span className="text-[10px] bg-[#3d2a17] text-[#d4a84a] px-2 py-0.5 rounded border border-[#d4a84a]/40">
              Format officiel BBE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#d4a84a] hover:bg-[#e0b555] text-black font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer la Fiche (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto font-sans leading-tight bg-[#fdfbf7] print:p-0 print:m-0 print:bg-white text-black">
          {/* HEADER BBE */}
          <div className="border-b-2 border-black pb-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h1 className="font-serif-co text-2xl sm:text-3xl font-extrabold tracking-wider text-black">
                  CHRONIQUES OUBLIÉES
                </h1>
                <span className="text-xs uppercase tracking-widest font-bold text-gray-700 block">
                  Feuille de Personnage Fantasy · Système d20
                </span>
              </div>
              <div className="text-right text-[11px] font-mono text-gray-600">
                Édition Compagnon · Doudou, F.P
              </div>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Nom :</span>
                <b className="text-sm font-serif-co">{pj.name || 'Héros'}</b>
              </div>
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Joueur :</span>
                <b>{pj.player || '—'}</b>
              </div>
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Race :</span>
                <b>{rc.n}</b>
              </div>
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Profil &amp; Niveau :</span>
                <b>
                  {pr.n} — Niveau {pj.level}
                </b>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Dé de Vie :</span>
                <b>d{pr.dv}</b>
              </div>
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Déplacement :</span>
                <b>{st?.deplacement || 10} m</b>
              </div>
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Âge / Taille :</span>
                <b>{rc.ageDepart ? `${rc.ageDepart} · ${rc.taille || 'Moyenne'}` : 'Adulte'}</b>
              </div>
              <div className="border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Magie associée :</span>
                <b>{pr.mag ? `${pr.mag} (${st?.m[pr.mag] && st.m[pr.mag] >= 0 ? `+${st.m[pr.mag]}` : st?.m[pr.mag]})` : 'Aucune'}</b>
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN SECTION (STATS & COMBAT LEFT, WAYS & GEAR RIGHT) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* LEFT COLUMN: CARACS & COMBAT (5/12) */}
            <div className="md:col-span-5 space-y-4">
              {/* 1. CARACTÉRISTIQUES TABLE */}
              <div className="border-2 border-black rounded-lg p-2 bg-white">
                <h3 className="font-serif-co text-xs font-bold uppercase tracking-wider text-center border-b border-black pb-1 mb-2">
                  Caractéristiques &amp; Modificateurs
                </h3>
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 text-[10px] text-gray-600 uppercase">
                      <th className="py-1 text-left">Carac.</th>
                      <th className="py-1">Score</th>
                      <th className="py-1">Mod.</th>
                      <th className="py-1 text-right">Test (d20)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(['FOR', 'DEX', 'CON', 'INT', 'SAG', 'CHA'] as const).map((c) => {
                      const total = (pj.base[c] || 10) + (pj.rb[c] || 0);
                      const mod = st ? st.m[c] : 0;
                      return (
                        <tr key={c} className="border-b border-gray-200">
                          <td className="py-1 text-left font-bold">{c}</td>
                          <td className="py-1 font-mono font-bold text-sm">{total}</td>
                          <td className="py-1 font-mono font-bold text-sm bg-gray-100 rounded">
                            {mod >= 0 ? `+${mod}` : mod}
                          </td>
                          <td className="py-1 text-right font-mono text-gray-700">
                            d20 {mod >= 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 2. COMBAT STATS */}
              <div className="border-2 border-black rounded-lg p-2.5 bg-white space-y-2">
                <h3 className="font-serif-co text-xs font-bold uppercase tracking-wider text-center border-b border-black pb-1">
                  Survie &amp; Combat
                </h3>

                {/* PV & PM & DEF */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-black rounded p-1.5">
                    <span className="text-[9px] text-gray-600 block uppercase font-bold">Points de Vie</span>
                    <b className="text-lg font-mono font-bold block">{st?.hpMax || 10}</b>
                    <small className="text-[9px] text-gray-500">Actuels : {pj.hp}</small>
                  </div>

                  <div className="border border-black rounded p-1.5">
                    <span className="text-[9px] text-gray-600 block uppercase font-bold">Défense</span>
                    <b className="text-lg font-mono font-bold block">{st?.def || 10}</b>
                    <small className="text-[9px] text-gray-500">10 + DEX + Arm</small>
                  </div>

                  <div className="border border-black rounded p-1.5">
                    <span className="text-[9px] text-gray-600 block uppercase font-bold">Points de Mana</span>
                    <b className="text-lg font-mono font-bold block">{st?.pmMax || 0}</b>
                    <small className="text-[9px] text-gray-500">Actuels : {pj.pm ?? 0}</small>
                  </div>
                </div>

                {/* INITIATIVE & ATTAQUES */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs pt-1 border-t border-gray-300">
                  <div className="bg-gray-50 p-1 rounded border border-gray-300">
                    <span className="text-[9px] text-gray-600 block uppercase font-bold">Initiative</span>
                    <b className="font-mono">{st?.init || 10}</b>
                  </div>
                  <div className="bg-gray-50 p-1 rounded border border-gray-300">
                    <span className="text-[9px] text-gray-600 block uppercase font-bold">Att. Contact</span>
                    <b className="font-mono">{st && st.ct >= 0 ? `+${st.ct}` : st?.ct}</b>
                  </div>
                  <div className="bg-gray-50 p-1 rounded border border-gray-300">
                    <span className="text-[9px] text-gray-600 block uppercase font-bold">Att. Distance</span>
                    <b className="font-mono">{st && st.di >= 0 ? `+${st.di}` : st?.di}</b>
                  </div>
                </div>

                {st?.mg !== null && st?.mg !== undefined && (
                  <div className="bg-purple-50 p-1 rounded border border-purple-300 text-center text-xs">
                    <span className="text-[9px] text-purple-700 uppercase font-bold">Attaque Magique ({pr.mag}) : </span>
                    <b className="font-mono text-purple-900">{st.mg >= 0 ? `+${st.mg}` : st.mg}</b>
                  </div>
                )}

                {/* ARMURES ÉQUIPÉES */}
                <div className="text-xs pt-1 border-t border-gray-200">
                  <div>
                    <span className="text-gray-600 font-bold">Armure :</span> {pj.arm || 'Aucune'}
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold">Bouclier :</span> {pj.bou || 'Aucun'}
                  </div>
                </div>
              </div>

              {/* 3. ARMES & ATTAQUES TABLE */}
              <div className="border-2 border-black rounded-lg p-2.5 bg-white space-y-1">
                <h3 className="font-serif-co text-xs font-bold uppercase tracking-wider text-center border-b border-black pb-1 mb-1">
                  Armes &amp; Attaques
                </h3>
                {pj.armes && pj.armes.length > 0 ? (
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300 text-[9px] text-gray-600 uppercase text-left">
                        <th className="py-0.5">Arme</th>
                        <th className="py-0.5">DM</th>
                        <th className="py-0.5">Crit.</th>
                        <th className="py-0.5">Portée</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pj.armes.map((w, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-1 font-bold">{w.n}</td>
                          <td className="py-1 font-mono">{w.dm}</td>
                          <td className="py-1 font-mono">{w.crit || '20'}</td>
                          <td className="py-1">{w.por || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-xs text-gray-500 italic text-center py-2">
                    Aucune arme enregistrée
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: 5 CLASS WAYS & RANKS (7/12) */}
            <div className="md:col-span-7 space-y-3">
              <div className="border-2 border-black rounded-lg p-2.5 bg-white">
                <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                  <h3 className="font-serif-co text-xs font-bold uppercase tracking-wider">
                    Voies Héroïques (5 Voies de Profil)
                  </h3>
                  <span className="text-[10px] text-gray-600 font-mono">
                    Pts restants : {pj.ptsCap || 0}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeWays.map((aw, wIdx) => (
                    <div
                      key={aw.wayKey}
                      className="border border-gray-400 rounded p-1.5 bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between text-xs font-bold font-serif-co border-b border-gray-300 pb-0.5 mb-1">
                        <span>
                          {wIdx + 1}. {aw.way.nom}
                        </span>
                        <span className="text-[10px] font-mono text-gray-600 font-normal">
                          Rang {aw.currentRank} / 5
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        {aw.way.r.map((rk, rIdx) => {
                          const rankNum = rIdx + 1;
                          const isAcquired = aw.currentRank >= rankNum;
                          return (
                            <div
                              key={rankNum}
                              className={`text-[10px] flex items-start gap-1.5 p-1 rounded ${
                                isAcquired
                                  ? 'bg-amber-100/70 border border-amber-300 font-semibold'
                                  : 'opacity-60'
                              }`}
                            >
                              <span className="font-mono font-bold shrink-0">
                                [{isAcquired ? 'X' : ' '}] R{rankNum} :
                              </span>
                              <div className="leading-tight">
                                <b>{rk.n}</b> — <span className="text-gray-700">{rk.t}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: INVENTORY, GEAR & SPELLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t-2 border-black">
            {/* Gear & Inventory */}
            <div className="border border-black rounded-lg p-2 bg-white text-xs space-y-1">
              <h4 className="font-serif-co text-[11px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1">
                Équipement &amp; Barda du Voyageur
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-0.5 text-[11px]">
                {pj.inventaire && pj.inventaire.length > 0 ? (
                  pj.inventaire.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-gray-100 py-0.5">
                      <span>• {it.n}</span>
                      <span className="text-gray-500 font-mono">x{it.q}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 italic">Inventaire vide</span>
                )}
              </div>
            </div>

            {/* Custom Spells or Notes */}
            <div className="border border-black rounded-lg p-2 bg-white text-xs space-y-1">
              <h4 className="font-serif-co text-[11px] font-bold uppercase tracking-wider border-b border-gray-300 pb-1">
                Sorts Mémorisés &amp; Rituels
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-1 text-[11px]">
                {pj.customSorts && pj.customSorts.length > 0 ? (
                  pj.customSorts.map((sp, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-0.5">
                      <b className="text-purple-900">• {sp.n} (R{sp.rang}) :</b> {sp.t}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    {pr.mag
                      ? 'Consultez les capacités de sorts acquises dans vos voies de magie.'
                      : 'Ce profil ne lance pas de sortilèges majeurs.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* OFFICIAL FOOTER NOTICE & DISCREET SIGNATURE */}
          <div className="mt-4 pt-2 border-t border-gray-300 flex items-center justify-between text-[9px] text-gray-500 font-mono">
            <span>
              Chroniques Oubliées Fantasy © Black Book Éditions. DRS officiel co-drs.org.
            </span>
            <span className="font-semibold text-gray-700">
              Doudou, F.P
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
