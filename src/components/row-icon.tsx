import type { LucideIcon } from "lucide-react";
import SmartImage from "./smart-image";

/**
 * An item's icon: whatever the admin uploaded for that row in the CMS, or the
 * component's built-in Lucide icon for that row's `key` when they haven't.
 *
 * Uploaded icons render as-is (their own colours); the Lucide fallback keeps
 * inheriting `text-accent`, so a page with no uploads looks exactly as before.
 */
export default function RowIcon({
  src,
  fallback: Fallback,
  className = "size-7 text-accent",
  alt = "",
}: {
  src?: unknown;
  fallback: LucideIcon;
  className?: string;
  alt?: string;
}) {
  const uploaded = typeof src === "string" ? src.trim() : "";
  if (uploaded) {
    return (
      <SmartImage
        src={uploaded}
        alt={alt}
        width={28}
        height={28}
        className={className.replace(/text-\S+/g, "") + " object-contain"}
      />
    );
  }
  return <Fallback className={className} aria-hidden />;
}
