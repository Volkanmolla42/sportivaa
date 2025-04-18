"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MenuIcon, 
  XIcon, 
  MoonIcon, 
  SunIcon,
  ChevronDownIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import LogoLink from "./Logo";

// Ana menü öğeleri
const menuItems = [
  { label: "Ana Sayfa", href: "/" },
  { 
    label: "Ürünler", 
    href: "#", 
    submenu: [
      { label: "Salon Yönetimi", href: "/products/gym-management" },
      { label: "Eğitmen Araçları", href: "/products/trainer-tools" },
      { label: "Üye Deneyimi", href: "/products/member-experience" }
    ]
  },
  { label: "Fiyatlandırma", href: "/pricing" },
  { label: "Hakkımızda", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/contact" }
];

// Header bileşeni
export default function HeaderSection() {
  const { userId, isLoading } = useAuth();
  const [state, setState] = useState({
    isScrolled: false,
    mobileMenuOpen: false,
    activeSubmenu: null as number | null,
    theme: "light" as "light" | "dark",
  });

  // Scroll durumunu kontrol etme
  useEffect(() => {
    const handleScroll = () => {
      setState(prev => ({
        ...prev,
        isScrolled: window.scrollY > 10
      }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tema değişikliğini kontrol et
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setState(prev => ({ ...prev, theme: isDark ? "dark" : "light" }));
  }, []);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setState(prev => ({ ...prev, theme: newTheme }));
  };

  // Mobil menü geçişi
  const toggleMobileMenu = () => {
    setState(prev => ({ 
      ...prev, 
      mobileMenuOpen: !prev.mobileMenuOpen 
    }));
  };

  // Alt menü geçişi
  const toggleSubmenu = (index: number | null) => {
    setState(prev => ({
      ...prev,
      activeSubmenu: prev.activeSubmenu === index ? null : index
    }));
  };

  // Header animasyonu
  const headerVariants = {
    initial: { y: -100 },
    animate: { y: 0, transition: { duration: 0.5 } }
  };

  // Mobil menü animasyonu
  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    },
    open: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        state.isScrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <LogoLink size="large" />

          {/* Masaüstü Navigasyon */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.submenu ? (
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-md transition ${
                      state.activeSubmenu === index ? "text-teal-600 dark:text-teal-400" : ""
                    }`}
                  >
                    {item.label}
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-md transition"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Alt menü içeriği */}
                {item.submenu && (
                  <AnimatePresence>
                    {state.activeSubmenu === index && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-10"
                      >
                        {item.submenu.map((subitem, subindex) => (
                          <Link
                            key={subindex}
                            href={subitem.href}
                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Sağ Bölüm - Butonlar */}
          <div className="flex items-center space-x-4">
            {/* Tema Değiştirme */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label={state.theme === "light" ? "Karanlık moda geç" : "Aydınlık moda geç"}
            >
              {state.theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>

            {/* Giriş/Kayıt veya Dashboard butonları */}
            {isLoading ? (
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
            ) : userId ? (
              <Button asChild size="sm" className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth?mode=login">
                    Giriş Yap
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
                  <Link href="/auth?mode=register">
                    Kayıt Ol
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobil menü butonu */}
            <button
              onClick={toggleMobileMenu}
              className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 md:hidden rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label={state.mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {state.mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        <AnimatePresence>
          {state.mobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden overflow-hidden mt-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-lg divide-y divide-gray-100 dark:divide-gray-800">
                <nav className="py-2">
                  {menuItems.map((item, index) => (
                    <div key={index}>
                      {item.submenu ? (
                        <div>
                          <button
                            onClick={() => toggleSubmenu(index)}
                            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <span>{item.label}</span>
                            <ChevronDownIcon 
                              className={`h-4 w-4 transition-transform ${
                                state.activeSubmenu === index ? "rotate-180" : ""
                              }`} 
                            />
                          </button>

                          <AnimatePresence>
                            {state.activeSubmenu === index && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-gray-50 dark:bg-gray-800/50"
                              >
                                {item.submenu.map((subitem, subindex) => (
                                  <Link
                                    key={subindex}
                                    href={subitem.href}
                                    className="block px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                                  >
                                    {subitem.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {!userId && !isLoading && (
                  <div className="py-3 px-4 space-y-2">
                    <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
                      <Link href="/auth?mode=register">
                        Kayıt Ol
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth?mode=login">
                        Giriş Yap
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
