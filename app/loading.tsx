"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <DotLottieReact
        src="https://assets-v2.lottiefiles.com/a/91ccdf52-1150-11ee-b7cc-8f23ce57c5d5/wymtr1VNya.lottie"
        loop
        autoplay
        style={{ width: 120, height: 120 }}
      />
      <p className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
        Yükleniyor...
      </p>
    </div>
  );
}
