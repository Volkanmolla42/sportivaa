"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { useSupabaseRecord, useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import WelcomeMessage from "@/components/Dashboard/WelcomeMessage";
import DashboardMember from "@/components/Dashboard/DashboardMember";
import DashboardTrainer from "@/components/Dashboard/DashboardTrainer";
import DashboardGymManager from "@/components/Dashboard/DashboardGymManager";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AnimatedContainer,
  AnimatedGroup,
} from "@/components/ui/animated-container";
import { Loading, LoadingOverlay } from "@/components/ui/loading";
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
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

// Type definitions
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

function DashboardContent() {
  const { user } = useAuth();
  const { selectedRole } = useRole();
  const { toast } = useToast();
  const userId = user?.id;

  // Sadece ilk render'da çalışacak log
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && isInitialRender.current) {
      console.log("DashboardContent: Initial state", {
        hasUser: !!user,
        userId: user?.id ? `${user.id.substring(0, 8)}...` : null,
        selectedRole,
      });
      isInitialRender.current = false;
    }
  }, []);

  // Fetch user data with the custom hook
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useSupabaseRecord<{ first_name?: string; last_name?: string }>(
    "users",
    "id",
    userId || ""
  );

  // Fetch user gyms with the custom hook
  const { data: memberGyms, isLoading: isLoadingMemberGyms } = useSupabaseQuery<
    MemberGym[]
  >(() =>
    supabase
      .from("gym_users")
      .select("gym_id, gyms(name, city)")
      .eq("user_id", userId || "")
  );

  // Fetch gyms managed by the user
  const { data: ownedGyms, isLoading: isLoadingOwnedGyms } = useSupabaseQuery<
    OwnedGym[]
  >(() =>
    supabase
      .from("gyms")
      .select("id, name, city")
      .eq("owner_user_id", userId || "")
  );

  // Fetch trainer profile - maybeSingle() kullanıyoruz, böylece kayıt yoksa hata oluşmaz
  const { data: trainerProfile, isLoading: isLoadingTrainerProfile } =
    useSupabaseQuery<TrainerProfileData>(() =>
      supabase
        .from("trainers")
        .select("experience, specialty")
        .eq("user_id", userId || "")
        .maybeSingle()
    );

  // Show error toast when there's an error
  React.useEffect(() => {
    if (userError) {
      toast({
        variant: "destructive",
        title: "Hata",
        description:
          userError.message || "Veriler yüklenirken bir hata oluştu.",
      });
    }
  }, [userError, toast]);

  // Loading state
  const isLoading =
    !userId ||
    isLoadingUser ||
    isLoadingMemberGyms ||
    isLoadingOwnedGyms ||
    isLoadingTrainerProfile;

  // Log sadece development modunda ve yükleme durumu değiştiğinde çalışsın
  const prevLoadingState = useRef(isLoading);
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      prevLoadingState.current !== isLoading
    ) {
      console.log("DashboardContent: Loading state changed to", {
        isLoading,
        userId: !!userId,
        isLoadingUser,
        isLoadingMemberGyms,
        isLoadingOwnedGyms,
        isLoadingTrainerProfile,
      });
      prevLoadingState.current = isLoading;
    }
  }, [isLoading]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (userError) {
    console.error("DashboardContent: Error detected", userError);
    return <ErrorDisplay message={userError.message} />;
  }

  // Render role-specific dashboard based on selected role
  if (selectedRole) {
    switch (selectedRole) {
      case "Member":
        return <DashboardMember userId={userId} />;
      case "Trainer":
        return <DashboardTrainer userId={userId} />;
      case "GymManager":
        return <DashboardGymManager userId={userId} />;
    }
  }

  // Extract user name
  const firstName = userData?.first_name || "";
  const lastName = userData?.last_name || "";

  return (
    <AnimatedContainer variant="fade-in" duration={300} className="space-y-8">
      <AnimatedContainer variant="fade-up" delay={100}>
        <WelcomeHeader firstName={firstName} lastName={lastName} />
      </AnimatedContainer>

      <Tabs defaultValue="overview" className="space-y-6">
        <AnimatedContainer variant="fade-up" delay={200}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="roles">Rollerim</TabsTrigger>
          </TabsList>
        </AnimatedContainer>

        <TabsContent value="overview" className="space-y-6">
          <AnimatedGroup variant="fade-up" staggerDelay={100}>
            <StatsSection
              memberGyms={memberGyms || []}
              ownedGyms={ownedGyms || []}
              trainerProfile={trainerProfile}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgressPanel />
              <RecentActivitiesPanel />
            </div>
          </AnimatedGroup>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <AnimatedGroup variant="fade-up" staggerDelay={100}>
            <RolesSection />
          </AnimatedGroup>
        </TabsContent>
      </Tabs>
    </AnimatedContainer>
  );
}

// Welcome header component
const WelcomeHeader = memo(
  ({ firstName, lastName }: { firstName: string; lastName: string }) => {
    return (
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          <WelcomeMessage
            firstName={firstName}
            lastName={lastName}
            role="default"
          >
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mt-2 text-base font-normal">
              Sportiva platformunun kontrol panelinde her şeyi tek yerden
              yönetebilirsin. Salonlar, antrenmanlar ve daha fazlasına hızlıca
              erişebilirsin.
            </p>
          </WelcomeMessage>
        </h1>
      </div>
    );
  }
);

WelcomeHeader.displayName = "WelcomeHeader";

