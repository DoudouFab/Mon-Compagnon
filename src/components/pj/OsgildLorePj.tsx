import React, { useState } from 'react';
import {
  Map,
  MapPin,
  Sparkles,
  Shield,
  BookOpen,
  Compass,
  Crosshair,
  Scroll,
} from 'lucide-react';
import {
  OSGILD_GEOGRAPHY_ASCII,
  OSGILD_REGIONS,
  OSGILD_ACADEMIES,
  OSGILD_DEITIES,
} from '../../data/osgildLore';

export const OsgildLorePj: React.FC = () => {
  const [filterRegion, setFilterRegion] = useState<string>('all');

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Bannière Osgild (Version Joueur) */}
      <div className="bg-gradient-to-r from-[#2c1a11] via-[#1a120c] to-[#120f0d] border-2 border-[#d4a84a]/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#d4a84a]/20 text-[#f3d48d] border border-[#d4a84a]/40 shadow-sm shrink-0">
            <Compass className="w-7 h-7 text-[#f3d48d]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-co text-xl sm:text-2xl font-bold text-[#f3d48d]">
                Le Monde d&apos;Osgild · Guide du Voyageur
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2b1e13] text-[#d4a84a] border border-[#523d29]">
                Savoirs Connus des Héros
              </span>
            </div>
            <p className="text-xs text-[#a0907d] mt-1 max-w-2xl leading-relaxed">
              Tout ce que votre aventurier sait sur la géographie du continent, les royaumes féodaux, les dieux tutélaires et les ordres célèbres d&apos;Osgild.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Carte & Les 5 Régions Majeures */}
      <div className="bg-[#181410] border border-[#3d3023] rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-[#30251a] pb-3">
          <h4 className="font-serif-co text-base font-bold text-[#f3d48d] flex items-center gap-2">
            <Map className="w-4 h-4 text-[#d4a84a]" />
            <span>1. Carte du Monde Connu &amp; Grandes Régions</span>
          </h4>
        </div>

        {/* Schéma Cartographique ASCII */}
        <div className="p-3 bg-[#0d0a08] border border-[#3d2e1f] rounded-xl overflow-x-auto shadow-inner">
          <pre className="font-mono text-xs text-[#f3d48d] leading-relaxed mx-auto select-all">
            {OSGILD_GEOGRAPHY_ASCII}
          </pre>
        </div>

        {/* Grille des Régions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {OSGILD_REGIONS.map((reg, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#1e1712] border border-[#3d3023] hover:border-[#d4a84a]/60 transition-all space-y-1.5 shadow-sm"
            >
              <h5 className="font-serif-co text-sm font-bold text-[#f3d48d] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4a84a] shrink-0" />
                <span>{reg.name}</span>
              </h5>
              <span className="text-[10px] text-[#ab8230] font-bold block uppercase tracking-wider">
                {reg.subtitle}
              </span>
              <p className="text-xs text-[#ede3d1] leading-relaxed">
                {reg.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Panthéon & Croyances : Quel Dieu prier ? */}
      <div className="bg-[#181410] border border-[#3d3023] rounded-2xl p-5 space-y-4 shadow-md">
        <div className="border-b border-[#30251a] pb-3">
          <h4 className="font-serif-co text-base font-bold text-[#f3d48d] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4a84a]" />
            <span>2. Divinités &amp; Panthéon · Quelle divinité votre héros vénère-t-il ?</span>
          </h4>
          <p className="text-xs text-[#a0907d] mt-1">
            En Osgild, la foi octroie de véritables bénédictions et pouvoirs magiques aux prêtres, paladins et fidèles sincères.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {OSGILD_DEITIES.map((d, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#191410] border border-[#3d3023] hover:border-[#d4a84a]/60 transition-all space-y-1.5 text-xs shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-1.5">
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
                  <b>Symbole sacré :</b> {d.symbol}
                </div>
                <p className="text-[#cbb8a7] text-[11px] leading-relaxed pt-1.5 border-t border-[#30251a]">
                  {d.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Ordres, Collèges et Académies Savantes */}
      <div className="bg-[#181410] border border-[#3d3023] rounded-2xl p-5 space-y-4 shadow-md">
        <div className="border-b border-[#30251a] pb-3">
          <h4 className="font-serif-co text-base font-bold text-[#f3d48d] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#d4a84a]" />
            <span>3. Institutions &amp; Ordres Connus</span>
          </h4>
          <p className="text-xs text-[#a0907d] mt-1">
            Les académies de magie, cercles druidiques et ordres de chevalerie auprès desquels votre personnage a pu se former ou trouver des alliés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {OSGILD_ACADEMIES.map((acad, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#1e1712] border border-[#3d3023] rounded-xl space-y-1 text-xs"
            >
              <div className="font-serif-co font-bold text-[#f3d48d] text-sm flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#d4a84a]" />
                <span>{acad.name}</span>
              </div>
              <div className="text-[10px] text-[#d4a84a] font-bold uppercase">{acad.nature}</div>
              <p className="text-[#cbb8a7] leading-relaxed pt-1 text-[11px]">{acad.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
