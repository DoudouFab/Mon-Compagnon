import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Sparkles, Info, Shield, Dice5, RefreshCw, Coins } from 'lucide-react';
import { DetailModal, DetailItem } from '../DetailModal';
import { CARAC_LIST, PROFILS, RACES, VOIES_CATALOG, getMod } from '../../data/coDatabase';
import { CaracName, Character, CurrencyBourse } from '../../types/chroniques';
import { STARTING_PACKAGES_BY_PROFIL, ARMOR_RESTRICTIONS_BY_PROFIL, RACIAL_ARMOR_NOTES } from '../../data/startingGearData';
import { generateRandomPhysicalStats, getRaceLimitsDescription } from '../../data/racePhysicalStats';

interface PjCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterCreated: (character: Character) => void;
}

const WIZARD_STEPS = [
  'Race',
  'Profil & Armures autorisées',
  'Caractéristiques',
  'Capacités de départ',
  'Équipement gratuit de départ',
  'Identité & Mensurations',
  'Confirmation',
];

export const PjCreationWizard: React.FC<PjCreationWizardProps> = ({
  isOpen,
  onClose,
  onCharacterCreated,
}) => {
  const [step, setStep] = useState<number>(0);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);

  // Form State
  const [raceId, setRaceId] = useState<string>('humain');
  const [rcOption, setRcOption] = useState<number>(0);
  const [profilId, setProfilId] = useState<string>('barbare');
  const [baseStats, setBaseStats] = useState<Record<CaracName, number>>({
    FOR: 16,
    DEX: 13,
    CON: 13,
    INT: 11,
    SAG: 10,
    CHA: 9,
  });
  const [statMode, setStatMode] = useState<'standard' | 'heroique'>('standard');
  const [selectedCaps, setSelectedCaps] = useState<string[]>([]);

  // Starting money (Bourse de départ)
  const [bourseMode, setBourseMode] = useState<'standard' | 'dice' | 'custom'>('standard');
  const [startingBourse, setStartingBourse] = useState<CurrencyBourse>({ po: 10, pa: 0, pc: 0 });
  const [diceRollInfo, setDiceRollInfo] = useState<{ rolls: number[]; totalPA: number } | null>(null);

  // Identity asked at the end
  const [name, setName] = useState<string>('');
  const [player, setPlayer] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [taille, setTaille] = useState<string>('');
  const [poids, setPoids] = useState<string>('');

  // Initial populate of random physical stats based on chosen race
  useEffect(() => {
    if (isOpen && (!age || !taille || !poids)) {
      const initStats = generateRandomPhysicalStats(raceId);
      setAge(initStats.age);
      setTaille(initStats.taille);
      setPoids(initStats.poids);
    }
  }, [isOpen, raceId]);

  if (!isOpen) return null;

  const currentRace = RACES.find((r) => r.id === raceId) || RACES[0];
  const currentProfil = PROFILS.find((p) => p.id === profilId) || PROFILS[0];
  const raceBonus = currentRace.b || {};
  const currentArmorRule = ARMOR_RESTRICTIONS_BY_PROFIL[profilId] || {
    allowedArmors: 'Armures selon profil',
    allowedShields: 'Selon profil',
    note: 'Consultez la fiche du profil.',
  };
  const racialArmorNote = RACIAL_ARMOR_NOTES[raceId];
  const startingPackage = STARTING_PACKAGES_BY_PROFIL[profilId] || STARTING_PACKAGES_BY_PROFIL['barbare'];

  // Compute stat rules check
  const mods = CARAC_LIST.map((c) => getMod(baseStats[c] || 10));
  const modSum = mods.reduce((a, b) => a + b, 0);
  const pairsCount = CARAC_LIST.map((c) => baseStats[c] || 10).filter((v) => v % 2 === 0).length;

  const availableWays = Object.entries(VOIES_CATALOG).filter(
    ([, v]) => v.profil === profilId || v.profil === 'race:' + raceId
  );

  const handlePickRace = (id: string) => {
    setRaceId(id);
    setRcOption(0);
    // Refresh pre-filled random stats for this new race
    const randomStats = generateRandomPhysicalStats(id);
    setAge(randomStats.age);
    setTaille(randomStats.taille);
    setPoids(randomStats.poids);
  };

  const handlePickProfil = (id: string) => {
    setProfilId(id);
    setSelectedCaps([]);
  };

  const handleRerollPhysical = () => {
    const stats = generateRandomPhysicalStats(raceId);
    setAge(stats.age);
    setTaille(stats.taille);
    setPoids(stats.poids);
  };

  const maxStatBudget = statMode === 'heroique' ? 6 : 4;
  const maxStatBase = statMode === 'heroique' ? 17 : 16;
  const minStatBase = 8;

  // Règle 1 : Total exact des modificateurs
  const isModSumValid = modSum === maxStatBudget;
  // Règle 2 : Maximum 2 scores pairs (et 4 scores impairs) selon la règle officielle COF
  const isPairsCountValid = pairsCount <= 2;
  const canProceedStep2 = isModSumValid && isPairsCountValid;

  // Présélections 100% officielles et conformes (Total = +4, exactement 2 scores pairs)
  const STAT_PRESETS = [
    { label: '⚔️ Guerrier / Contact', stats: { FOR: 16, DEX: 13, CON: 13, INT: 11, SAG: 10, CHA: 9 } }, // +3 +1 +1 0 0 -1 = +4 | Pairs: 16, 10 (2 pairs)
    { label: '🏹 Agile / Distance', stats: { FOR: 11, DEX: 16, CON: 13, INT: 11, SAG: 12, CHA: 9 } },  // 0 +3 +1 0 +1 -1 = +4 | Pairs: 16, 12 (2 pairs)
    { label: '🔮 Érudit / Magie', stats: { FOR: 9, DEX: 13, CON: 11, INT: 16, SAG: 14, CHA: 9 } },     // -1 +1 0 +3 +2 -1 = +4 | Pairs: 16, 14 (2 pairs)
    { label: '✨ Dévot / Prêtre', stats: { FOR: 13, DEX: 11, CON: 14, INT: 9, SAG: 16, CHA: 9 } },     // +1 0 +2 -1 +3 -1 = +4 | Pairs: 14, 16 (2 pairs)
    { label: '🎭 Social / Barde', stats: { FOR: 9, DEX: 14, CON: 11, INT: 13, SAG: 9, CHA: 16 } },     // -1 +2 0 +1 -1 +3 = +4 | Pairs: 14, 16 (2 pairs)
    { label: '⚖️ Polyvalent', stats: { FOR: 14, DEX: 13, CON: 12, INT: 11, SAG: 11, CHA: 11 } },       // +2 +1 +1 0 0 0 = +4 | Pairs: 14, 12 (2 pairs)
  ];

  const rollStartingDice = () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const d3 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2 + d3;
    const totalPA = sum * 10;
    const po = Math.floor(totalPA / 10);
    const pa = totalPA % 10;
    setStartingBourse({ po, pa, pc: 0 });
    setDiceRollInfo({ rolls: [d1, d2, d3], totalPA });
    setBourseMode('dice');
  };

  const handleStatChange = (c: CaracName, val: number) => {
    if (val < minStatBase) return;
    if (val > maxStatBase) {
      alert(`Plafond officiel niveau 1 : Le score de base maximum est de ${maxStatBase} (modificateur +3) avant bonus racial.`);
      return;
    }
    const currentVal = baseStats[c] || 10;
    if (val > currentVal) {
      const currentMod = getMod(currentVal);
      const newMod = getMod(val);
      const modDiff = newMod - currentMod;
      if (modDiff > 0 && modSum + modDiff > maxStatBudget) {
        alert(
          `Barrière de création : Le budget total des modificateurs (+${maxStatBudget} en mode ${
            statMode === 'heroique' ? 'Héroïque' : 'Standard'
          }) est déjà atteint ! Baissez une autre caractéristique pour augmenter celle-ci.`
        );
        return;
      }
    }
    setBaseStats((prev) => ({
      ...prev,
      [c]: val,
    }));
  };

  const toggleCap = (wayKey: string) => {
    if (selectedCaps.includes(wayKey)) {
      setSelectedCaps(selectedCaps.filter((k) => k !== wayKey));
    } else if (selectedCaps.length < 2) {
      setSelectedCaps([...selectedCaps, wayKey]);
    }
  };

  const handleNext = () => {
    // Step 2: Caractéristiques (Barrières strictes)
    if (step === 2) {
      if (!isModSumValid) {
        alert(
          `Barrière de création active :\nLa somme de vos modificateurs doit être exactement de +${maxStatBudget} (actuellement ${
            modSum >= 0 ? '+' + modSum : modSum
          } en mode ${statMode === 'heroique' ? 'Héroïque' : 'Standard'}).\n\nVeuillez ajuster vos valeurs pour respecter ce total.`
        );
        return;
      }
      if (!isPairsCountValid) {
        alert(
          `Barrière de création active :\nRègle officielle des scores pairs/impairs non respectée !\nVous avez actuellement ${pairsCount} caractéristiques paires.\nLa règle officielle de Chroniques Oubliées exige un maximum de 2 scores pairs (et au moins 4 scores impairs) pour éviter toute optimisation artificielle.\n\nVeuillez ajuster vos scores pour avoir au maximum 2 valeurs paires.`
        );
        return;
      }
      for (const c of CARAC_LIST) {
        if ((baseStats[c] || 10) > maxStatBase) {
          alert(`Barrière de création : Au niveau 1, aucune caractéristique de base ne peut dépasser ${maxStatBase} avant bonus racial.`);
          return;
        }
      }
    }
    // Step 3: Capacités de départ
    if (step === 3 && selectedCaps.length < 2) {
      if (
        !confirm(
          "Vous n'avez pas sélectionné vos 2 capacités de rang 1 recommandées. Continuer quand même ?"
        )
      ) {
        return;
      }
    }
    // Step 5: Identité & Mensurations
    if (step === 5 && !name.trim()) {
      alert('Veuillez donner un nom à votre héros.');
      return;
    }
    // Step 6: Finalize
    if (step === 6) {
      finalizeCreation();
      return;
    }
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const finalizeCreation = () => {
    const modCon = getMod(baseStats.CON + (raceBonus.CON || 0));
    const hpInit = currentProfil.dv + modCon;

    const pkg = STARTING_PACKAGES_BY_PROFIL[profilId] || STARTING_PACKAGES_BY_PROFIL['barbare'];

    const newChar: Character = {
      version: '1.0',
      id: 'pj_' + Date.now(),
      name: name.trim() || 'Aventurier sans nom',
      player: player.trim(),
      age: age.trim() || undefined,
      taille: taille.trim() || undefined,
      poids: poids.trim() || undefined,
      race: raceId,
      rcOption,
      profil: profilId,
      level: 1,
      base: { ...baseStats },
      rb: { ...raceBonus },
      hpBase: hpInit,
      hpMaxAuto: hpInit,
      hpMaxManual: null,
      hp: hpInit,
      pmMaxManual: null,
      pm: currentProfil.mag
        ? Math.max(1, 2 + getMod(baseStats[currentProfil.mag] + (raceBonus[currentProfil.mag] || 0)))
        : 0,
      ptsCap: 0,
      caps: selectedCaps.map((k) => ({ wayKey: k, rank: 1 })),
      armes: pkg.armes ? [...pkg.armes] : [],
      arm: pkg.arm || '',
      bou: pkg.bou || '',
      inventaire: pkg.inventaire ? [...pkg.inventaire] : [],
      customSorts: [],
      bonus: { pv: 0, def: 0, init: 0 },
      bourse: {
        po: startingBourse.po || 0,
        pa: startingBourse.pa || 0,
        pc: startingBourse.pc || 0,
      },
      persoTraits: `${currentRace.traits} Vocation : ${currentProfil.traits}`,
    };

    onCharacterCreated(newChar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 animate-fadeIn">
      <div className="bg-[#181410] border border-[#d4a84a] rounded-xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#3d3023] flex items-center justify-between bg-gradient-to-r from-[#291712] to-[#181410]">
          <div>
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
              Création de Personnage · Étape {step + 1}/7 : {WIZARD_STEPS[step]}
            </h3>
            <p className="text-xs text-[#9e907d]">Règles officielles Chroniques Oubliées Fantasy</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-[#0f0d0b]">
          <div
            className="h-full bg-gradient-to-r from-[#d4a84a] to-[#f3d48d] transition-all duration-300"
            style={{ width: `${((step + 1) / 7) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 0: Race */}
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-xs text-[#9e907d]">
                Choisissez l&apos;ascendance de votre héros. Les modificateurs raciaux s&apos;appliqueront à vos caractéristiques et influenceront sa morphologie.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RACES.map((race) => {
                  const isSelected = race.id === raceId;
                  return (
                    <div
                      key={race.id}
                      onClick={() => handlePickRace(race.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#2d2217] border-[#d4a84a] shadow-md shadow-[#d4a84a]/10'
                          : 'bg-[#1e1913] border-[#3d3023] hover:border-[#85652e]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailItem({ type: 'race', data: race });
                          }}
                          className="flex items-center gap-1.5 text-left group cursor-pointer"
                          title="Cliquer pour afficher la fiche officielle complète"
                        >
                          <b className="font-serif-co text-base text-[#f3d48d] group-hover:text-[#ffe099] flex items-center gap-1.5 underline-offset-2 hover:underline">
                            {race.n}
                            <Info className="w-4 h-4 text-[#d4a84a] opacity-75 group-hover:opacity-100" />
                          </b>
                        </button>
                        <span className="text-xs font-mono font-bold text-[#6fa85b] bg-[#122410] px-2 py-0.5 rounded border border-[#274721]">
                          {race.t}
                        </span>
                      </div>
                      <p className="text-xs text-[#9e907d] mb-2">{race.d}</p>
                      <div className="text-xs text-[#ede3d1] space-y-1">
                        {race.cap.map((c, i) => (
                          <div key={i} className="text-[11px]">
                            <span className="text-[#d4a84a] font-bold">• {c.n} :</span> {c.t}
                          </div>
                        ))}
                      </div>

                      {/* Racial Options */}
                      {isSelected && race.opts && (
                        <div className="mt-3 pt-2 border-t border-[#3d3023] space-y-1.5">
                          <span className="text-[10px] font-bold text-[#f3d48d] uppercase tracking-wider block">
                            Choix d&apos;héritage :
                          </span>
                          {race.opts.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRcOption(oIdx);
                              }}
                              className={`p-2 rounded text-xs border ${
                                rcOption === oIdx
                                  ? 'bg-[#3b2a1a] border-[#d4a84a] text-[#f3d48d]'
                                  : 'bg-[#181410] border-[#30251a] text-[#9e907d]'
                              }`}
                            >
                              <b>{opt.n} :</b> {opt.t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: Profil & Armures autorisées */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#1e1511] border border-[#d4a84a]/50 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#f3d48d] shrink-0 mt-0.5" />
                <div className="text-xs text-[#cbb8a7]">
                  <b className="text-[#f3d48d] block mb-0.5">Règle des armures selon la classe et la race :</b>
                  Chaque profil possède un entraînement martial précis dictant les types d&apos;armures et de boucliers qu&apos;il peut porter sans entrave. Les armures autorisées sont récapitulées ci-dessous pour chaque profil.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROFILS.map((prof) => {
                  const isSelected = prof.id === profilId;
                  const armorRule = ARMOR_RESTRICTIONS_BY_PROFIL[prof.id];
                  return (
                    <div
                      key={prof.id}
                      onClick={() => handlePickProfil(prof.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#2d2217] border-[#d4a84a] shadow-md shadow-[#d4a84a]/10'
                          : 'bg-[#1e1913] border-[#3d3023] hover:border-[#85652e]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailItem({ type: 'profil', data: prof });
                          }}
                          className="flex items-center gap-1.5 text-left group cursor-pointer"
                          title="Cliquer pour afficher la fiche complète (voies, caractéristiques, équipement)"
                        >
                          <b className="font-serif-co text-base text-[#f3d48d] group-hover:text-[#ffe099] flex items-center gap-1.5 underline-offset-2 hover:underline">
                            {prof.n}
                            <Info className="w-4 h-4 text-[#d4a84a] opacity-75 group-hover:opacity-100" />
                          </b>
                        </button>
                        <span className="text-xs font-mono font-bold text-[#e06666] bg-[#291212] px-2 py-0.5 rounded border border-[#4d1f1f]">
                          d{prof.dv} PV
                        </span>
                      </div>
                      <p className="text-xs text-[#9e907d] mb-2">{prof.traits}</p>

                      {/* Armor Badge Encart */}
                      <div className="p-2 rounded bg-[#140e0b] border border-[#3d2b1f] text-[11px] space-y-1 mb-2">
                        <div className="flex items-center gap-1.5 text-[#f3d48d] font-bold">
                          <Shield className="w-3.5 h-3.5 text-[#d4a84a]" />
                          <span>Armure autorisée :</span>
                        </div>
                        <p className="text-[#ede3d1] font-medium pl-5">
                          {armorRule ? armorRule.allowedArmors : prof.ar}
                        </p>
                        <p className="text-[#9e907d] pl-5">
                          Bouclier : <span className="text-[#cbb8a7] font-semibold">{armorRule ? armorRule.allowedShields : 'Selon profil'}</span>
                        </p>
                      </div>

                      {isSelected && (
                        <div className="text-[11px] text-[#6fa85b] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Matériel gratuit de départ pré-chargé à l&apos;étape 5
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {racialArmorNote && (
                <div className="p-3 rounded-lg bg-[#241a13] border border-[#5c4028] text-xs text-[#f3d48d]">
                  ⚠️ <b>Spécificité raciale ({currentRace.n}) :</b> {racialArmorNote}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Caractéristiques */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Mode Toggle & Presets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#1e1511] border border-[#d4a84a]/40 rounded-xl text-xs">
                <div>
                  <b className="text-[#f3d48d] block font-serif-co text-sm">Mode de répartition des Caractéristiques :</b>
                  <p className="text-[#9e907d] text-[11px]">
                    Mode officiel Standard (+4 max, 2 pairs) ou Héroïque (+6 max).
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[#120f0c] p-1 rounded-lg border border-[#3d3023] shrink-0">
                  <button
                    type="button"
                    onClick={() => setStatMode('standard')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      statMode === 'standard'
                        ? 'bg-[#d4a84a] text-black shadow-xs'
                        : 'text-[#9e907d] hover:text-[#ede3d1]'
                    }`}
                  >
                    Standard (+4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatMode('heroique')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      statMode === 'heroique'
                        ? 'bg-[#d4a84a] text-black shadow-xs'
                        : 'text-[#9e907d] hover:text-[#ede3d1]'
                    }`}
                  >
                    Héroïque (+6)
                  </button>
                </div>
              </div>

              {/* Quick Presets Bar */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#9e907d] uppercase tracking-wider block">
                  ⚡ Archétypes équilibrés officiels (Conformes 100% aux 2 règles) :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {STAT_PRESETS.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setBaseStats({ ...p.stats })}
                      className="px-2.5 py-1.5 rounded-lg bg-[#221a14] hover:bg-[#32251a] border border-[#3d3023] hover:border-[#d4a84a] text-[11px] font-semibold text-[#ede3d1] text-left transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{p.label}</span>
                      <span className="text-[10px] text-[#9e907d] font-mono">OK</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Dual-Rule Verification Banner */}
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                canProceedStep2
                  ? 'bg-[#122410] border-[#276e43] text-[#86efac]'
                  : 'bg-[#2b1414] border-[#8a3328] text-[#ffb0a3]'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
                  <span className="flex items-center gap-1.5">
                    {canProceedStep2 ? '✅ Barrières de création respectées' : '⚠️ Barrière de création active'}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className={isModSumValid ? 'text-[#86efac]' : 'text-[#ff6b6b]'}>
                      Somme des modificateurs : <b>{modSum > 0 ? `+${modSum}` : modSum} / +{maxStatBudget}</b>
                    </span>
                    <span>•</span>
                    <span className={isPairsCountValid ? 'text-[#86efac]' : 'text-[#ff6b6b]'}>
                      Scores pairs : <b>{pairsCount} / 2 max</b> ({impairsCount} impairs)
                    </span>
                  </div>
                </div>
                {!canProceedStep2 && (
                  <p className="text-[11px] text-[#ffc5be] leading-relaxed">
                    {!isModSumValid && (
                      <span>• La somme de vos modificateurs doit être exactement de +{maxStatBudget} (actuellement {modSum > 0 ? '+' + modSum : modSum}). </span>
                    )}
                    {!isPairsCountValid && (
                      <span>• Règle officielle COF : vous avez {pairsCount} caractéristiques paires (maximum autorisé : 2 pairs et 4 impairs pour éviter l&apos;optimisation excessive).</span>
                    )}
                  </p>
                )}
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CARAC_LIST.map((c) => {
                  const val = baseStats[c] || 10;
                  const mod = getMod(val);
                  const rMod = raceBonus[c] || 0;
                  const total = val + rMod;
                  const totalMod = getMod(total);
                  const isEven = val % 2 === 0;

                  const canIncrease = val < maxStatBase && (modSum < maxStatBudget || getMod(val + 1) === mod);
                  const canDecrease = val > minStatBase;

                  return (
                    <div
                      key={c}
                      className={`p-3.5 bg-[#1e1913] border rounded-xl flex flex-col items-center gap-2 transition-all ${
                        isEven ? 'border-[#523d29]' : 'border-[#30251c]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full px-1">
                        <span className="font-serif-co font-bold text-sm text-[#f3d48d]">{c}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          isEven ? 'bg-[#3b2a1a] text-[#f3d48d]' : 'bg-[#1a1510] text-[#9e907d]'
                        }`}>
                          {isEven ? 'Pair' : 'Impair'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!canDecrease}
                          onClick={() => handleStatChange(c, val - 1)}
                          className={`w-7 h-7 rounded font-bold flex items-center justify-center border transition-all ${
                            canDecrease
                              ? 'bg-[#2c1f14] hover:bg-[#3d2b1c] text-[#ede3d1] border-[#4d3623] cursor-pointer'
                              : 'bg-[#18130e] text-[#5c4a3a] border-[#2b1f14] cursor-not-allowed opacity-50'
                          }`}
                        >
                          -
                        </button>
                        <span className="font-mono text-xl font-bold text-[#ede3d1] w-8 text-center">
                          {val}
                        </span>
                        <button
                          type="button"
                          disabled={!canIncrease}
                          onClick={() => handleStatChange(c, val + 1)}
                          className={`w-7 h-7 rounded font-bold flex items-center justify-center border transition-all ${
                            canIncrease
                              ? 'bg-[#2c1f14] hover:bg-[#3d2b1c] text-[#ede3d1] border-[#4d3623] cursor-pointer'
                              : 'bg-[#18130e] text-[#5c4a3a] border-[#2b1f14] cursor-not-allowed opacity-50'
                          }`}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-[11px] text-[#9e907d] text-center">
                        Base: {mod >= 0 ? `+${mod}` : mod}
                        {rMod !== 0 && (
                          <span className="text-[#6fa85b] font-bold ml-1">
                            ({rMod > 0 ? `+${rMod}` : rMod} race)
                          </span>
                        )}
                        <div className="text-xs font-bold text-[#f3d48d] mt-0.5">
                          Total : {total} ({totalMod >= 0 ? `+${totalMod}` : totalMod})
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Capacités de départ */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-[#9e907d]">
                Au niveau 1, vous choisissez <b>2 capacités de rang 1</b> parmi les 5 voies de votre profil ({currentProfil.n}) ou les voies raciales.
              </p>
              <div className="space-y-2">
                {availableWays.map(([key, way]) => {
                  const isChecked = selectedCaps.includes(key);
                  const firstRank = way.r[0];
                  if (!firstRank) return null;
                  return (
                    <div
                      key={key}
                      onClick={() => toggleCap(key)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#2b1f13] border-[#d4a84a] shadow-xs shadow-[#d4a84a]/20'
                          : 'bg-[#1a1410] border-[#302318] hover:border-[#523d29]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#d4a84a] rounded cursor-pointer"
                          />
                          <b className="text-sm font-serif-co text-[#f3d48d]">
                            {firstRank.n}
                          </b>
                          <span className="text-[10px] text-[#9e907d] uppercase tracking-wider">
                            ({way.nom})
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b2a1a] text-[#f3d48d] font-bold">
                          Rang 1
                        </span>
                      </div>
                      <p className="text-xs text-[#cbb8a7] pl-6 leading-relaxed">
                        {firstRank.t}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Équipement gratuit de départ */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#1e1511] border border-[#d4a84a]/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-co text-sm font-bold text-[#f3d48d] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4a84a]" />
                    Dotation de départ gratuite officielle pour {currentProfil.n} :
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-[#6fa85b] bg-[#122410] px-2 py-0.5 rounded border border-[#274721]">
                    100% Gratuit
                  </span>
                </div>
                <p className="text-xs text-[#9e907d]">
                  Conformément aux règles de Chroniques Oubliées, ce paquetage complet vous est offert dès la création pour être immédiatement opérationnel en jeu.
                </p>
              </div>

              {/* Armes gratuites */}
              <div className="p-3.5 bg-[#1a1410] border border-[#3d3023] rounded-xl space-y-2">
                <b className="text-xs font-bold uppercase tracking-wider text-[#f3d48d] block">
                  ⚔️ Armes de départ incluses :
                </b>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {startingPackage.armes.map((w, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#120f0c] border border-[#2d2217] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#ede3d1]">
                        <span>{w.n}</span>
                        <span className="text-[#e06666] font-mono">{w.dm}</span>
                      </div>
                      <div className="text-[10px] text-[#9e907d] flex items-center justify-between mt-1">
                        <span>{w.t}</span>
                        <span>Crit : {w.crit}</span>
                      </div>
                      {w.props && <div className="text-[10px] text-[#d4a84a] italic mt-0.5">{w.props}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Armure et bouclier de départ */}
              <div className="p-3.5 bg-[#1a1410] border border-[#3d3023] rounded-xl space-y-2">
                <b className="text-xs font-bold uppercase tracking-wider text-[#f3d48d] block">
                  🛡️ Protection & Armure de départ :
                </b>
                <div className="text-xs text-[#ede3d1] space-y-1">
                  <div>
                    <span className="text-[#9e907d]">Armure :</span>{' '}
                    <b className="text-[#f3d48d]">{startingPackage.arm || 'Aucune armure (Robe de tissu)'}</b>
                  </div>
                  <div>
                    <span className="text-[#9e907d]">Bouclier :</span>{' '}
                    <b className="text-[#f3d48d]">{startingPackage.bou || 'Aucun bouclier'}</b>
                  </div>
                </div>
              </div>

              {/* Inventaire & Sacoche de départ */}
              <div className="p-3.5 bg-[#1a1410] border border-[#3d3023] rounded-xl space-y-2">
                <b className="text-xs font-bold uppercase tracking-wider text-[#f3d48d] block">
                  🎒 Inventaire & Vivres de départ :
                </b>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {startingPackage.inventaire.map((item, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-[#120f0c] border border-[#2d2217] flex items-center justify-between">
                      <span className="text-[#cbb8a7]">• {item.n} {item.q > 1 ? `(x${item.q})` : ''}</span>
                      <span className="text-[10px] text-[#9e907d]">{item.desc || item.note || ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bourse & Pécule initial officiel */}
              <div className="p-3.5 bg-[#1a1410] border border-[#d4a84a]/50 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <b className="text-xs font-bold uppercase tracking-wider text-[#f3d48d] flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-[#e5a93c]" />
                      Bourse & Pécule initial de l&apos;Aventurier :
                    </b>
                    <p className="text-[11px] text-[#9e907d]">
                      Règle officielle COF : paquetage gratuit + 10 PO fixe ou tirage aux dés (3d6 × 10 PA).
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ede3d1] bg-[#120f0c] px-2.5 py-1 rounded border border-[#3d3023] shrink-0">
                    <span className="text-[#f1c40f]">🟡 {startingBourse.po} PO</span>
                    <span className="text-[#cbd5e1]">⚪ {startingBourse.pa} PA</span>
                    <span className="text-[#d97706]">🟤 {startingBourse.pc} PC</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBourseMode('standard');
                      setStartingBourse({ po: 10, pa: 0, pc: 0 });
                      setDiceRollInfo(null);
                    }}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      bourseMode === 'standard'
                        ? 'bg-[#2b1f13] border-[#d4a84a] text-[#f3d48d]'
                        : 'bg-[#18130e] border-[#302318] text-[#9e907d] hover:border-[#523d29]'
                    }`}
                  >
                    <b className="text-xs block text-[#ede3d1]">📦 Pécule Fixe Standard (Recommandé)</b>
                    <span className="text-[11px] text-[#9e907d]">10 PO (soit 100 PA) de départ fixe</span>
                  </button>

                  <button
                    type="button"
                    onClick={rollStartingDice}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      bourseMode === 'dice'
                        ? 'bg-[#2b1f13] border-[#d4a84a] text-[#f3d48d]'
                        : 'bg-[#18130e] border-[#302318] text-[#9e907d] hover:border-[#523d29]'
                    }`}
                  >
                    <b className="text-xs block text-[#ede3d1] flex items-center gap-1">
                      <Dice5 className="w-3.5 h-3.5 text-[#d4a84a]" /> Tirage aux Dés (3d6 × 10 PA)
                    </b>
                    <span className="text-[11px] text-[#9e907d]">
                      {diceRollInfo
                        ? `Résultat : [${diceRollInfo.rolls.join(' + ')}] = ${diceRollInfo.totalPA} PA (${startingBourse.po} PO, ${startingBourse.pa} PA)`
                        : 'Cliquer pour lancer 3d6 × 10 PA (moyenne 105 PA)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Identité & Mensurations */}
          {step === 5 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="p-3 bg-[#1e1511] border border-[#d4a84a]/50 rounded-xl text-xs text-[#cbb8a7] leading-relaxed">
                <b className="text-[#f3d48d] block mb-1">Dernière étape avant l&apos;aventure :</b>
                Choisissez le nom de votre héros. Les mensurations d&apos;Âge, de Taille et de Poids ont été <b>pré-remplies aléatoirement</b> selon les limites physiques de sa race ({currentRace.n}) et restent totalement modifiables.
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#f3d48d] block mb-1">
                  Nom du Héros *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Conan, Dame Éléonore, Grommash..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#231c15] border border-[#523d29] focus:border-[#d4a84a] rounded-lg text-[#ede3d1] outline-hidden text-base font-semibold"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#9e907d] block mb-1">
                  Nom du Joueur (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Julien, Sophie..."
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                  className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] focus:border-[#d4a84a] outline-hidden text-sm"
                />
              </div>

              {/* Physical Mensurations Box */}
              <div className="p-3.5 bg-[#1e1913] border border-[#3d3023] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f3d48d]">
                    Mensurations de la race ({currentRace.n})
                  </span>
                  <button
                    type="button"
                    onClick={handleRerollPhysical}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#2e1f13] hover:bg-[#3d2919] text-[#f3d48d] border border-[#523d29] cursor-pointer"
                    title="Générer de nouvelles valeurs aléatoires dans les limites raciales"
                  >
                    <RefreshCw className="w-3 h-3" /> Relancer au hasard
                  </button>
                </div>

                <p className="text-[11px] text-[#9e907d]">
                  {getRaceLimitsDescription(raceId)}
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                      Âge
                    </label>
                    <input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Ex: 24 ans"
                      className="w-full px-2.5 py-1.5 bg-[#120f0c] border border-[#3d3023] focus:border-[#d4a84a] rounded-lg text-xs text-[#ede3d1] font-mono outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                      Taille
                    </label>
                    <input
                      type="text"
                      value={taille}
                      onChange={(e) => setTaille(e.target.value)}
                      placeholder="Ex: 1,82 m"
                      className="w-full px-2.5 py-1.5 bg-[#120f0c] border border-[#3d3023] focus:border-[#d4a84a] rounded-lg text-xs text-[#ede3d1] font-mono outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                      Poids
                    </label>
                    <input
                      type="text"
                      value={poids}
                      onChange={(e) => setPoids(e.target.value)}
                      placeholder="Ex: 85 kg"
                      className="w-full px-2.5 py-1.5 bg-[#120f0c] border border-[#3d3023] focus:border-[#d4a84a] rounded-lg text-xs text-[#ede3d1] font-mono outline-hidden"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-[#8e7a7a] italic">
                  💡 Ces valeurs restent modifiables à tout moment directement dans l&apos;en-tête de votre fiche de personnage en cours de campagne.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#291712] to-[#181410] border border-[#d4a84a] rounded-xl text-center">
                <Sparkles className="w-6 h-6 text-[#d4a84a] mx-auto mb-1" />
                <h3 className="font-serif-co text-2xl font-bold text-[#f3d48d]">
                  {name || 'Héros sans nom'}
                </h3>
                <p className="text-sm text-[#9e907d]">
                  {currentRace.n} • {currentProfil.n} • Niveau 1
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-[#cbb8a7] mt-1 font-mono">
                  <span>Âge : {age || 'Non défini'}</span>
                  <span>•</span>
                  <span>Taille : {taille || 'Non définie'}</span>
                  <span>•</span>
                  <span>Poids : {poids || 'Non défini'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#231c15] p-3 rounded-lg border border-[#3d3023]">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Points de Vie (PV)
                  </small>
                  <b className="font-serif-co text-xl text-[#f3d48d]">
                    {currentProfil.dv + getMod(baseStats.CON + (raceBonus.CON || 0))} PV
                  </b>
                  <span className="text-[10px] text-[#9e907d] block mt-0.5">
                    (d{currentProfil.dv} max + CON)
                  </span>
                </div>

                <div className="bg-[#231c15] p-3 rounded-lg border border-[#3d3023]">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Défense (DEF)
                  </small>
                  <b className="font-serif-co text-xl text-[#ede3d1]">
                    {10 +
                      getMod(baseStats.DEX + (raceBonus.DEX || 0)) +
                      (currentRace.defb || 0)}
                  </b>
                  <span className="text-[10px] text-[#9e907d] block mt-0.5">
                    (10 + DEX{currentRace.defb ? ' + race' : ''})
                  </span>
                </div>

                <div className="bg-[#231c15] p-3 rounded-lg border border-[#3d3023]">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Initiative
                  </small>
                  <b className="font-serif-co text-xl text-[#ede3d1]">
                    {baseStats.DEX + (raceBonus.DEX || 0)}
                  </b>
                  <span className="text-[10px] text-[#9e907d] block mt-0.5">(Score de DEX)</span>
                </div>

                <div className="bg-[#231c15] p-3 rounded-lg border border-[#3d3023]">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Déplacement
                  </small>
                  <b className="font-serif-co text-xl text-[#ede3d1]">10 m</b>
                  <span className="text-[10px] text-[#9e907d] block mt-0.5">Course : 20 m</span>
                </div>
              </div>

              {/* Selected capabilities recap */}
              <div className="bg-[#231c15] p-3 rounded-lg border border-[#3d3023]">
                <b className="text-xs text-[#f3d48d] uppercase tracking-wider block mb-1">
                  Capacités de départ choisies :
                </b>
                <div className="text-xs text-[#ede3d1] space-y-1">
                  {selectedCaps.map((k) => (
                    <div key={k}>
                      • <b>{VOIES_CATALOG[k]?.r[0]?.n}</b> ({VOIES_CATALOG[k]?.nom}) :{' '}
                      <span className="text-[#9e907d]">{VOIES_CATALOG[k]?.r[0]?.t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter gear recap */}
              <div className="bg-[#231c15] p-3 rounded-lg border border-[#3d3023] text-xs">
                <b className="text-xs text-[#f3d48d] uppercase tracking-wider block mb-1">
                  Matériel gratuit inclus ({startingPackage.armes.length} armes, {startingPackage.inventaire.length} objets) :
                </b>
                <p className="text-[#9e907d]">
                  {startingPackage.armes.map((w) => w.n).join(', ')} • {startingPackage.arm || 'Sans armure'} • Sacoche et vivres de campagne
                </p>
              </div>

              {/* Starter Purse Recap */}
              <div className="bg-[#231c15] p-3 rounded-lg border border-[#d4a84a]/50 text-xs flex items-center justify-between">
                <div>
                  <b className="text-xs text-[#f3d48d] uppercase tracking-wider block">
                    Bourse de départ :
                  </b>
                  <span className="text-[#9e907d]">Pécule officiel attribué</span>
                </div>
                <div className="flex items-center gap-2 font-mono font-bold text-sm bg-[#120f0c] px-3 py-1.5 rounded border border-[#3d3023]">
                  <span className="text-[#f1c40f]">🟡 {startingBourse.po} PO</span>
                  <span className="text-[#cbd5e1]">⚪ {startingBourse.pa} PA</span>
                  <span className="text-[#d97706]">🟤 {startingBourse.pc} PC</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-5 py-3 border-t border-[#3d3023] bg-[#120f0c] flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] rounded-lg text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Précédent
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] rounded-lg text-xs font-semibold cursor-pointer"
            >
              Annuler
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={step === 2 && !canProceedStep2}
            className={`flex items-center gap-1.5 px-6 py-2 font-bold rounded-lg text-xs shadow-md transition-all ${
              step === 2 && !canProceedStep2
                ? 'bg-[#2a1d17] text-[#7d6550] border border-[#3d2a1d] cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-[#d4a84a] to-[#b38833] hover:from-[#e0b555] hover:to-[#c4973c] text-black cursor-pointer'
            }`}
          >
            {step === 6 ? (
              <>
                <Check className="w-4 h-4" /> Créer mon Héros
              </>
            ) : (
              <>
                Continuer <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pop-up modal pour afficher les infos complètes de la race ou du profil */}
      <DetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onAction={(action, payload) => {
          if (action === 'selectRace' && payload?.id) {
            handlePickRace(payload.id);
          } else if (action === 'selectProfil' && payload?.id) {
            handlePickProfil(payload.id);
          }
        }}
      />
    </div>
  );
};
