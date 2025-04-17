"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  ActivityIcon, 
  UsersIcon, 
  ClockIcon, 
  BarChartIcon, 
  ShieldIcon,
  ArrowRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Ana bileşen
export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  
  const features = [
    {
      icon: <CalendarIcon className="w-6 h-6" />,
      title: "Kolay Randevu Yönetimi",
      description: "Salonunuzdaki dersleri ve randevuları tek bir platformdan yönetin. Üyeler kolayca rezervasyon yapabilir ve hatırlatmalar alabilir.",
      bgColor: "from-blue-600/10 via-blue-600/5 to-transparent",
      accentColor: "text-blue-600 dark:text-blue-400",
      borderColor: "group-hover:border-blue-200 dark:group-hover:border-blue-900",
      href: "/products/appointments"
    },
    {
      icon: <ActivityIcon className="w-6 h-6" />,
      title: "Çoklu Rol Desteği",
      description: "Tek hesap ile üye, eğitmen ve salon yöneticisi olarak sistemi kullanın. İhtiyacınız olan role anında geçiş yaparak farklı perspektiflerden platformu yönetin.",
      bgColor: "from-indigo-600/10 via-indigo-600/5 to-transparent",
      accentColor: "text-indigo-600 dark:text-indigo-400",
      borderColor: "group-hover:border-indigo-200 dark:group-hover:border-indigo-900",
      href: "/products/multi-role"
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "Salonlar Arası Fitness Geçmişi",
      description: "Kullanıcı fitness geçmişi salon sınırlarını aşar. Üyeler, farklı salonlardaki tüm antrenman geçmişlerini tek bir yerden görüntüleyebilir.",
      bgColor: "from-violet-600/10 via-violet-600/5 to-transparent",
      accentColor: "text-violet-600 dark:text-violet-400",
      borderColor: "group-hover:border-violet-200 dark:group-hover:border-violet-900",
      href: "/products/cross-gym-history"
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Şeffaf Onay Mekanizmaları",
      description: "Salon-üye ve salon-eğitmen ilişkilerinde şeffaf onay süreci. Davetler, kabuller ve redler net bir şekilde takip edilir.",
      bgColor: "from-teal-600/10 via-teal-600/5 to-transparent",
      accentColor: "text-teal-600 dark:text-teal-400",
      borderColor: "group-hover:border-teal-200 dark:group-hover:border-teal-900",
      href: "/products/approval-system"
    },
    {
      icon: <BarChartIcon className="w-6 h-6" />,
      title: "Analitik Çözümler",
      description: "Salonunuzun performansını, üye eğilimlerini ve gelir akışını analiz edin. Veri odaklı kararlar vermenizi sağlayan detaylı raporlar.",
      bgColor: "from-pink-600/10 via-pink-600/5 to-transparent",
      accentColor: "text-pink-600 dark:text-pink-400",
      borderColor: "group-hover:border-pink-200 dark:group-hover:border-pink-900",
      href: "/products/analytics"
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: "Veri Gizliliği ve Kullanıcı İzni",
      description: "Kişisel verileriniz en üst düzey güvenlik önlemleriyle korunur. Kullanıcılar, verilerinin nasıl paylaşılacağına dair tam kontrol sahibidir.",
      bgColor: "from-amber-600/10 via-amber-600/5 to-transparent",
      accentColor: "text-amber-600 dark:text-amber-400",
      borderColor: "group-hover:border-amber-200 dark:group-hover:border-amber-900",
      href: "/products/data-privacy"
    }
  ];

  return (
    <section className="w-full py-24 overflow-hidden">
      {/* Orta süsleme elementi */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-900/5 blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative inline-flex items-center justify-center mb-4"
          >
            <span className="relative z-10 inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-600/10 dark:from-indigo-400/10 dark:to-teal-400/10 border border-indigo-100 dark:border-indigo-900">
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-teal-400">
                Benzersiz Özellikler
              </span>
            </span>
            <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/50 blur-xl opacity-50 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-700 via-teal-700 to-blue-700 dark:from-indigo-300 dark:via-teal-300 dark:to-blue-300 bg-clip-text text-transparent leading-tight"
          >
            Spor Deneyiminizi Yeniden Tanımlayın
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Sportiva, salon yönetiminden kişisel antrenman takibine kadar fitness ekosisteminin her alanında 
            devrim yaratıyor. Yenilikçi özelliklerimiz ile spor deneyiminizi bir üst seviyeye taşıyın.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
              className={`group relative flex flex-col bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 ${feature.borderColor} shadow-sm transition-all duration-300 overflow-hidden backdrop-blur-sm hover:shadow-xl will-change-transform`}
              style={{
                transform: activeFeature === index ? "scale(1.02) translateY(-4px)" : "scale(1) translateY(0)",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              {/* Arka plan efekti */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl"></div>
                
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${feature.bgColor} ${feature.accentColor} transition-all duration-300 group-hover:shadow-md`}>
                {feature.icon}
              </div>
              
              <h3 className={`relative z-10 text-xl font-semibold mb-3 ${feature.accentColor} transition-all duration-300`}>{feature.title}</h3>
              
              <p className="relative z-10 text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                {feature.description}
              </p>
              
              <div className="relative z-10 mt-auto">
                <Link 
                  href={feature.href}
                  className={`inline-flex items-center text-sm font-medium ${feature.accentColor} hover:underline`}
                >
                  <span>Daha Fazla Bilgi</span>
                  <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Alt CTA bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 text-center"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-medium py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            <Link href="/products">
              Tüm Özellikleri Keşfedin
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
