import React, { useRef, useState } from 'react';
import { Sparkles, RefreshCw, Upload, Link2, Trash2, User } from 'lucide-react';
import { Character } from '../../types/chroniques';
import { buildCharacterPortraitSvg } from '../../utils/fantasyPortraitGenerator';
import { compressImageFile, isSafeImageUrl, svgToCompressedDataUrl } from '../../utils/imageUtils';
import { useToast } from './ToastContext';

interface PortraitPickerProps {
  value?: string;
  onChange: (portraitUrl: string | undefined) => void;
  characterDraft: Partial<Character>;
  compact?: boolean;
  label?: string;
}

export const PortraitPicker: React.FC<PortraitPickerProps> = ({
  value,
  onChange,
  characterDraft,
  compact = false,
  label = 'Portrait du personnage',
}) => {
  const { warning, success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [seed, setSeed] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [urlDraft, setUrlDraft] = useState<string>('');

  const handleGenerate = async (nextSeed: number) => {
    setBusy(true);
    try {
      const svg = buildCharacterPortraitSvg(characterDraft, nextSeed);
      const dataUrl = await svgToCompressedDataUrl(svg, 384, 0.85);
      setSeed(nextSeed);
      onChange(dataUrl);
    } catch (err: any) {
      error('Impossible de générer le portrait : ' + (err?.message || 'Erreur inconnue'));
    } finally {
      setBusy(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const compressed = await compressImageFile(file, 384, 0.8);
      onChange(compressed);
      success('Portrait importé et optimisé !');
    } catch (err: any) {
      error(err?.message || "Erreur lors de l'import de l'image.");
    } finally {
      setBusy(false);
    }
  };

  const handleApplyUrl = () => {
    if (!urlDraft.trim() || !isSafeImageUrl(urlDraft)) {
      warning('Veuillez entrer une URL d’image valide (https://... ou /...).');
      return;
    }
    onChange(urlDraft.trim());
    setShowUrlInput(false);
    setUrlDraft('');
    success('Portrait lié depuis l’URL !');
  };

  return (
    <div className={`bg-[#14100c] border border-[#3d3023] rounded-xl ${compact ? 'p-3' : 'p-3.5'} space-y-2.5`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4a84a] flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>{label}</span>
        </span>
        <span className="text-[10px] text-[#9e907d]">
          Stocké dans la fiche (léger &amp; synchronisé)
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Aperçu */}
        <div
          className={`${
            compact ? 'w-20 h-20' : 'w-24 h-24'
          } shrink-0 rounded-xl overflow-hidden border-2 border-[#d4a84a]/60 bg-[#0d0a08] flex items-center justify-center relative shadow-inner`}
        >
          {value ? (
            <img
              src={value}
              alt={characterDraft.name || 'Portrait'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-2 text-[#7a6b59]">
              <User className="w-7 h-7 mx-auto opacity-50 mb-0.5" />
              <span className="text-[9px] block leading-tight">Aucun visuel</span>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleGenerate(value ? seed + 1 : 0)}
              className="px-2.5 py-1.5 rounded-lg bg-[#2a1d12] hover:bg-[#3b2919] border border-[#d4a84a]/60 text-[#f3d48d] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Générer gratuitement un portrait fidèle à la race et au profil, ou rafraîchir une variante"
            >
              {value ? <RefreshCw className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{value ? 'Variante (Refresh)' : 'Générer portrait'}</span>
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Importer votre propre image depuis votre appareil"
            >
              <Upload className="w-3.5 h-3.5 text-[#86efac]" />
              <span>Importer</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput((s) => !s)}
              className="px-2.5 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#cbb8a7] text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Coller un lien d'image externe"
            >
              <Link2 className="w-3.5 h-3.5 text-[#93c5fd]" />
              <span>URL</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="px-2 py-1.5 rounded-lg bg-[#301616] hover:bg-[#471f1f] border border-[#6b2525] text-[#fca5a5] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Retirer le portrait"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {showUrlInput && (
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                placeholder="https://exemple.com/mon-portrait.jpg"
                className="flex-1 bg-[#1e1711] border border-[#3d3023] focus:border-[#d4a84a] rounded-lg px-2.5 py-1 text-xs text-[#ede3d1] outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-2.5 py-1 rounded-lg bg-[#d4a84a] text-black font-bold text-xs cursor-pointer"
              >
                OK
              </button>
            </div>
          )}

          <p className="text-[10px] text-[#9e907d] leading-snug">
            Importez votre propre image (compressée automatiquement) ou générez un portrait selon la race (<b>{characterDraft.race || 'humain'}</b>) et le profil (<b>{characterDraft.profil || 'guerrier'}</b>).
          </p>
        </div>
      </div>
    </div>
  );
};
