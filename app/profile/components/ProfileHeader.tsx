"use client";

import { useState, useEffect } from "react";
import { User, Camera, Shield, Award, Dumbbell, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { dataService } from "@/services/dataService";
import { UserRole } from "@/contexts/AuthContext"; 
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; 

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  avatar_url?: string | null; 
}

export default function ProfileHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          router.push("/auth");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('first_name, last_name, avatar_url')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        const userRoles = await dataService.getUserRoles(authData.user.id);

        setUser({
          id: authData.user.id,
          email: authData.user.email ?? "N/A", 
          first_name: profileData?.first_name ?? "",
          last_name: profileData?.last_name ?? "",
          avatar_url: profileData?.avatar_url,
          created_at: new Date(authData.user.created_at).toLocaleDateString("tr-TR"),
        });

        setRoles(userRoles);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case "Member": return "Üye";
      case "Trainer": return "Antrenör";
      case "GymManager": return "Salon Yöneticisi";
      default: return role;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Member": return <User className="h-3.5 w-3.5 mr-1.5" />;
      case "Trainer": return <Dumbbell className="h-3.5 w-3.5 mr-1.5" />;
      case "GymManager": return <Building2 className="h-3.5 w-3.5 mr-1.5" />;
      default: return <Shield className="h-3.5 w-3.5 mr-1.5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <Skeleton className="h-8 w-2/3 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-1/2 mx-auto sm:mx-0" />
              <div className="flex gap-2 mt-4 justify-center sm:justify-start flex-wrap">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-24" />
              </div>
              <Skeleton className="h-4 w-1/3 mx-auto sm:mx-0 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <Card className="w-full overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/70 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative group flex-shrink-0">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 text-4xl border-4 border-white dark:border-slate-800 shadow-lg">
              <AvatarImage src={user.avatar_url ?? undefined} alt={`${user.first_name} ${user.last_name}`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {initials || <User size={48} />}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
              title="Profil fotoğrafını değiştir"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Profil fotoğrafını değiştir</span>
            </Button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm sm:text-base">{user.email}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5">
              {roles.map((role) => (
                <Badge
                  key={role}
                  className={cn(
                    "font-medium flex items-center text-xs sm:text-sm", 
                    {
                      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400": role === "Member",
                      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400": role === "Trainer",
                      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400": role === "GymManager",
                      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700": !["Member", "Trainer", "GymManager"].includes(role) // Fallback/default
                    }
                  )}
                >
                  {getRoleIcon(role)}
                  {getRoleName(role)}
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs sm:text-sm flex items-center gap-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => router.push("/profile/addrole")}
              >
                <Award className="h-3.5 w-3.5" />
                Rol Ekle
              </Button>
            </div>

            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>Üyelik Tarihi: {user.created_at}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
