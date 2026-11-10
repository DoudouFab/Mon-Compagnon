// Générateur de valeurs cohérentes d'Âge, de Taille et de Poids par Race (Chroniques Oubliées)

interface RacePhysicalRange {
  minAge: number;
  maxAge: number;
  minTailleCm: number;
  maxTailleCm: number;
  minPoidsKg: number;
  maxPoidsKg: number;
}

const RACE_PHYSICAL_BOUNDS: Record<string, RacePhysicalRange> = {
  humain: {
    minAge: 18,
    maxAge: 45,
    minTailleCm: 155,
    maxTailleCm: 195,
    minPoidsKg: 50,
    maxPoidsKg: 105,
  },
  'demi-elfe': {
    minAge: 20,
    maxAge: 60,
    minTailleCm: 155,
    maxTailleCm: 190,
    minPoidsKg: 45,
    maxPoidsKg: 80,
  },
  'elfe-haut': {
    minAge: 80,
    maxAge: 200,
    minTailleCm: 155,
    maxTailleCm: 185,
    minPoidsKg: 45,
    maxPoidsKg: 70,
  },
  'elfe-sylvain': {
    minAge: 50,
    maxAge: 150,
    minTailleCm: 145,
    maxTailleCm: 175,
    minPoidsKg: 40,
    maxPoidsKg: 65,
  },
  nain: {
    minAge: 40,
    maxAge: 120,
    minTailleCm: 120,
    maxTailleCm: 142,
    minPoidsKg: 60,
    maxPoidsKg: 95,
  },
  'demi-orque': {
    minAge: 14,
    maxAge: 32,
    minTailleCm: 175,
    maxTailleCm: 212,
    minPoidsKg: 85,
    maxPoidsKg: 140,
  },
  gnome: {
    minAge: 40,
    maxAge: 100,
    minTailleCm: 90,
    maxTailleCm: 115,
    minPoidsKg: 20,
    maxPoidsKg: 32,
  },
  halfelin: {
    minAge: 20,
    maxAge: 50,
    minTailleCm: 85,
    maxTailleCm: 110,
    minPoidsKg: 25,
    maxPoidsKg: 38,
  },
};

function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomPhysicalStats(raceId: string): {
  age: string;
  taille: string;
  poids: string;
} {
  const bounds = RACE_PHYSICAL_BOUNDS[raceId] || RACE_PHYSICAL_BOUNDS['humain'];
  const ageNum = randBetween(bounds.minAge, bounds.maxAge);
  const tailleNum = randBetween(bounds.minTailleCm, bounds.maxTailleCm);
  const poidsNum = randBetween(bounds.minPoidsKg, bounds.maxPoidsKg);

  const tailleM = (tailleNum / 100).toFixed(2).replace('.', ',') + ' m';

  return {
    age: `${ageNum} ans`,
    taille: tailleM,
    poids: `${poidsNum} kg`,
  };
}

export function getRaceLimitsDescription(raceId: string): string {
  const b = RACE_PHYSICAL_BOUNDS[raceId] || RACE_PHYSICAL_BOUNDS['humain'];
  return `Âge: ${b.minAge}-${b.maxAge} ans | Taille: ${(b.minTailleCm / 100).toFixed(2).replace('.', ',')} à ${(b.maxTailleCm / 100).toFixed(2).replace('.', ',')} m | Poids: ${b.minPoidsKg}-${b.maxPoidsKg} kg`;
}
