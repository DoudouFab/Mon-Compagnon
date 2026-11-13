/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { CaracName, Character, Combatant } from '../../types/chroniques';
import { CARAC_LIST, PROFILS, RACES, getMod } from '../../data/coDatabase';
import { useToast } from '../common/ToastContext';
import { PortraitPicker } from '../common/PortraitPicker';

interface PnjCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pnjChar: Character | null, combatant: Combatant | null) => void;
}

const DEFAULT_CARACS: Record<CaracName, number> = {
  FOR: 14,
  DEX: 12,
  CON: 14,
  INT: 10,
  SAG: 10,
  CHA: 10,
};

export const PnjCreatorModal: React.FC<PnjCreatorModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { warning } = useToast();
  const [portrait, setPortrait] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Allié du groupe' | 'Mercenaire' | 'Guide' | 'Garde d\'Élite' | 'PNJ Notif' | 'Ennemi'>('Allié du groupe');
  const [race, setRace] = useState('humain');
  const [profil, setProfil] = useState('guerrier');
  const [level, setLevel] = useState(2);
  const [hp, setHp] = useState(18);
  const [def, setDef] = useState(14);
  const [weaponName, setWeaponName] = useState('Épée longue');
  const [weaponDm, setWeaponDm] = useState('1d8+2');
  const [armorName, setArmorName] = useState('Cotte de mailles');
  const [notes, setNotes] = useState('Allié fidèle recruté à l\'auberge. Obéit aux ordres du groupe.');
  const [addToGroup, setAddToGroup] = useState(true);
  const [addToCombat, setAddToCombat] = useState(true);
  const [caracs, setCaracs] = useState<Record<CaracName, number>>(DEFAULT_CARACS);

  useEffect(() => {
    if (!isOpen) return;
    setPortrait(undefined);
    setName('');
    setRole('Allié du groupe');
    setRace('humain');
    setProfil('guerrier');
    setLevel(2);
    setHp(18);
    setDef(14);
    setWeaponName('Épée longue');
    setWeaponDm('1d8+2');
    setArmorName('Cotte de mailles');
    setNotes('Allié fidèle recruté à l\'auberge. Obéit aux ordres du groupe.');
    setAddToGroup(true);
    setAddToCombat(true);
    setCaracs({ ...DEFAULT_CARACS });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCaracChange = (c: CaracName, val: number) => {
    const updated = { ...caracs, [c]: val };
    setCaracs(updated);
  };

  const handleAutoRecalc = () => {
    const pr = PROFILS.find((p) => p.id === profil);
    const dv = pr?.dv || 8;
    const modCon = getMod(caracs.CON);
    const modDex = getMod(caracs.DEX);

    // HP Niv 1 (max DV + CON) + (Niv - 1) * (Moyenne DV + CON)
    const baseHp = dv + modCon;
    const avgGain = Math.max(1, Math.floor(dv / 2) + 1 + modCon);
    const calcHp = Math.max(1, baseHp + (level - 1) * avgGain);
    setHp(calcHp);

    // DEF base 10 + mod DEX + armure standard
    const armorBonus = armorName.toLowerCase().includes('plaque') ? 6 : armorName.toLowerCase().includes('maille') ? 4 : 2;
    setDef(10 + modDex + armorBonus);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      warning('Veuillez entrer un nom pour le PNJ.');
      return;
    }

    const id = `pnj_${Date.now()}`;
    const trimmedName = name.trim();
    const trimmedWeapon = weaponName.trim() || 'Arme de poing';
    const trimmedDm = weaponDm.trim() || '1d6';
    const trimmedArmor = armorName.trim() || 'Aucune armure';

    let pnjCharacter: Character | null = null;
    let pnjCombatant: Combatant | null = null;

    if (addToGroup) {
      pnjCharacter = {
        id,
        name: trimmedName,
        player: `PNJ · ${role}`,
        race,
        profil,
        level,
        base: { ...caracs },
        rb: {},
        hpBase: hp,
        hpMaxAuto: hp,
        hpMaxManual: hp,
        hp,
        pmMaxManual: 0,
        pm: 0,
        ptsCap: 0,
        ptsCapCadeaux: 0,
        bourse: { po: 0, pa: 0, pc: 0 },
        caps: [],
        armes: [
          {
            n: trimmedWeapon,
            t: 'Contact',
            dm: trimmedDm,
            crit: '20',
            por: 'Contact',
            note: 'Arme PNJ',
          },
        ],
        inventaire: [
          { n: 'Sacoche de voyage', q: 1, desc: 'Vivres & bourse' },
        ],
        customSorts: [],
        arm: trimmedArmor,
        bou: '',
        bonus: { pv: 0, def: 0, init: 0 },
        persoTraits: `${role} — ${notes}`,
        etats: [],
        isPnj: true,
        rolePnj: role,
        ...(portrait ? { portrait } : {}),
      };
    }

    if (addToCombat) {
      pnjCombatant = {
        id: `c_${id}`,
        n: `${trimmedName} (${role})`,
        isPj: addToGroup,
        isPnj: true,
        hp,
        hpMax: hp,
        def,
        baseInit: caracs.DEX,
        init: caracs.DEX,
        notes: `${trimmedWeapon} (${trimmedDm}) • ${trimmedArmor} (DEF ${def}) • ${notes}`,
        ...(addToGroup ? { pjRefId: id } : {}),
        etats: [],
      };
    }

    onSave(pnjCharacter, pnjCombatant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#181410] border border-[#d4a84a] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#3d3023] bg-gradient-to-r from-[#291712] via-[#20140e] to-[#181410] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#d4a84a]/20 border border-[#d4a84a]/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#f3d48d]" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                Créateur de PNJ &amp; Alliés (Console MJ)
              </h3>
              <p className="text-xs text-[#9e907d]">
                Créez un allié, mercenaire ou compagnon et intégrez-le en 1 clic au groupe d'aventuriers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#9e907d] hover:text-[#ede3d1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Identity & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Nom du PNJ / Titre *
              </label>
              <input
                type="text"
                placeholder="Ex: Frère Aldren, Varn le Protecteur, Garde du corps..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Rôle &amp; Statut dans l'équipe
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none"
              >
                <option value="Allié du groupe">Allié du groupe (compagnon permanent)</option>
                <option value="Mercenaire">Mercenaire (sous contrat)</option>
                <option value="Guide">Guide / Pisteur</option>
                <option value="Garde d'Élite">Garde d'Élite / Escorte</option>
                <option value="PNJ Notif">PNJ Neutre à escorter</option>
                <option value="Ennemi">Antagoniste capturé / surveillé</option>
              </select>
            </div>
          </div>

          {/* Race, Profil & Niveau */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Race
              </label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none capitalize"
              >
                {RACES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Profil de combat
              </label>
              <select
                value={profil}
                onChange={(e) => setProfil(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none capitalize"
              >
                {PROFILS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.n} (d{p.dv})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Niveau
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={level}
                onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none text-center font-bold"
              />
            </div>
          </div>

          {/* 6 Caractéristiques */}
          <div className="p-3 bg-[#120f0c] border border-[#3d3023] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-[#d4a84a]">
                Caractéristiques (Valeurs &amp; Modificateurs)
              </span>
              <button
                type="button"
                onClick={handleAutoRecalc}
                className="text-[10px] text-[#f3d48d] hover:underline flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" /> Recalculer PV &amp; DEF
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {CARAC_LIST.map((c) => {
                const val = caracs[c];
                const mod = getMod(val);

                return (
                  <div key={c} className="p-2 bg-[#1c1611] border border-[#33251a] rounded text-center">
                    <span className="text-[10px] font-bold text-[#9e907d] block">{c}</span>
                    <input
                      type="number"
                      min="3"
                      max="24"
                      value={val}
                      onChange={(e) => handleCaracChange(c, parseInt(e.target.value) || 10)}
                      className="w-full text-center text-xs font-bold text-[#f3d48d] bg-transparent outline-none my-0.5"
                    />
                    <span className="text-[10px] font-mono text-[#6fa85b]">
                      {mod >= 0 ? `+${mod}` : mod}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combat Stats: HP, DEF/CA, Weapon, Armor */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#ff9d9d] block mb-1">
                Points de Vie (PV)
              </label>
              <input
                type="number"
                min="1"
                value={hp}
                onChange={(e) => setHp(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#94d5ff] block mb-1">
                Défense / CA
              </label>
              <input
                type="number"
                min="8"
                value={def}
                onChange={(e) => setDef(Math.max(5, parseInt(e.target.value) || 10))}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Arme Principale
              </label>
              <input
                type="text"
                placeholder="Épée, Hache, Arc..."
                value={weaponName}
                onChange={(e) => setWeaponName(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Dégâts (DM)
              </label>
              <input
                type="text"
                placeholder="1d8+2, 1d6..."
                value={weaponDm}
                onChange={(e) => setWeaponDm(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
              Armure / Protection équipée
            </label>
            <input
              type="text"
              placeholder="Ex: Cotte de mailles, Cuir clouté, Bouclier rond..."
              value={armorName}
              onChange={(e) => setArmorName(e.target.value)}
              className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
              Notes &amp; Capacités spéciales du PNJ
            </label>
            <textarea
              rows={2}
              placeholder="Personnalité, équipement particulier, serment, sorts connus..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs outline-none focus:border-[#d4a84a]"
            />
          </div>

          <PortraitPicker
            value={portrait}
            onChange={setPortrait}
            characterDraft={{
              name: name || 'PNJ',
              race,
              profil,
              persoTraits: notes,
            }}
            compact
            label="Visuel / Portrait du PNJ (Optionnel)"
          />

          {/* Insertion Options */}
          <div className="p-3 bg-[#231c15] border border-[#3d3023] rounded-xl space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#d4a84a] block">
              Options d'intégration automatique :
            </span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={addToGroup}
                onChange={(e) => setAddToGroup(e.target.checked)}
                className="w-4 h-4 accent-[#d4a84a] rounded"
              />
              <span className="text-xs text-[#ede3d1] font-medium">
                Insérer directement dans le <b>Groupe d'Aventuriers (PJ)</b> (consultable comme fiche de compagnon)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={addToCombat}
                onChange={(e) => setAddToCombat(e.target.checked)}
                className="w-4 h-4 accent-[#d4a84a] rounded"
              />
              <span className="text-xs text-[#ede3d1] font-medium">
                Ajouter immédiatement à la <b>Piste d'Initiative (Combat)</b>
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#30251a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer et Intégrer le PNJ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
