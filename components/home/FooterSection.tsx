"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Mail, 
  PhoneCall, 
  MapPin, 
  ChevronUpIcon,
  HeartIcon,
  ExternalLinkIcon,
  ArrowRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Footer için veri yapıları
type FooterLinkGroup = {
  title: string;
  links: {
    label: string;
    href: string;
    isExternal?: boolean;
  }[];
};

// Footer menü grupları
const linkGroups: FooterLinkGroup[] = [
  {
    title: "Sportiva",
    links: [
      { label: "Hakkımızda", href: "/about" },
      { label: "Kariyer", href: "/careers" },
      { label: "Basın Odası", href: "/press" },
      { label: "İletişim", href: "/contact" }
    ]
  },
  {
    title: "Ürünler",
    links: [
      { label: "Salon Yönetimi", href: "/products/gym-management" },
      { label: "Eğitmen Araçları", href: "/products/trainer-tools" },
      { label: "Üye Deneyimi", href: "/products/member-experience" },
      { label: "Fiyatlandırma", href: "/pricing" }
    ]
  },
  {
    title: "Kaynaklar",
    links: [
      { label: "Yardım Merkezi", href: "/help" },
      { label: "Blog", href: "/blog" },
      { label: "Eğitimler", href: "/tutorials" },
      { label: "API Dokümantasyonu", href: "/api-docs", isExternal: true }
    ]
  },
  {
    title: "Yasal",
    links: [
      { label: "Kullanım Koşulları", href: "/terms" },
      { label: "Gizlilik Politikası", href: "/privacy" },
      { label: "KVKK", href: "/data-protection" },
      { label: "Çerez Politikası", href: "/cookies" }
    ]
  }
];

// Sosyal medya linkleri
const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/sportiva" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/sportiva" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/sportiva" },
  { icon: Youtube, label: "Youtube", href: "https://youtube.com/sportiva" }
];

// İletişim bilgileri
const contactInfo = [
  { icon: Mail, label: "info@sportiva.com", href: "mailto:info@sportiva.com" },
  { icon: PhoneCall, label: "+90 212 555 1234", href: "tel:+902125551234" },
  { icon: MapPin, label: "İstanbul, Türkiye", href: "https://maps.google.com/?q=İstanbul+Türkiye" }
];

// Ana bileşen
export default function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer 
      className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Desenli arka plan */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* Konum belirteçleri */}
      <div className="absolute top-10 left-20 w-40 h-40 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-10 right-20 w-40 h-40 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl opacity-60"></div>
      
      <div className="container mx-auto px-4">
        {/* Üst Bölüm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16">
          {/* Logo ve Firma Bilgisi */}
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              <Link 
                href="/" 
                className="group flex items-center gap-2 text-2xl font-bold"
              >
                <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#3b82f6_50%,#a855f7_100%)] opacity-20"></span>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-950 text-lg">
                    <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-teal-400 font-bold">S</span>
                  </div>
                </span>
                <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-teal-400">
                  Sportiva
                </span>
              </Link>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
              Sportiva, spor salonları, eğitmenler ve üyeler için dijital dönüşüm platformu. 
              Tek hesapla çoklu rol yönetimi, antrenman takibi ve randevu sistemiyle sporda yeni nesil deneyim.
            </p>
            
            {/* Sosyal Medya */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex space-x-3 mb-8 items-center"
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Link
                      href={social.href}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* İletişim Bilgileri */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                const isExternal = contact.href.startsWith('http');
                
                return (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Link
                      href={contact.href}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 group"
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors duration-300">
                        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                      </span>
                      <span className="text-sm">{contact.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Bülten Abone Butonu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="pt-4"
              >
                <Link 
                  href="/newsletter" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <span>Bültenimize Abone Olun</span>
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <ArrowRightIcon className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Footer Menüleri */}
          {linkGroups.map((group, groupIndex) => (
            <motion.div 
              key={groupIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (groupIndex + 1) }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="absolute -left-2 top-0 w-px h-10 bg-gradient-to-b from-indigo-200 to-transparent dark:from-indigo-800 dark:to-transparent opacity-60"></div>
              
              <h3 className="font-semibold mb-6 text-gray-900 dark:text-gray-100">{group.title}</h3>
              
              <ul className="space-y-4">
                {group.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Link 
                      href={link.href}
                      className={`flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors`}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                    >
                      <span>{link.label}</span>
                      {link.isExternal && <ExternalLinkIcon className="ml-1 h-3 w-3" />}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Alt Bölüm - Telif hakları */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center mb-4 sm:mb-0">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Sportiva. Tüm hakları saklıdır.
            </p>
            <span className="flex items-center ml-3 text-gray-500 dark:text-gray-500 text-sm">
              <HeartIcon className="h-3 w-3 text-red-500 mr-1" />
              <span>Türkiye&apos;de geliştirildi</span>
            </span>
          </div>
          
          <Button 
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="group flex items-center gap-2 text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600/20 dark:hover:border-indigo-400/20 transition-colors"
          >
            <span>Yukarı Çık</span>
            <ChevronUpIcon className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
