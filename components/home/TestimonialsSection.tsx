"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon, QuoteIcon, StarIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Görüş veren kişi veri tipleri
type TestimonialRole = "Üye" | "Eğitmen" | "Salon Sahibi";
type Testimonial = {
  id: number;
  name: string;
  role: TestimonialRole;
  image: string;
  content: string;
  rating: number;
};

// Örnek görüşler
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    role: "Salon Sahibi",
    image: "/images/testimonials/person1.jpg",
    content: "Sportiva ile üye yönetimi inanılmaz kolaylaştı. Artık kağıt işleriyle uğraşmak yerine asıl işimize, yani üyelerimize kaliteli hizmet sunmaya odaklanabiliyoruz. Üye kayıtları, randevu takibi ve ödemeler tek bir platformda.",
    rating: 5
  },
  {
    id: 2,
    name: "Ayşe Kaya",
    role: "Üye",
    image: "/images/testimonials/person2.jpg",
    content: "Birden fazla salonda antrenman yapıyorum ve Sportiva tüm spor geçmişimi tek bir yerde görmemi sağlıyor. Antrenörümle randevu almak çok kolay ve ilerleme grafiklerim sayesinde gelişimimi net bir şekilde görebiliyorum.",
    rating: 5
  },
  {
    id: 3,
    name: "Mehmet Demir",
    role: "Eğitmen",
    image: "/images/testimonials/person3.jpg",
    content: "Sportiva benim için bir devrim oldu. Artık takvimimi kolayca yönetebiliyor, üyelerle randevularımı planlayabiliyor ve performans verilerini takip edebiliyorum. Profesyonel profilim sayesinde yeni üyelere de kolayca ulaşabiliyorum.",
    rating: 4
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    role: "Üye",
    image: "/images/testimonials/person4.jpg",
    content: "Farklı salonlarda çalıştığım zamanlar oldu ve Sportiva sayesinde tüm antrenman geçmişimi kaybetmeden takip edebildim. Eğitmenlerin profillerini inceleyip bana en uygun olanı seçmek çok kolay.",
    rating: 5
  },
  {
    id: 5,
    name: "Burak Öztürk",
    role: "Salon Sahibi",
    image: "/images/testimonials/person5.jpg",
    content: "Salonumuzdaki üye memnuniyeti Sportiva sayesinde %30 arttı. Dijital dönüşüm bizim için kolay olmadı ama Sportiva'nın kullanıcı dostu arayüzü sayesinde hem çalışanlarımız hem de üyelerimiz hızla adapte oldu.",
    rating: 4
  }
];

// Renk temalarını role göre belirleme fonksiyonu
function getRoleColors(role: TestimonialRole) {
  switch (role) {
    case "Üye":
      return {
        bg: "from-blue-600/10 via-blue-600/5 to-transparent",
        border: "border-blue-200 dark:border-blue-900/30",
        accent: "text-blue-600 dark:text-blue-400",
        icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      };
    case "Eğitmen":
      return {
        bg: "from-indigo-600/10 via-indigo-600/5 to-transparent",
        border: "border-indigo-200 dark:border-indigo-900/30",
        accent: "text-indigo-600 dark:text-indigo-400",
        icon: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
      };
    case "Salon Sahibi":
      return {
        bg: "from-teal-600/10 via-teal-600/5 to-transparent",
        border: "border-teal-200 dark:border-teal-900/30",
        accent: "text-teal-600 dark:text-teal-400",
        icon: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
      };
    default:
      return {
        bg: "from-gray-600/10 via-gray-600/5 to-transparent",
        border: "border-gray-200 dark:border-gray-800",
        accent: "text-gray-700 dark:text-gray-300",
        icon: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      };
  }
}

