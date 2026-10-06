import React from "react";
import Image from "next/image";

export type MascotVariant =
  | "hero-wave"
  | "security-shield"
  | "working-laptop"
  | "mail-send"
  | "pricing-peek"
  | "celebrate"
  | "mail-sorting"
  | "primary-mascot";

interface MascotProps {
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: MascotVariant;
  width?: number;
  height?: number;
}

export function Mascot({
  alt,
  className = "",
  priority = false,
  variant = "hero-wave",
  width,
  height,
}: MascotProps) {
  const imagePath = `/mascot/${variant}.webp`;

  if (width && height) {
    return (
      <Image
        src={imagePath}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain ${className}`}
        priority={priority}
      />
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[40px] min-w-[40px] ${className}`}>
      <Image
        src={imagePath}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
