interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  width?: number;
  height?: number;
  sizes?: string;
}

function stripExt(path: string): { base: string; ext: string } {
  const m = path.match(/^(.*)\.(png|jpg|jpeg|webp)$/i);
  if (!m) return { base: path, ext: '' };
  return { base: m[1], ext: m[2].toLowerCase() };
}

/**
 * Renders a responsive <picture> element.
 * Expects that optimize-images.js was run and produced:
 *   <base>-1600.avif, <base>-800.avif,
 *   <base>-1600.webp, <base>-800.webp,
 *   <base>-1600.jpg, <base>-800.jpg
 * Falls back to the original `src` if the optimized variants don't exist (legacy pages).
 */
export default function ResponsiveImage({
  src,
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, 800px',
}: ResponsiveImageProps) {
  const { base } = stripExt(src);
  const avifSrcSet = `${base}-800.avif 800w, ${base}-1600.avif 1600w`;
  const webpSrcSet = `${base}-800.webp 800w, ${base}-1600.webp 1600w`;
  const jpgSrcSet = `${base}-800.jpg 800w, ${base}-1600.jpg 1600w`;

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        width={width}
        height={height}
      />
    </picture>
  );
}
