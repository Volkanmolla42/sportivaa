"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const textSizes = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-3xl",
  };

  const iconSizes = {
    small: "w-5 h-5",
    default: "w-7 h-7",
    large: "w-9 h-9",
  };

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${iconSizes[size]}`}
        >
          <path 
            d="M14 20C14 16.6863 16.6863 14 20 14H44C47.3137 14 50 16.6863 50 20V44C50 47.3137 47.3137 50 44 50H20C16.6863 50 14 47.3137 14 44V20Z" 
            className="fill-teal-500 dark:fill-teal-400" 
          />
          <path 
            d="M14 32C14 28.6863 16.6863 26 20 26H44C47.3137 26 50 28.6863 50 32V44C50 47.3137 47.3137 50 44 50H20C16.6863 50 14 47.3137 14 44V32Z" 
            className="fill-blue-500 dark:fill-blue-400" 
          />
          <path 
            d="M32 14L44 26H20L32 14Z" 
            className="fill-teal-700 dark:fill-teal-300" 
          />
          <circle 
            cx="32" 
            cy="38" 
            r="6" 
            className="fill-white dark:fill-gray-800" 
          />
        </svg>
      </div>
      <span className={`font-bold ${textSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400`}>
        Sportiva
      </span>
    </motion.div>
  );
}

// Logo'yu Link ile sarmalayan yardımcı bileşen
export default function LogoLink({ href = "/", className = "", size = "default" }: { href?: string; className?: string; size?: "small" | "default" | "large" }) {
  return (
    <Link href={href} className={`inline-block ${className}`}>
      <Logo size={size} />
    </Link>
  );
}
