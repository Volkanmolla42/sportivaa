"use client";

import { memo } from "react";
import Image from "next/image";

interface AuthModeImageProps {
  mode: "login" | "register";
}

function AuthModeImage({ mode }: AuthModeImageProps) {
  return (
    <Image
      src={
        mode === "login"
          ? "/images/auth-illustration.svg"
          : "/images/register-illustration.svg"
      }
      alt={mode === "login" ? "Giriş İllüstrasyonu" : "Kayıt İllüstrasyonu"}
      fill
      className="object-contain"
      priority={true}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}

export default memo(AuthModeImage);