// Stats section
const StatsSection = memo(
  ({
    memberGyms,
    ownedGyms,
    trainerProfile,
  }: {
    memberGyms: MemberGym[];
    ownedGyms: OwnedGym[];
    trainerProfile: TrainerProfileData;
  }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Üye Olduğun Salon"
          value={memberGyms.length.toString()}
          icon={<Building2 className="w-4 h-4" />}
          description="Kayıtlı olduğun salon sayısı"
          trend="neutral"
        />

        <StatsCard
          title="Yönettiğin Salon"
          value={ownedGyms.length.toString()}
          icon={<Users className="w-4 h-4" />}
          description="Yönetici olduğun salon sayısı"
          trend="neutral"
        />

        <StatsCard
          title="Antrenör Deneyimi"
          value={
            trainerProfile?.experience
              ? trainerProfile.experience.toString()
              : "0"
          }
          suffix="yıl"
          icon={<Dumbbell className="w-4 h-4" />}
          description={
            trainerProfile
              ? "Eğitmenlik tecrübesi"
              : "Henüz antrenör değilsiniz"
          }
          trend={trainerProfile ? "up" : "neutral"}
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
);

StatsSection.displayName = "StatsSection";

// Progress panel
const ProgressPanel = memo(() => {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Haftalık İlerleme
        </CardTitle>
        <CardDescription>Hedeflerinize doğru ilerleyişiniz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Antrenman Tamamlama
            </span>
            <span className="text-slate-500 dark:text-slate-400">7/10</span>
          </div>
          <Progress value={70} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Kalori Hedefi
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              2100/3000
            </span>
          </div>
          <Progress value={70} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Protein Alımı
            </span>
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
});

ProgressPanel.displayName = "ProgressPanel";

// Recent activities panel
const RecentActivitiesPanel = memo(() => {
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
});

RecentActivitiesPanel.displayName = "RecentActivitiesPanel";

// Activity item
const ActivityItem = memo(
  ({
    icon,
    title,
    description,
    time,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    time: string;
  }) => {
    return (
      <AnimatedContainer variant="fade-left" duration={300}>
        <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200 hover:shadow-sm">
          <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform hover:scale-110">
            {icon}
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {title}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {description}
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
            {time}
          </div>
        </div>
      </AnimatedContainer>
    );
  }
);

ActivityItem.displayName = "ActivityItem";

// Roles section
const RolesSection = memo(() => {
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
});

RolesSection.displayName = "RolesSection";

// Error display component
const ErrorDisplay = memo(({ message }: { message: string }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Kısa bir gecikme ekleyerek yükleme göstergesini gösterelim
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      {isRetrying ? (
        <div className="flex items-center gap-2">
          <Loading size="sm" />
          <span>Yenileniyor...</span>
        </div>
      ) : (
        <Button onClick={handleRetry}>Yeniden Dene</Button>
      )}
    </div>
  );
});

ErrorDisplay.displayName = "ErrorDisplay";

// Loading skeleton
export function DashboardSkeleton() {
  // Yükleme zamanını izlemek için timestamp - sadece development modunda ve ilk render'da
  const hasLogged = useRef(false);

  // useEffect içinde state değişikliği yapmadığımızdan emin olalım
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !hasLogged.current) {
      hasLogged.current = true;
      const startTime = new Date();
      console.log(
        "DashboardSkeleton: Loading started at",
        startTime.toISOString()
      );

      return () => {
        const endTime = new Date();
        const loadingDuration = endTime.getTime() - startTime.getTime();
        console.log(
          `DashboardSkeleton: Loading ended after ${loadingDuration}ms at`,
          endTime.toISOString()
        );
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Loading overlay */}
      <LoadingOverlay text="Sportiva dashboard yükleniyor" />

      {/* Background skeleton */}
      <div className="space-y-8 opacity-20">
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
    </div>
  );
}

// Stats Card
const StatsCard = memo(
  ({
    title,
    value,
    suffix = "",
    icon,
    description,
    trend = "up",
  }: {
    title: string;
    value: string;
    suffix?: string;
    icon: React.ReactNode;
    description: string;
    trend?: "up" | "down" | "neutral";
  }) => {
    const trendIcon = {
      up: <TrendingUp className="h-3 w-3" />,
      down: <TrendingUp className="h-3 w-3 transform rotate-180" />,
      neutral: <BarChart className="h-3 w-3" />,
    }[trend];

    const trendColor = {
      up: "text-emerald-500",
      down: "text-red-500",
      neutral: "text-slate-500",
    }[trend];

    return (
      <AnimatedContainer variant="fade-up" className="h-full">
        <Card className="border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {title}
              </CardTitle>
              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full transition-transform hover:scale-110">
                {icon}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {value}
              {suffix && (
                <span className="text-sm font-normal ml-1">{suffix}</span>
              )}
            </div>
            <p className={`text-xs mt-1 flex items-center gap-1 ${trendColor}`}>
              {trendIcon}
              <span>{description}</span>
            </p>
          </CardContent>
        </Card>
      </AnimatedContainer>
    );
  }
);

StatsCard.displayName = "StatsCard";

// Role Card
const RoleCard = memo(
  ({
    title,
    description,
    icon,
    href,
    bgClass,
    iconClass,
    buttonText,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    bgClass: string;
    iconClass: string;
    buttonText: string;
  }) => {
    return (
      <AnimatedContainer variant="zoom-in" className="h-full">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200 dark:border-slate-800 h-full transform hover:-translate-y-1">
          <div className={`h-2 bg-gradient-to-r ${bgClass}`}></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${iconClass} text-white transform transition-transform hover:scale-110`}
              >
                {icon}
              </div>
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`h-24 bg-gradient-to-r ${bgClass} opacity-10 rounded-lg flex items-center justify-center`}
            >
              {icon}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full gap-1 group transition-all duration-200"
            >
              <Link href={href}>
                {buttonText}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </AnimatedContainer>
    );
  }
);

RoleCard.displayName = "RoleCard";

export default memo(DashboardContent);
