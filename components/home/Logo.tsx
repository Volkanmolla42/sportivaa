"use client";

import Link from "next/link";
import Image from "next/image";

function Logo({ size = "default", className = "" }) {
  const sizes = {
    small: { icon: 16, brand: { width: 90, height: 40 } },
    default: { icon: 22, brand: { width: 120, height: 60 } },
    large: { icon: 28, brand: { width: 200, height: 200 } }
  };

  const current = sizes[size as keyof typeof sizes];

  return (
    <div className={`items-center flex gap-3 ${className}`}>
      <Image 
        width={current.icon} 
        height={current.icon}
        src="/images/sportiva-only-logo.svg" 
        alt="Sportiva Logo" 
      />
      <Image 
        width={current.brand.width} 
        height={current.brand.height}
        src="/images/sportiva-only-brand.svg" 
        alt="Sportiva Brand" 
      />
    </div>
  );
}

// Logo with link functionality
function LogoLink({ href = "/", size = "default", className = "" }) {
  return (
    <Link href={href} className={`inline-block ${className}`}>
      <Logo size={size} />
    </Link>
  );
}

export default LogoLink;