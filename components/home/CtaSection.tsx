"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRightIcon, CheckIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// CTA özelliklerinin listesi
const features = [
  {
    role: "Salon Sahipleri",
    icon: "💼",
    color: "from-blue-600 to-indigo-600",
    bgColor:
      "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    items: [
      "Üye yönetimi ve kayıt takibi",
      "Eğitmen ilişkileri düzenlemesi",
      "Gelir ve performans analitikleri",
      "Dijital ödeme takibi",
      "Kampanya ve paket yönetimi",
    ],
  },
  {
    role: "Eğitmenler",
    icon: "💪",
    color: "from-indigo-600 to-purple-600",
    bgColor:
      "from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30",
    items: [
      "Profesyonel profil oluşturma",
      "Randevu takvimi yönetimi",
      "Üye performans takibi",
      "Çoklu salon çalışma desteği",
      "İlerleme ve verim raporları",
    ],
  },
  {
    role: "Üyeler",
    icon: "🏋️",
    color: "from-teal-600 to-blue-600",
    bgColor:
      "from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30",
    items: [
      "Tek platformda tüm spor geçmişi",
      "Eğitmen seçimi ve randevu yönetimi",
      "Kişisel gelişim takibi ve grafikler",
      "Salon değerlendirmeleri ve yorumlar",
      "Üyelik durum takibi",
    ],
  },
];

// SSS Verileri
const faqItems = [
  {
    question: "Sportiva'yı farklı rollerde aynı anda kullanabilir miyim?",
    answer:
      "Evet, Sportiva tek bir hesapla farklı rollere geçiş yapmanıza olanak tanır. Hem bir spor salonunun sahibi, hem bir başka salonda eğitmen, hem de başka bir salonda üye olabilirsiniz.",
  },
  {
    question: "Platformu kullanmak için ücret ödemem gerekiyor mu?",
    answer:
      "Sportiva temel özellikleri tüm kullanıcılar için ücretsizdir. Salon sahipleri ve eğitmenler için gelişmiş analitik ve yönetim araçları içeren premium paketlerimiz bulunmaktadır.",
  },
  {
    question: "Kişisel verilerim güvende mi?",
    answer:
      "Sportiva'da veri güvenliği en önemli önceliğimizdir. En yüksek güvenlik standartları ve veri şifreleme teknikleriyle kişisel verilerinizi koruyoruz. Her kullanıcı kendi verileri üzerinde tam kontrol sahibidir.",
  },
  {
    question: "Mobil cihazlardan da erişim sağlayabilir miyim?",
    answer:
      "Evet, Sportiva tamamen mobil uyumlu bir web uygulamasıdır. Ayrıca yakın zamanda iOS ve Android için native mobil uygulamalarımız da kullanıma sunulacaktır.",
  },
];

// Ana bileşen
export default function CtaSection() {
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const featureListRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featureListRef, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-24 lg:py-32 relative overflow-hidden">
      {/* Desenli arka plan */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.02] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative inline-flex items-center justify-center mb-4"
              >
                <span className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-600/10 dark:from-indigo-400/10 dark:to-teal-400/10 border border-indigo-100 dark:border-indigo-900">
                  <SparklesIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-teal-400">
                    Hemen Başlayın
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
                Dijital Dönüşümünüzü Şimdi Başlatın
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-lg text-gray-600 dark:text-gray-400 max-w-xl"
              >
                Fitness sektöründe rekabette öne geçin. Tek platform üzerinden
                tüm spor salonu, eğitmen ve üye ilişkilerini yönetin, hem
                zamandan hem de maliyetten tasarruf edin.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-wrap gap-1 p-1 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRole(index)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-300 ${
                    selectedRole === index
                      ? "bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/40 dark:to-sky-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{feature.icon}</span>
                    <span>{feature.role}</span>
                  </span>
                </button>
              ))}
            </motion.div>

            <div ref={featureListRef} className="space-y-3">
              {features[selectedRole].items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-r ${features[selectedRole].bgColor} flex items-center justify-center`}
                  >
                    <CheckIcon
                      className={`h-3 w-3 bg-gradient-to-r ${features[selectedRole].color} bg-clip-text text-transparent`}
                    />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{item}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button
                asChild
                size="lg"
                className="group relative shadow-lg bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white border-none overflow-hidden"
              >
                <Link
                  href="/auth?mode=register"
                  className="flex items-center gap-2 relative z-10"
                >
                  Hemen Üye Ol
                  <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="group border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
              >
                <Link href="/products" className="flex items-center gap-2">
                  Tüm Özellikleri İncele
                  <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            {/* Ana kart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 backdrop-blur-sm relative z-10 overflow-hidden">
              {/* Kart içi arkaplan efektleri */}
              <div className="absolute -right-24 -top-24 w-48 h-48 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-70 blur-3xl"></div>
              <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-teal-100 dark:bg-teal-900/20 rounded-full opacity-70 blur-3xl"></div>

              <h3 className="text-xl font-semibold mb-6 relative">
                Sık Sorulan Sorular
              </h3>

              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <AccordionTrigger className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Alt CTA Bölümü */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-5 relative overflow-hidden">
                  {/* Arkaplan desenler */}
                  <div className="absolute inset-0 opacity-20">
                    <svg
                      width="100%"
                      height="100%"
                      className="absolute inset-0"
                    >
                      <defs>
                        <pattern
                          id="smallGrid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-indigo-500/30"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#smallGrid)" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-indigo-700 to-blue-700 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Daha Fazla Sorunuz mu Var?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Uzman ekibimiz tüm sorularınızı yanıtlamak için hazır.
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group bg-white/80 dark:bg-gray-800/80 border-indigo-200 dark:border-indigo-800"
                    >
                      <Link
                        href="/contact"
                        className="flex items-center justify-center gap-2"
                      >
                        <span>Bize Ulaşın</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Arka plan dekoratif elementi */}
            <div className="absolute -z-10 -top-4 -right-4 -bottom-4 -left-4 bg-gradient-to-br from-indigo-100 via-white to-teal-100 dark:from-indigo-900/20 dark:via-transparent dark:to-teal-900/20 rounded-2xl blur-xl opacity-70"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
