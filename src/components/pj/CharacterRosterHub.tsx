import React from 'react';
import {
  Shield,
  Sparkles,
  FileUp,
  FileDown,
  UserPlus,
  Play,
  Trash2,
  Copy,
  Heart,
  Zap,
  Sword,
  BookOpen,
} from 'lucide-react';
import { Character, CaracName } from '../../types/chroniques';
import { PROFILS, RACES, getMod } from '../../data/coDatabase';
import { DeleteCharacterModal } from './DeleteCharacterModal';

interface CharacterRosterHubProps {
  roster: Character[];
  activePjId: string | null;
  onSelectPj: (pj: Character) => void;
  onOpenWizard: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePj: (id: string) => void;
  onExportPj: (pj: Character) => void;
  onExportAllRoster: () => void;
  onDuplicatePj: (pj: Character) => void;
}

export const CharacterRosterHub: React.FC<CharacterRosterHubProps> = ({
  roster,
  activePjId,
  onSelectPj,
  onOpenWizard,
  onImportJson,
  onDeletePj,
  onExportPj,
  onExportAllRoster,
  onDuplicatePj,
}) => {
  const [characterToDelete, setCharacterToDelete] = React.useState<Character | null>(null);
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2 sm:py-4">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#291712] via-[#1a130e] to-[#120f0d] border border-[#d4a84a]/40 shadow-2xl p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d2a17] border border-[#d4a84a]/40 text-[#f3d48d] text-xs font-bold tracking-wide">
              <Shield className="w-3.5 h-3.5 text-[#d4a84a]" />
              Compagnon du Joueur · Chroniques Oubliées
            </div>
            <h2 className="font-serif-co text-2xl sm:text-3xl font-bold text-[#f3d48d]">
              {roster.length === 0 ? "Commencer votre Aventure" : "Sélection & Gestion des Héros"}
            </h2>
            <p className="text-xs sm:text-sm text-[#b0a08d] max-w-xl">
              {roster.length === 0
                ? "Bienvenue ! Vous n'avez pas encore de personnage. Créez votre premier héros avec l'assistant guidé ou importez votre fichier de sauvegarde JSON pour commencer à jouer."
                : `Vous avez ${roster.length} personnage${roster.length > 1 ? 's' : ''} enregistré${roster.length > 1 ? 's' : ''}. Choisissez le héros à incarner à votre table ou ajoutez-en un nouveau.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenWizard}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4a84a] via-[#e5bd62] to-[#ab8230] hover:brightness-110 text-[#1a1208] text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#d4a84a]/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#1a1208]" />
              <span>{roster.length === 0 ? "Créer mon 1er Héros" : "Créer un Nouveau Héros"}</span>
            </button>

            <label className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#231c15] hover:bg-[#32271d] border border-[#d4a84a]/40 text-[#ede3d1] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all">
              <FileUp className="w-4 h-4 text-[#d4a84a]" />
              <span>Importer un JSON</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={onImportJson}
              />
            </label>

            {roster.length > 0 && (
              <button
                onClick={onExportAllRoster}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#1c1612] hover:bg-[#2b2018] border border-[#3d3023] text-[#d4a84a] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Sauvegarder l'intégralité de vos héros dans un seul fichier JSON"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden lg:inline">Exporter Tout (JSON)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* When Empty: Helpful Starter Guide */}
      {roster.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={onOpenWizard}
            className="p-6 rounded-2xl bg-[#18130f] border-2 border-dashed border-[#d4a84a]/40 hover:border-[#d4a84a] text-left transition-all cursor-pointer group shadow-lg hover:bg-[#211913]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#3d2a17] text-[#d4a84a] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d] mb-1">
              Option 1 : Créer votre Héros de A à Z
            </h3>
            <p className="text-xs text-[#9e907d] leading-relaxed mb-4">
              Laissez-vous guider par l'assistant officiel de Chroniques Oubliées : nom, choix de la race (Humain, Elfe, Nain, etc.), profil (Guerrier, Voleur, Magicien...), caractéristiques et choix de vos 2 premières capacités.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4a84a] group-hover:underline">
              Lancer la création de personnage →
            </span>
          </div>

          <label className="p-6 rounded-2xl bg-[#18130f] border-2 border-dashed border-[#4d3a2a] hover:border-[#d4a84a]/70 text-left transition-all cursor-pointer group shadow-lg hover:bg-[#211913] block">
            <div className="w-12 h-12 rounded-xl bg-[#2b2018] text-[#ede3d1] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
              <FileUp className="w-6 h-6 text-[#d4a84a]" />
            </div>
            <h3 className="font-serif-co text-lg font-bold text-[#ede3d1] mb-1">
              Option 2 : Importer un fichier JSON
            </h3>
            <p className="text-xs text-[#9e907d] leading-relaxed mb-4">
              Vous avez déjà une fiche exportée ou le MJ vous a transmis votre personnage ? Chargez simplement votre fichier <code>.json</code> pour retrouver instantanément toutes vos statistiques et votre équipement.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ede3d1] group-hover:underline">
              Parcourir mes fichiers JSON →
            </span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={onImportJson}
            />
          </label>
        </div>
      ) : (
        /* List of Characters */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#d4a84a]" />
              <span>Vos Personnages Disponibles ({roster.length})</span>
            </h3>
            <span className="text-xs text-[#9e907d]">
              Cliquez sur « Incarner » pour ouvrir la fiche de jeu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roster.map((pj) => {
              const pr = PROFILS.find((x) => x.id === pj.profil);
              const rc = RACES.find((x) => x.id === pj.race);
              const hpMax = pj.hpMaxManual || pj.hpMaxAuto || pj.hpBase || 10;
              const isSelected = pj.id === activePjId;

              const forMod = getMod((pj.base.FOR || 10) + (pj.rb.FOR || 0));
              const dexMod = getMod((pj.base.DEX || 10) + (pj.rb.DEX || 0));
              const conMod = getMod((pj.base.CON || 10) + (pj.rb.CON || 0));
              const defVal = 10 + dexMod + (pj.bonus?.def || 0);

              return (
                <div
                  key={pj.id || pj.name}
                  className={`relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#2a1c12] to-[#17110c] border-[#d4a84a] shadow-xl shadow-[#d4a84a]/10 ring-1 ring-[#d4a84a]/50'
                      : 'bg-[#18130f] border-[#3d3023] hover:border-[#5a4632] hover:bg-[#1d1612]'
                  }`}
                >
                  {/* Top: Name & Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif-co text-xl font-bold text-[#f3d48d]">
                            {pj.name || 'Héros sans nom'}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#3d2a17] text-[#d4a84a] border border-[#d4a84a]/50">
                              Actif
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#a39482] mt-0.5">
                          {rc?.n || pj.race} · <span className="text-[#f3d48d] font-semibold">{pr?.n || pj.profil}</span> · Niveau {pj.level}
                          {pj.player && <span className="text-[#807262]"> · Joueur : {pj.player}</span>}
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-[#231a12] border border-[#3d3023] flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-[#d4a84a]" />
                      </div>
                    </div>

                    {/* Quick Stats Strip */}
                    <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-[#100d0a] border border-[#2d2217] text-center my-3">
                      <div>
                        <div className="text-[9px] uppercase text-[#9e907d] font-bold">PV</div>
                        <div className="text-xs font-bold text-[#ff8080] flex items-center justify-center gap-1">
                          <Heart className="w-3 h-3 text-[#ff8080]" />
                          <span>{pj.hp} / {hpMax}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-[#9e907d] font-bold">Défense</div>
                        <div className="text-xs font-bold text-[#86efac]">
                          {defVal}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-[#9e907d] font-bold">Att. Contact</div>
                        <div className="text-xs font-bold text-[#ede3d1]">
                          +{pj.level + forMod}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-[#9e907d] font-bold">Att. Dist.</div>
                        <div className="text-xs font-bold text-[#ede3d1]">
                          +{pj.level + dexMod}
                        </div>
                      </div>
                    </div>

                    {/* Modificateurs Caractéristiques */}
                    <div className="flex items-center justify-between text-[11px] text-[#9e907d] px-1 font-mono">
                      <span>FOR <b>{forMod >= 0 ? `+${forMod}` : forMod}</b></span>
                      <span>DEX <b>{dexMod >= 0 ? `+${dexMod}` : dexMod}</b></span>
                      <span>CON <b>{conMod >= 0 ? `+${conMod}` : conMod}</b></span>
                      <span>INT <b>{getMod((pj.base.INT || 10) + (pj.rb.INT || 0)) >= 0 ? `+${getMod((pj.base.INT || 10) + (pj.rb.INT || 0))}` : getMod((pj.base.INT || 10) + (pj.rb.INT || 0))}</b></span>
                      <span>SAG <b>{getMod((pj.base.SAG || 10) + (pj.rb.SAG || 0)) >= 0 ? `+${getMod((pj.base.SAG || 10) + (pj.rb.SAG || 0))}` : getMod((pj.base.SAG || 10) + (pj.rb.SAG || 0))}</b></span>
                      <span>CHA <b>{getMod((pj.base.CHA || 10) + (pj.rb.CHA || 0)) >= 0 ? `+${getMod((pj.base.CHA || 10) + (pj.rb.CHA || 0))}` : getMod((pj.base.CHA || 10) + (pj.rb.CHA || 0))}</b></span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#30251a]">
                    <button
                      onClick={() => onSelectPj(pj)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#d4a84a] to-[#ab8230] text-[#1a1208] hover:brightness-110'
                          : 'bg-[#2b1f14] hover:bg-[#3d2a17] text-[#f3d48d] border border-[#d4a84a]/50'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSelected ? "Continuer la Partie" : "Incarner ce Héros"}</span>
                    </button>

                    <button
                      onClick={() => onExportPj(pj)}
                      className="p-2 rounded-lg bg-[#201812] hover:bg-[#2d2218] border border-[#3d3023] text-[#b0a08d] hover:text-[#ede3d1] transition-colors cursor-pointer"
                      title="Sauvegarder ce personnage en fichier JSON"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicatePj(pj)}
                      className="p-2 rounded-lg bg-[#201812] hover:bg-[#2d2218] border border-[#3d3023] text-[#b0a08d] hover:text-[#ede3d1] transition-colors cursor-pointer"
                      title="Dupliquer ce héros (copie de sécurité)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCharacterToDelete(pj)}
                      className="p-2 rounded-lg bg-[#241315] hover:bg-[#38181b] border border-[#522023] text-[#ff8080] hover:text-[#ffb8b8] transition-colors cursor-pointer"
                      title="Oublier définitivement ce personnage (double validation)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Double Validation Modal pour Oublier un Héros */}
      <DeleteCharacterModal
        isOpen={!!characterToDelete}
        onClose={() => setCharacterToDelete(null)}
        pj={characterToDelete}
        onConfirmDelete={(id) => {
          onDeletePj(id);
          setCharacterToDelete(null);
        }}
      />
    </div>
  );
};
