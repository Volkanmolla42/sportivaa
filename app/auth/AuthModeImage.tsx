"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";

function AuthModeImage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "register" ? "register" : "login";

  return (
    <Image
      src={mode === "login" ? "/images/auth-illustration.svg" : "/images/register-illustration.svg"}
      alt={mode === "login" ? "Giriş İllüstrasyonu" : "Kayıt İllüstrasyonu"}
      fill
      className="object-contain"
      priority={false}
    />
  );
}

export default AuthModeImage;
