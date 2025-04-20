"use client";

import Image from "next/image";

function Logo({ size = "default", className = "" }) {
  const sizes = {
    small: { icon: 16, brand: { width: 90, height: 40 } },
    default: { icon: 28, brand: { width: 160, height: 80 } },
    large: { icon: 36, brand: { width: 200, height: 100 } }
  };

  const current = sizes[size as keyof typeof sizes];

  return (
    <div className={`flex items-end transition-all duration-300 ${className}`}>
      <Image 
        width={current.icon} 
        height={current.icon}
        src="/images/sportiva-only-logo.svg" 
        alt="Sportiva Logo" 
        style={{ width: current.icon, height: "auto", aspectRatio: "1 / 1" }}
        priority
      />
      <Image 
        width={current.brand.width} 
        height={current.brand.height}
        src="/images/sportiva-only-brand.svg" 
        alt="Sportiva Brand" 
        style={{ width: current.brand.width, height: "auto" }}
        priority
      />
    </div>
  );
}

// LogoLink bileşeni kaldırıldı, sadece Logo fonksiyonel bileşeni export ediliyor
export default Logo;