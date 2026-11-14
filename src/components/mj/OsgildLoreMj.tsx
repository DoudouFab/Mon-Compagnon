import React, { useState } from 'react';
import {
  Map,
  MapPin,
  Shield,
  Crown,
  BookOpen,
  Sparkles,
  ExternalLink,
  Flame,
  Search,
  Copy,
  Check,
  Building,
  Coins,
  Skull,
} from 'lucide-react';
import {
  OSGILD_GEOGRAPHY_ASCII,
  OSGILD_REGIONS,
  OSGILD_FACTIONS_ASCII,
  OSGILD_FACTION_GROUPS,
  OSGILD_ACADEMIES,
  OSGILD_PANTHEON_ASCII,
  OSGILD_DEITIES,
} from '../../data/osgildLore';

export const OsgildLoreMj: React.FC = () => {
  const [osgildTab, setOsgildTab] = useState<
    'geographie' | 'geopolitique' | 'institutions' | 'theologie'
  >('geographie');

  const [institutionSearch, setInstitutionSearch] = useState('');
  const [copiedAscii, setCopiedAscii] = useState<string | null>(null);

  const copyAscii = (text: string, id: string) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(text).then(
          () => {
            setCopiedAscii(id);
            setTimeout(() => setCopiedAscii(null), 2000);
          },
          () => {}
        );
      }
    } catch {
      // Clipboard API unavailable in restricted iframe
    }
  };

  const filteredAcademies = OSGILD_ACADEMIES.filter(
    (a) =>
      a.name.toLowerCase().includes(institutionSearch.toLowerCase()) ||
      a.nature.toLowerCase().includes(institutionSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(institutionSearch.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Bannière d'en-tête Espace MJ Terres d'Osgild */}
      <div className="bg-gradient-to-r from-[#2c1a11] via-[#1c130d] to-[#120f0d] border-2 border-[#d4a84a] rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#d4a84a]/20 text-[#f3d48d] border border-[#d4a84a]/50 shadow-md shrink-0">
            <Map className="w-7 h-7 text-[#f3d48d]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif-co text-xl sm:text-2xl font-bold text-[#f3d48d]">
                Les Terres d&apos;Osgild · Guide Officiel du Meneur de Jeu
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-[#4d2417] text-[#ffd699] border border-[#d4a84a]/60">
                🔒 Espace Réservé MJ
              </span>
            </div>
            <p className="text-xs text-[#a0907d] mt-1 max-w-2xl leading-relaxed">
              Panorama complet et détaillé de la <b>géographie, géopolitique, institutions, théologie, magie et forces en présence</b> dans le monde officiel de Chroniques Oubliées Fantasy.
            </p>
          </div>
        </div>

        {/* Bouton vers Grimoire JdR externe */}
        <div className="shrink-0 flex items-center">
          <a
            href="https://doudoufab.github.io/grimoire-jdr-ok-/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3d2415] to-[#26150b] border-2 border-[#d4a84a] text-[#f3d48d] hover:text-white hover:border-[#f3d48d] hover:shadow-[0_0_15px_rgba(212,168,74,0.4)] text-xs font-bold transition-all transform hover:scale-[1.02] cursor-pointer"
            title="Consulter le Grimoire complet des Sorts Chroniques Oubliées dans un nouvel onglet"
          >
            <BookOpen className="w-4 h-4 text-[#d4a84a]" />
            <span>📖 Grimoire JdR (Sorts)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#a0907d]" />
          </a>
        </div>
      </div>

      {/* Navigation par onglets dédiés pour le MJ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-[#120e0b] p-1.5 rounded-2xl border border-[#3d3023]">
        <button
          type="button"
          onClick={() => setOsgildTab('geographie')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            osgildTab === 'geographie'
              ? 'bg-[#d4a84a] text-[#120e0b] shadow-md'
              : 'text-[#cbb8a7] hover:text-[#f3d48d] hover:bg-[#201710]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>1. Cartographie &amp; Géographie</span>
        </button>

        <button
          type="button"
          onClick={() => setOsgildTab('geopolitique')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            osgildTab === 'geopolitique'
              ? 'bg-[#d4a84a] text-[#120e0b] shadow-md'
              : 'text-[#cbb8a7] hover:text-[#f3d48d] hover:bg-[#201710]'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>2. Géopolitique &amp; Factions</span>
        </button>

        <button
          type="button"
          onClick={() => setOsgildTab('institutions')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            osgildTab === 'institutions'
              ? 'bg-[#d4a84a] text-[#120e0b] shadow-md'
              : 'text-[#cbb8a7] hover:text-[#f3d48d] hover:bg-[#201710]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>3. Institutions &amp; Ordres</span>
        </button>

        <button
          type="button"
          onClick={() => setOsgildTab('theologie')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            osgildTab === 'theologie'
              ? 'bg-[#d4a84a] text-[#120e0b] shadow-md'
              : 'text-[#cbb8a7] hover:text-[#f3d48d] hover:bg-[#201710]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>4. Théologie &amp; Croyances</span>
        </button>
      </div>

      {/* ========================================================
          ONGLET 1 : CARTOGRAPHIE & GÉOGRAPHIE
         ======================================================== */}
      {osgildTab === 'geographie' && (
        <div className="space-y-5">
          <div className="bg-[#181410] border border-[#3d3023] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30251a] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#d4a84a]">1.</span>
                <h4 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Cartographie et Géographie des Terres d&apos;Osgild
                </h4>
              </div>
              <button
                type="button"
                onClick={() => copyAscii(OSGILD_GEOGRAPHY_ASCII, 'geo')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#241a13] hover:bg-[#342417] text-[#a0907d] hover:text-[#f3d48d] text-[11px] border border-[#443322] cursor-pointer"
                title="Copier le schéma cartographique"
              >
                {copiedAscii === 'geo' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier ASCII</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#cbb8a7] leading-relaxed">
              Le monde d&apos;Osgild est un continent bordé par l&apos;océan à l&apos;ouest et au sud, et enserré par des barrières naturelles sauvages au nord et à l&apos;est.
            </p>

            {/* Schéma Cartographique ASCII */}
            <div className="p-4 bg-[#0d0a08] border border-[#3d2e1f] rounded-xl overflow-x-auto shadow-inner">
              <pre className="font-mono text-xs sm:text-sm text-[#f3d48d] leading-relaxed mx-auto select-all">
                {OSGILD_GEOGRAPHY_ASCII}
              </pre>
            </div>

            {/* Détails des 5 Régions Majeures */}
            <div className="space-y-3 pt-3">
              <b className="text-xs font-bold uppercase tracking-wider text-[#d4a84a] block">
                Les Régions Majeures :
              </b>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {OSGILD_REGIONS.map((reg, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#1e1712] border border-[#3d3023] hover:border-[#d4a84a]/60 transition-all space-y-2 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-serif-co text-sm font-bold text-[#f3d48d] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#d4a84a] shrink-0" />
                        <span>{reg.name}</span>
                      </h5>
                    </div>
                    <span className="text-[10px] text-[#ab8230] font-bold block uppercase tracking-wider">
                      {reg.subtitle}
                    </span>
                    <p className="text-xs text-[#ede3d1] leading-relaxed">
                      {reg.description}
                    </p>
                    {reg.pointsClefs && reg.pointsClefs.length > 0 && (
                      <div className="pt-2 border-t border-[#30251a] space-y-1">
                        <span className="text-[10px] font-bold text-[#9e907d] uppercase tracking-wider">
                          Points clefs pour le MJ :
                        </span>
                        <ul className="text-[11px] text-[#cbb8a7] list-disc list-inside space-y-0.5">
                          {reg.pointsClefs.map((pt, pidx) => (
                            <li key={pidx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 2 : GÉOPOLITIQUE ET ÉCHIQUIER DES FACTIONS
         ======================================================== */}
      {osgildTab === 'geopolitique' && (
        <div className="space-y-5">
          <div className="bg-[#181410] border border-[#3d3023] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30251a] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#d4a84a]">2.</span>
                <h4 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Géopolitique et Échiquier des Factions
                </h4>
              </div>
              <button
                type="button"
                onClick={() => copyAscii(OSGILD_FACTIONS_ASCII, 'fac')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#241a13] hover:bg-[#342417] text-[#a0907d] hover:text-[#f3d48d] text-[11px] border border-[#443322] cursor-pointer"
                title="Copier le schéma géopolitique"
              >
                {copiedAscii === 'fac' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier ASCII</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#cbb8a7] leading-relaxed">
              La géopolitique d&apos;Osgild repose sur un équilibre instable entre <b>féodalité morcelée</b>, <b>isolationnisme des races anciennes</b> et <b>menace constante du chaos externe</b>.
            </p>

            {/* Schéma Échiquier ASCII */}
            <div className="p-4 bg-[#0d0a08] border border-[#3d2e1f] rounded-xl overflow-x-auto shadow-inner">
              <pre className="font-mono text-xs sm:text-sm text-[#7db5ff] leading-relaxed mx-auto select-all">
                {OSGILD_FACTIONS_ASCII}
              </pre>
            </div>

            {/* Les 3 Blocs Factionnels détaillés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              {OSGILD_FACTION_GROUPS.map((grp, gidx) => (
                <div
                  key={gidx}
                  className="p-4 rounded-xl border space-y-3 text-xs shadow-sm flex flex-col justify-between"
                  style={{
                    backgroundColor: grp.bgColor,
                    borderColor: grp.borderColor,
                  }}
                >
                  <div className="space-y-3">
                    <b
                      className="font-serif-co text-sm font-bold block border-b pb-2"
                      style={{ color: grp.color, borderColor: grp.borderColor }}
                    >
                      {grp.title}
                    </b>

                    {grp.factions.map((f, fidx) => (
                      <div key={fidx} className="space-y-1.5 pt-1">
                        <div className="font-bold text-[#ede3d1] flex items-center justify-between">
                          <span>{f.name}</span>
                        </div>
                        <span className="text-[10px] text-[#d4a84a] font-semibold block">
                          Type : {f.type}
                        </span>
                        <div className="text-[11px] text-[#cbb8a7]">
                          <b className="text-[#e2d5c3]">Structure :</b> {f.structure}
                        </div>
                        <div className="text-[11px] text-[#a0907d] leading-relaxed">
                          <b className="text-[#e2d5c3]">Détails :</b> {f.details}
                        </div>
                        {f.pointsFriction && (
                          <div className="text-[10px] text-[#ffb088] bg-[#1a0e08]/60 p-2 rounded-lg border border-[#442211]">
                            <b>Tensions &amp; friction :</b> {f.pointsFriction}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 3 : INSTITUTIONS, ACADÉMIES ET ORDRES SAVANTS
         ======================================================== */}
      {osgildTab === 'institutions' && (
        <div className="space-y-5">
          <div className="bg-[#181410] border border-[#3d3023] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30251a] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#d4a84a]">3.</span>
                <h4 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Institutions, Académies et Ordres Savants
                </h4>
              </div>
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#a0907d]" />
                <input
                  type="text"
                  placeholder="Filtrer les académies ou rôles..."
                  value={institutionSearch}
                  onChange={(e) => setInstitutionSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#0f0d0b] border border-[#3d3023] rounded-xl text-xs text-[#ede3d1] focus:outline-none focus:border-[#d4a84a]"
                />
              </div>
            </div>

            <p className="text-xs text-[#cbb8a7] leading-relaxed">
              Le savoir et la pratique des arts magiques ou martiaux sont rigoureusement encadrés par des institutions influentes :
            </p>

            <div className="overflow-x-auto border border-[#3d3023] rounded-xl">
              <table className="w-full text-left text-xs divide-y divide-[#3d3023]">
                <thead className="bg-[#241a13] text-[#f3d48d] font-serif-co text-xs">
                  <tr>
                    <th className="p-3.5 font-bold">Organisation</th>
                    <th className="p-3.5 font-bold">Nature &amp; Structure</th>
                    <th className="p-3.5 font-bold">Rôle Géopolitique &amp; Pouvoir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2218] text-[#cbb8a7]">
                  {filteredAcademies.map((acad, idx) => (
                    <tr key={idx} className="hover:bg-[#1f1711] transition-colors">
                      <td className="p-3.5 font-bold text-[#ede3d1] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#d4a84a] shrink-0" />
                          <span>{acad.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-[#d4a84a] font-medium whitespace-nowrap">
                        {acad.nature}
                      </td>
                      <td className="p-3.5 leading-relaxed text-[#cbb8a7]">
                        {acad.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note pour le MJ */}
            <div className="p-3.5 rounded-xl bg-[#20150e] border border-[#4d301b] text-xs text-[#ffd699] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 text-[#d4a84a] mt-0.5" />
              <div>
                <b>Règle d&apos;or pour le Meneur de Jeu :</b> Toute quête impliquant de la magie ou de l&apos;argent attirera inévitablement l&apos;attention de ces institutions (enquêteurs d&apos;Arcanie, hérauts de Chevalerie ou agents de la Guilde d&apos;Alchimie).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ONGLET 4 : THÉOLOGIE ET SYSTÈMES DE CROYANCES
         ======================================================== */}
      {osgildTab === 'theologie' && (
        <div className="space-y-5">
          <div className="bg-[#181410] border border-[#3d3023] rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30251a] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#d4a84a]">4.</span>
                <h4 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Théologie et Systèmes de Croyances
                </h4>
              </div>
              <button
                type="button"
                onClick={() => copyAscii(OSGILD_PANTHEON_ASCII, 'pan')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#241a13] hover:bg-[#342417] text-[#a0907d] hover:text-[#f3d48d] text-[11px] border border-[#443322] cursor-pointer"
                title="Copier le schéma théologique"
              >
                {copiedAscii === 'pan' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier ASCII</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#cbb8a7] leading-relaxed">
              Dans Chroniques Oubliées, la foi accorde des pouvoirs concrets (magie divine). La religion n&apos;est pas seulement une croyance, c&apos;est une force cosmique mesurable.
            </p>

            {/* Schéma Panthéon ASCII */}
            <div className="p-4 bg-[#0d0a08] border border-[#3d2e1f] rounded-xl overflow-x-auto shadow-inner">
              <pre className="font-mono text-xs sm:text-sm text-[#ffd685] leading-relaxed mx-auto select-all">
                {OSGILD_PANTHEON_ASCII}
              </pre>
            </div>

            {/* Structure du Panthéon (3 branches) */}
            <div className="space-y-3 pt-2">
              <b className="text-xs font-bold uppercase tracking-wider text-[#d4a84a] block">
                Structure du Panthéon :
              </b>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Dieux du Bien & d'Ordre */}
                <div className="p-4 rounded-xl bg-[#1c1811] border border-[#523d29] space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#f3d48d]" />
                    <b className="font-serif-co text-sm text-[#f3d48d]">
                      Divinités de la Lumière &amp; du Droit
                    </b>
                  </div>
                  <span className="text-[10px] text-[#d4a84a] font-bold block uppercase">
                    (Ex: Justice, Soleil, Forge)
                  </span>
                  <p className="text-[#cbb8a7] leading-relaxed">
                    Vénérées par la noblesse, les guerriers, les paladins et les artisans.
                  </p>
                  <div className="pt-2 border-t border-[#30251a] text-[11px] text-[#ede3d1]">
                    <b>Temples &amp; Sanctuaires :</b> Édifices fortifiés au cœur des villes, servant à la fois de tribunaux, d&apos;hôpitaux et de banques.
                  </div>
                </div>

                {/* Dieux Neutres & Nature */}
                <div className="p-4 rounded-xl bg-[#151d18] border border-[#2b593f] space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8ee0aa]" />
                    <b className="font-serif-co text-sm text-[#8ee0aa]">
                      Divinités Éléments &amp; Nature
                    </b>
                  </div>
                  <span className="text-[10px] text-[#73bf8e] font-bold block uppercase">
                    (Ex: Tempêtes, Saisons, Océans)
                  </span>
                  <p className="text-[#cbb8a7] leading-relaxed">
                    Honorées par les marins, les paysans, les rôdeurs et les druides.
                  </p>
                  <div className="pt-2 border-t border-[#1f402c] text-[11px] text-[#ede3d1]">
                    <b>Culte d&apos;apaisement :</b> On offre des sacrifices et libations pour éviter les famines, les naufrages violents ou les sécheresses.
                  </div>
                </div>

                {/* Cultes Obscurs */}
                <div className="p-4 rounded-xl bg-[#241214] border border-[#6b262a] space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Skull className="w-4 h-4 text-[#ff9d9d]" />
                    <b className="font-serif-co text-sm text-[#ff9d9d]">
                      Les Cultes Obscurs
                    </b>
                  </div>
                  <span className="text-[10px] text-[#ff7878] font-bold block uppercase">
                    (Ex: Mort-Vivante, Discorde, Sang)
                  </span>
                  <p className="text-[#cbb8a7] leading-relaxed">
                    <b>Strictement illégaux</b> dans l&apos;ensemble des nations civilisées.
                  </p>
                  <div className="pt-2 border-t border-[#4d1a1d] text-[11px] text-[#ede3d1]">
                    <b>Lieux secrets :</b> Sanctuaires souterrains, cryptes et ruines maudites. Recherche de l&apos;immortalité par la nécromancie ou pactes démoniaques.
                  </div>
                </div>
              </div>
            </div>

            {/* Pouvoir Économique et Social de l'Église */}
            <div className="p-4 rounded-xl bg-[#1d1711] border border-[#443322] space-y-3 pt-3">
              <b className="text-xs font-bold uppercase tracking-wider text-[#d4a84a] flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#d4a84a]" />
                <span>Pouvoir Économique et Social de l&apos;Église en Osgild :</span>
              </b>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#14100c] border border-[#30251a]">
                  <b className="text-[#f3d48d] block mb-1">🏰 Propriété Foncière :</b>
                  <p className="text-[#cbb8a7] leading-relaxed text-[11px]">
                    Les grands ordres religieux possèdent des domaines agricoles entiers légués par de riches seigneurs en quête de salut pour leurs âmes.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#14100c] border border-[#30251a]">
                  <b className="text-[#f3d48d] block mb-1">👑 Pouvoir Politique :</b>
                  <p className="text-[#cbb8a7] leading-relaxed text-[11px]">
                    Les Hauts-Prêtres siègent fréquemment aux conseils des barons et ducs, leur avis pesant d&apos;un poids égal à celui des généraux ou des chanceliers.
                  </p>
                </div>
              </div>
            </div>

            {/* Fiches des Divinités Majeures */}
            <div className="space-y-3 pt-3">
              <b className="text-xs font-bold uppercase tracking-wider text-[#d4a84a] block">
                Grandes Divinités du Panthéon :
              </b>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {OSGILD_DEITIES.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#191410] border border-[#3d3023] hover:border-[#d4a84a]/60 transition-all space-y-1.5 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="font-serif-co text-sm text-[#f3d48d]">{d.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#2b1f13] text-[#f3d48d] border border-[#523d29]">
                        {d.alignment}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#d4a84a] font-semibold">{d.title}</div>
                    <div className="text-[10px] text-[#9e907d]">
                      <b>Domaines :</b> {d.domains}
                    </div>
                    <div className="text-[10px] text-[#ede3d1] italic">
                      <b>Symbole :</b> {d.symbol}
                    </div>
                    <p className="text-[#cbb8a7] text-[11px] leading-relaxed pt-1.5 border-t border-[#30251a]">
                      {d.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
