"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRightIcon, Activity, Calendar, Users, Shield, ChevronRightIcon } from "lucide-react";

export default function HeroSection() {
  const { userId, isLoading, error } = useAuth();
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Yükleme durumu bileşeni
  if (isLoading) {
    return <HeroSkeleton />;
  }

  // Hata durumu bileşeni
  if (error) {
    return <HeroError error={error} />;
  }

  const stats = [
    { id: "gyms", value: "150+", label: "Spor Salonu", icon: <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> },
    { id: "trainers", value: "500+", label: "Profesyonel Eğitmen", icon: <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> },
    { id: "sessions", value: "20K+", label: "Aylık Antrenman", icon: <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> },
    { id: "users", value: "10K+", label: "Aktif Kullanıcı", icon: <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> },
  ];

  return (
    <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden isolate">
      {/* Arkaplan efektleri */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute bg-grid-pattern inset-0"></div>
      </div>
      
      <div className="absolute top-0 left-1/2 right-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48">
        <div
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
          }}
        />
      </div>
      
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-500/30 dark:bg-teal-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/30 dark:bg-indigo-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="absolute w-full h-32 bg-gradient-to-b from-white/0 to-white/80 dark:from-gray-900/0 dark:to-gray-900/80 bottom-0 z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-600/10 dark:from-indigo-400/10 dark:to-teal-400/10 border border-indigo-100 dark:border-indigo-900"
            >
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-teal-400">
                Türkiye'nin en büyük spor yönetim platformu 🚀
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="relative inline-block">
                <span className="relative bg-gradient-to-r from-indigo-600 via-teal-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-teal-400 dark:to-blue-400">Sporda Dijital</span>
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative inline-block mt-1 bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-teal-400 dark:to-indigo-400"
              >
                Dönüşümün Merkezi
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
            >
              Sportiva ile spor salonları, eğitmenler ve üyeler için entegre platform. 
              Çoklu rol yönetimi, salonlar arası fitness geçmişi ve randevu sistemi ile 
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold"> sporun geleceğini şimdi yaşayın</span>.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {userId ? (
                <Button asChild size="lg" className="group relative shadow-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 dark:from-indigo-600 dark:to-teal-600 text-white border-none overflow-hidden">
                  <Link href="/dashboard" className="flex items-center gap-2 relative z-10">
                    Dashboard'a Git
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="group relative shadow-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 dark:from-indigo-600 dark:to-teal-600 text-white border-none overflow-hidden">
                    <Link href="/auth/register" className="flex items-center gap-2 relative z-10">
                      Hemen Başla
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="shadow-md group">
                    <Link href="/products" className="flex items-center gap-2">
                      Ürünleri Keşfet
                      <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
            
            {/* İstatistik kartları */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-3xl mx-auto lg:mx-0"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                  }}
                  onHoverStart={() => setHoveredElement(stat.id)}
                  onHoverEnd={() => setHoveredElement(null)}
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border ${
                    hoveredElement === stat.id 
                      ? "bg-white/80 dark:bg-gray-800/80 border-indigo-200 dark:border-indigo-900" 
                      : "bg-white/40 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800"
                  } backdrop-blur-sm transition-all duration-300`}
                >
                  <div className="mb-2">{stat.icon}</div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-teal-400">
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[550px] rounded-xl overflow-hidden shadow-2xl">
              {/* Ön plan görseli */}
              <motion.div 
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 z-20"
              >
                <Image
                  src="/images/hero-image.jpg"
                  alt="Sportiva Fitness"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/25 to-transparent mix-blend-overlay"></div>
              </motion.div>
              
              {/* Animasyonlu arka plan efekti */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-10">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-indigo-500/20 via-teal-500/20 to-indigo-500/20 opacity-50 blur-2xl"></div>
                </motion.div>
              </div>
              
              {/* Kart üzerindeki UI elementi */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 md:bottom-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-indigo-100 dark:border-gray-800 z-30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-1">Çoklu Rol Yönetimi</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tek hesap ile salon sahibi, eğitmen ve üye olarak sistemi kullanın. İhtiyacınız olan role anında geçiş yapın.</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Yan grafik elementi */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -right-16 md:-right-20 top-1/3 w-32 md:w-40 h-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-indigo-100 dark:border-gray-800 hidden sm:block z-30"
            >
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Büyüme Grafiği</h4>
              <div className="flex items-end h-14 gap-1">
                {[30, 45, 25, 60, 75, 65, 90].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-teal-600 dark:from-indigo-500 dark:to-teal-500"
                    style={{ height: `${height}%` }} 
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-2">Son 7 gün</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Yükleme durumu için iskelet bileşen
function HeroSkeleton() {
  return (
    <section className="relative w-full py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-16 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-2/3" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-36" />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <Skeleton className="relative h-[500px] rounded-xl" />
        </div>
      </div>
    </section>
  );
}

// Hata durumu bileşeni
function HeroError({ error }: { error: string }) {
  return (
    <section className="relative w-full py-24 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
            Bir hata oluştu
          </h2>
          <p className="text-red-700 dark:text-red-300">
            {error}
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Yeniden Dene
          </Button>
        </div>
      </div>
    </section>
  );
}
