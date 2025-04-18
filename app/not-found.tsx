"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-teal-50 p-8">
      <div className="flex flex-col items-center gap-6 max-w-md w-full">
      <DotLottieReact
      src="https://lottie.host/a883480b-6f17-45c6-a5f6-fb81bba7651d/8B2RWiproY.lottie"
      loop
      autoplay
    />
        <h1 className="text-4xl text-gray-600 font-bold text-center">Sayfa Bulunamadı</h1>
        <p className="text-center text-gray-600">
          Aradığınız sayfa bulunamadı veya kaldırılmış olabilir.
        </p>
        <Button asChild className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium">
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </main>
  );
}