// Ana bileşen
export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  
  // Mouse paralax efekti için
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMouseX(x);
        setMouseY(y);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  // Görüntülenecek üç görüşü hesapla
  const displayedTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ];

  return (
    <section ref={containerRef} className="w-full py-24 md:py-32 relative overflow-hidden isolate">
      {/* Dekoratif arkaplan */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-white/30 dark:from-gray-900 dark:to-gray-900/30 pointer-events-none"></div>
      
      <div 
        className="absolute w-full h-full"
        style={{
          background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 60%)`,
          pointerEvents: 'none'
        }}
      ></div>
      
      <div className="absolute -bottom-48 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob"></div>
      <div className="absolute -top-48 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative inline-flex items-center justify-center mb-4"
          >
            <span className="relative z-10 inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/10 to-blue-600/10 dark:from-indigo-400/10 dark:to-blue-400/10 border border-indigo-100 dark:border-indigo-900">
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
                Kullanıcı Deneyimleri
              </span>
            </span>
            <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/50 blur-xl opacity-50 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-700 dark:from-indigo-300 dark:via-blue-300 dark:to-sky-300 bg-clip-text text-transparent leading-tight"
          >
            Kullanıcılarımız Ne Diyor?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Binlerce kullanıcı, Sportiva ile spor deneyimlerini nasıl dönüştürdüklerini ve fitness hedeflerine daha kolay ulaştıklarını anlatıyor.
          </motion.p>
        </div>
        
        {/* Kontrol butonları - Mobil */}
        <div className="flex justify-center gap-4 mb-8 sm:mb-12 md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevTestimonial}
            className="rounded-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950"
          >
            <ArrowLeftIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextTestimonial}
            className="rounded-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950"
          >
            <ArrowRightIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </Button>
        </div>
        
        {/* Görüşler - Masaüstü düzeni */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {displayedTestimonials.map((testimonial, index) => {
            // Efektler için merkez uzaklığı hesapla (1 orta, 0 en dışta)
            const isCentered = index === 1;
            return (
              <TestimonialCard3D 
                key={`${testimonial.id}-${index}`} 
                testimonial={testimonial} 
                index={index}
                isCentered={isCentered}
              />
            );
          })}
          
          {/* Kontrol butonları - Masaüstü */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 hidden md:block">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial}
              className="rounded-full h-10 w-10 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950"
            >
              <ArrowLeftIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </Button>
          </div>
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className="rounded-full h-10 w-10 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950"
            >
              <ArrowRightIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </Button>
          </div>
        </div>
        
        {/* Görüşler - Mobil düzeni (tek görüş) */}
        <div className="md:hidden">
          <TestimonialCard3D
            testimonial={displayedTestimonials[0]} 
            index={0}
            isCentered={true}
          />
        </div>
        
        {/* Tüm görüşlere git button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg" className="group border-indigo-200 dark:border-indigo-800">
            <Link href="/testimonials" className="flex items-center gap-2">
              <span>Tüm Kullanıcı Görüşleri</span>
              <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// 3D kart efekti için yardımcı bileşen
function TestimonialCard3D({ 
  testimonial, 
  index, 
  isCentered
}: { 
  testimonial: Testimonial, 
  index: number,
  isCentered: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D rotasyon efektleri
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  // 3D dönüşüm değerleri
  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Kart merkezine göre fare pozisyonu (-0.5 ile 0.5 arasında)
    const xValue = (e.clientX - rect.left) / width - 0.5; 
    const yValue = (e.clientY - rect.top) / height - 0.5;
    
    // -100 ile 100 arasında değerlere ölçeklendir
    x.set(xValue * 200); 
    y.set(yValue * 200);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };
  
  // Görüş kartının renk şemasını belirle
  const colors = getRoleColors(testimonial.role);
  
  // Gecikme hesapla
  const delay = 0.1 * index;
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        scale: isCentered ? 1.05 : 1,
        zIndex: isCentered ? 10 : 0
      }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border ${colors.border} flex flex-col h-full will-change-transform transition-all ${
        isCentered ? 'ring-1 ring-indigo-200 dark:ring-indigo-800' : ''
      }`}
    >
      {/* Kart içi arkaplan efekti */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="mb-4 text-blue-500 dark:text-blue-400">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${colors.icon}`}>
          <QuoteIcon className="h-5 w-5" />
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow relative z-10">
        &quot;{testimonial.content}&quot;
      </p>
      
      <div className="flex items-center gap-3 mt-auto relative z-10">
        <div 
          className="relative w-12 h-12 rounded-full overflow-hidden"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 dark:from-indigo-900 dark:to-blue-900"></div>
          {testimonial.image && (
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        
        <div>
          <h4 className={`font-medium ${colors.accent}`}>{testimonial.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.role}
          </p>
        </div>
        
        <div className="ml-auto flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`h-4 w-4 ${
                i < testimonial.rating 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300 dark:text-gray-700"
              }`} 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
