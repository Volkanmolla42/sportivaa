"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserName, getUserGyms, getGymsByManager, getTrainerProfile } from "@/lib/profileApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  Dumbbell, 
  Users, 
  Building2, 
  TrendingUp, 
  BarChart,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="roles">Rollerim</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <StatsSection userData={userData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressPanel />
            <RecentActivitiesPanel />
          </div>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6">
          <RolesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Hoşgeldin başlığı bileşeni
function WelcomeHeader({ userName }: { userName: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Hoş geldin, {userName}!
      </h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
        Sportiva platformunun kontrol panelinde her şeyi tek yerden yönetebilirsin. 
        Salonlar, antrenmanlar ve daha fazlasına hızlıca erişebilirsin.
      </p>
    </div>
  );
}

// İstatistikler bölümü
function StatsSection({ userData }: { userData: UserData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        title="Antrenör Deneyimi"
        value={userData.trainerProfile?.experience ? userData.trainerProfile.experience.toString() : "0"}
        suffix="yıl"
        icon={<Dumbbell className="w-4 h-4" />}
        description="Eğitmenlik tecrübesi"
        trend="up"
      />
      
      <StatsCard 
        title="Aktif Randevular"
        value="2"
        icon={<Calendar className="w-4 h-4" />}
        description="Yaklaşan randevularınız"
        trend="up"
      />
    </div>
  );
}

// İlerleme paneli
function ProgressPanel() {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Haftalık İlerleme</CardTitle>
        <CardDescription>Hedeflerinize doğru ilerleyişiniz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Antrenman Tamamlama</span>
            <span className="text-slate-500 dark:text-slate-400">7/10</span>
          </div>
          <Progress value={70} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Kalori Hedefi</span>
            <span className="text-slate-500 dark:text-slate-400">2100/3000</span>
          </div>
          <Progress value={70} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Protein Alımı</span>
            <span className="text-slate-500 dark:text-slate-400">120/150g</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full gap-1 group" asChild>
          <Link href="/dashboard/stats">
            Tüm İstatistikleri Görüntüle
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Son aktiviteler paneli
function RecentActivitiesPanel() {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Son Aktiviteler</CardTitle>
        <CardDescription>Son 7 gün içindeki etkinlikleriniz</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ActivityItem 
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            title="Antrenmana Katıldınız"
            description="Salonda 60 dakikalık güç antrenmanı"
            time="2 saat önce"
          />
          
          <ActivityItem 
            icon={<Users className="h-4 w-4 text-blue-500" />}
            title="Yeni Üye"
            description="Salonunuza yeni bir üye katıldı"
            time="Dün"
          />
          
          <ActivityItem 
            icon={<Clock className="h-4 w-4 text-amber-500" />}
            title="Randevu Onaylandı"
            description="23 Nisan Salı, 15:00 - 16:00"
            time="2 gün önce"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full gap-1 group" asChild>
          <Link href="/dashboard/activities">
            Tüm Aktiviteleri Görüntüle
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Aktivite öğesi
function ActivityItem({ 
  icon, 
  title, 
  description, 
  time 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  time: string 
}) {
  return (
    <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
      <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
        {icon}
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-medium text-slate-900 dark:text-slate-100">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{description}</p>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
        {time}
      </div>
    </div>
  );
}

// Roller bölümü
function RolesSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RoleCard 
        title="Üye Paneli"
        description="Üyelik bilgilerinizi, antrenman programlarınızı ve randevularınızı görüntüleyin."
        icon={<Users className="w-5 h-5" />}
        href="/dashboard/member"
        bgClass="from-blue-500 to-cyan-500"
        iconClass="bg-blue-500"
        buttonText="Üye Paneline Git"
      />
      
      <RoleCard 
        title="Eğitmen Paneli"
        description="Öğrencilerinizi, programlarınızı ve çalışma takvimlerinizi yönetin."
        icon={<Dumbbell className="w-5 h-5" />}
        href="/dashboard/trainer"
        bgClass="from-amber-500 to-orange-500"
        iconClass="bg-amber-500"
        buttonText="Eğitmen Paneline Git"
      />
      
      <RoleCard 
        title="Salon Yöneticisi"
        description="Spor salonunuzu, üyelerinizi ve eğitmenlerinizi yönetin."
        icon={<Building2 className="w-5 h-5" />}
        href="/dashboard/gymmanager"
        bgClass="from-emerald-500 to-green-500"
        iconClass="bg-emerald-500"
        buttonText="Yönetici Paneline Git"
      />
    </div>
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
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
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
  const trendIcon = {
    up: <TrendingUp className="h-3 w-3" />,
    down: <TrendingUp className="h-3 w-3 transform rotate-180" />,
    neutral: <BarChart className="h-3 w-3" />
  }[trend];
  
  const trendColor = {
    up: "text-emerald-500",
    down: "text-red-500",
    neutral: "text-slate-500"
  }[trend];
    
  return (
    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
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
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {value}
          {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
        </div>
        <p className={`text-xs mt-1 flex items-center gap-1 ${trendColor}`}>
          {trendIcon}
          <span>{description}</span>
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
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-slate-200 dark:border-slate-800">
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
