import Image, { type ImageProps } from "next/image";

type SmartImageProps = Omit<ImageProps, "src"> & { src: string };

/**
 * next/image refuses to render `data:` URIs (throws "Invalid src prop") —
 * but that's exactly what the CMS editor produces when someone pastes an
 * image directly into a page's JSON content (see backend main.ts: "the page
 * editor can send base64-encoded images inside JSON content"). Since every
 * image on this site is CMS-first with a local fallback, any of them could
 * end up being a data URI at runtime, so this wrapper drops to a plain
 * <img> for that case and keeps next/image's optimization for everything
 * else (the bundled local fallbacks, or CMS values that are real URLs).
 */
export default function SmartImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
  ...rest
}: SmartImageProps) {
  if (src.startsWith("data:")) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      // A CMS-provided remote URL isn't in next.config's image domains, so
      // it can't go through the optimizer — only locally-bundled fallbacks
      // (paths starting with "/") and same-origin CMS URLs can be.
      unoptimized={!src.startsWith("/")}
      {...rest}
    />
  );
}
