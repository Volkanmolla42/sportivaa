"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserName, getUserGyms, getGymsByManager, getTrainerProfile } from "@/lib/profileApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, Calendar, Dumbbell, Users, Building2, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tip tanımlamaları
type MemberGym = {
  gym_id: string;
  gym_name: string;
  gym_city: string;
};

type OwnedGym = {
  id: string;
  name: string;
  city: string;
};

type TrainerProfileData = {
  experience: number;
  specialty: string;
} | null;

type UserData = {
  firstName: string;
  lastName: string;
  memberGyms: MemberGym[];
  ownedGyms: OwnedGym[];
  trainerProfile: TrainerProfileData;
  loading: boolean;
  error: string | null;
};

// Ana bileşen
export default function DashboardPage() {
  const { userId, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    memberGyms: [],
    ownedGyms: [],
    trainerProfile: null,
    loading: true,
    error: null
  });

  // Verileri getir
  useEffect(() => {
    if (!userId) return;
    
    const fetchUserData = async () => {
      try {
        setUserData(prev => ({ ...prev, loading: true, error: null }));
        
        const [nameData, memberGyms, ownedGyms, trainerProfile] = await Promise.all([
          getUserName(userId),
          getUserGyms(userId),
          getGymsByManager(userId),
          getTrainerProfile(userId)
        ]);
        
        setUserData({
          firstName: nameData.first_name || "",
          lastName: nameData.last_name || "",
          memberGyms,
          ownedGyms,
          trainerProfile,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Kullanıcı verileri alınırken hata:", error);
        setUserData(prev => ({ 
          ...prev, 
          loading: false, 
          error: "Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin." 
        }));
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  // Yükleme durumu
  if (authLoading || userData.loading) {
    return <DashboardSkeleton />;
  }

  // Hata durumu
  if (userData.error) {
    return <ErrorDisplay message={userData.error} />;
  }
  
  // Kullanıcı adını oluştur
  const userName = userData.firstName && userData.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : "Sporcu";
  
  return (
    <div className="space-y-8">
      <WelcomeHeader userName={userName} />
      <StatsSection userData={userData} />
      <RolesSection />
      <ActivityCard />
    </div>
  );
}

// Hoşgeldin başlığı bileşeni
function WelcomeHeader({ userName }: { userName: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Hoş geldin, {userName}!</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Sportiva platformunda kontrol paneline erişim sağladın. 
        Yandaki menüden farklı rollere erişim sağlayabilirsin.
      </p>
    </div>
  );
}

// İstatistikler bölümü
function StatsSection({ userData }: { userData: UserData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Üye Olduğun Salon"
        value={userData.memberGyms.length.toString()}
        icon={<Building2 className="w-4 h-4" />}
        description="Kayıtlı olduğun salon sayısı"
        trend="neutral"
      />
      
      <StatsCard 
        title="Yönettiğin Salon"
        value={userData.ownedGyms.length.toString()}
        icon={<Users className="w-4 h-4" />}
        description="Yönetici olduğun salon sayısı"
        trend="neutral"
      />
      
      <StatsCard 
        title="Deneyim"
        value={userData.trainerProfile?.experience?.toString() || "0"}
        suffix="yıl"
        icon={<Medal className="w-4 h-4" />}
        description="Eğitmen deneyimi"
        trend="neutral"
      />
      
      <StatsCard 
        title="Etkinlikler"
        value="0"
        icon={<Calendar className="w-4 h-4" />}
        description="Planlanan randevular"
        trend="neutral"
      />
    </div>
  );
}

// Roller bölümü
function RolesSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RoleCard 
        title="Üye Paneli"
        description="Üyelik bilgilerinizi, antreman programlarınızı ve randevularınızı yönetin."
        icon={<Users className="w-5 h-5" />}
        href="/dashboard/member"
        bgClass="from-blue-400 to-blue-600"
        iconClass="bg-blue-500"
        buttonText="Üye Paneline Git"
      />
      
      <RoleCard 
        title="Eğitmen Paneli"
        description="Öğrencilerinizi, antrenman programlarını ve randevularınızı yönetin."
        icon={<Dumbbell className="w-5 h-5" />}
        href="/dashboard/trainer"
        bgClass="from-emerald-400 to-emerald-600"
        iconClass="bg-emerald-500"
        buttonText="Eğitmen Paneline Git"
      />
      
      <RoleCard 
        title="Salon Yönetici Paneli"
        description="Spor salonunuzu, üyelerinizi, eğitmenlerinizi ve abonelik planlarını yönetin."
        icon={<Building2 className="w-5 h-5" />}
        href="/dashboard/gymmanager"
        bgClass="from-violet-400 to-violet-600"
        iconClass="bg-violet-500"
        buttonText="Yönetici Paneline Git"
      />
    </div>
  );
}

// Aktivite Kartı
function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Aktiviteler</CardTitle>
        <CardDescription>
          Platformda yapılan son işlemler ve bildirimler
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-2 border-teal-500 pl-4 py-1">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sportiva platformuna hoş geldiniz! Burada spor salonu, eğitmen ve üye olarak tüm işlemlerinizi yönetebilirsiniz.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Bugün
            </p>
          </div>
          
          <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4 py-1">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Profil bilgilerinizi ve rollerinizi güncelleyerek platform özelliklerini daha etkin kullanabilirsiniz.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              1 gün önce
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hata gösterim bileşeni
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-4 rounded-lg mb-4">
        <p>{message}</p>
      </div>
      <Button onClick={() => window.location.reload()}>
        Yeniden Dene
      </Button>
    </div>
  );
}

// Yükleme iskeletleri
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-2/3 mb-2" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
      
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

// İstatistik Kartı
function StatsCard({ 
  title, 
  value, 
  suffix = "", 
  icon, 
  description, 
  trend = "up" 
}: { 
  title: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
  description: string;
  trend?: "up" | "down" | "neutral";
}) {
  const trendColor = {
    up: "text-emerald-500",
    down: "text-red-500",
    neutral: "text-slate-500"
  }[trend];
    
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </CardTitle>
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
          <span className={trendColor}>{description}</span>
        </p>
      </CardContent>
    </Card>
  );
}

// Rol Kartı
function RoleCard({ 
  title, 
  description, 
  icon, 
  href, 
  bgClass, 
  iconClass,
  buttonText
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  bgClass: string;
  iconClass: string;
  buttonText: string;
}) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className={`h-2 bg-gradient-to-r ${bgClass}`}></div>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconClass} text-white`}>
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`h-24 bg-gradient-to-r ${bgClass} opacity-10 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full gap-1 group transition-all duration-200">
          <Link href={href}>
            {buttonText}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
