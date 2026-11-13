/**
 * Utilitaires de compression et normalisation d'images (100% côté client, 0 API payante).
 * Garde chaque portrait sous ~30-55 Ko afin de préserver Firebase RTDB et localStorage.
 */

export const compressImageFile = (
  file: File,
  maxSize = 384,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Veuillez sélectionner un fichier image valide (PNG, JPG, WebP, GIF).'));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error('Image trop volumineuse (max 15 Mo avant compression).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire le fichier image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Format d'image non pris en charge par le navigateur."));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas indisponible.'));
            return;
          }

          // Recadrage centré carré (cover)
          const minSide = Math.min(img.width, img.height);
          const sx = Math.max(0, (img.width - minSide) / 2);
          const sy = Math.max(0, (img.height - minSide) / 2);

          ctx.fillStyle = '#120e0a';
          ctx.fillRect(0, 0, maxSize, maxSize);
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxSize, maxSize);

          let out = canvas.toDataURL('image/webp', quality);
          if (!out.startsWith('data:image/webp')) {
            out = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(out);
        } catch (err) {
          reject(err);
        }
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
};

export const svgToCompressedDataUrl = (
  svgMarkup: string,
  maxSize = 384,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas indisponible.'));
          return;
        }
        ctx.fillStyle = '#120e0a';
        ctx.fillRect(0, 0, maxSize, maxSize);
        ctx.drawImage(img, 0, 0, maxSize, maxSize);
        URL.revokeObjectURL(url);

        let out = canvas.toDataURL('image/webp', quality);
        if (!out.startsWith('data:image/webp')) {
          out = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(out);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      // Repli léger en SVG data URI si le navigateur bloque la rastérisation
      resolve('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMarkup));
    };
    img.src = url;
  });
};

export const isSafeImageUrl = (raw: string): boolean => {
  const trimmed = raw.trim();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/')
  );
};
