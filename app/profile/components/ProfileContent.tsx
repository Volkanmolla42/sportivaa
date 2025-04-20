"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { dataService } from "@/services/dataService";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dumbbell, MapPin, Building2, Loader2, Settings } from "lucide-react";

// Define interfaces (Consider moving to a central types file)
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null; // Allow null
}

interface Gym {
  id: string;
  name: string;
  city: string;
}

export default function ProfileContent() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition(); // Use useTransition for better UX
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userGyms, setUserGyms] = useState<Gym[]>([]);
  const [formData, setFormData] = useState<Pick<UserProfile, 'first_name' | 'last_name' | 'phone'>>({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          // Handle error or redirect, perhaps in ProfileHeader already handled?
          return;
        }

        const userId = authData.user.id;

        // Fetch user profile
        const basicProfile = await dataService.getUserName(userId);
        if (basicProfile) {
          setUserProfile({ ...basicProfile, phone: undefined });
          // Reset form with fetched data
          setFormData({
            first_name: basicProfile.first_name || "",
            last_name: basicProfile.last_name || "",
            phone: "",
          });
        }

        // Fetch user's gyms
        const { data: gymUsers, error: gymUsersError } = await supabase
          .from("gym_users")
          .select(`
            gym_id,
            gyms (
              id,
              name,
              city
            )
          `)
          .eq("user_id", userId);

        if (gymUsersError) throw gymUsersError;

        if (gymUsers) {
          // Define the expected type for each element in gymUsers based on the Supabase query
          type GymUserWithGym = {
            gym_id: string;
            gyms: {
              id: string;
              name: string;
              city: string;
            }[] | null; // Correctly type gyms as an array or null
          };

          // Extract and flatten gym data, ensuring type compatibility
          const userGyms = gymUsers.map((gu: GymUserWithGym) => ({
            id: gu.gyms?.[0]?.id ?? '', // Access first element of gyms array
            name: gu.gyms?.[0]?.name ?? 'Bilinmeyen Salon', // Access first element
            city: gu.gyms?.[0]?.city ?? 'Bilinmeyen Şehir', // Access first element
          })) as Gym[]; // Assert final type after mapping
          setUserGyms(userGyms);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Veri Yükleme Hatası",
          description: "Profil bilgileri yüklenirken bir sorun oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]); // Add toast to dependency array

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    startSaving(async () => {
      try {
        // Use dataService or direct Supabase call
        const { error } = await supabase
          .from('users')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone || null, // Store empty string as null
          })
          .eq('id', userProfile.id);

        if (error) throw error;

        toast({
          title: "Başarılı ",
          description: "Profil bilgileriniz başarıyla güncellendi.",
        });

        // Update local state immediately for better UX
        setUserProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
          };
        });

      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Güncelleme Hatası",
          description: "Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-10 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    // Wrap entire Tabs component in a Card for consistent styling
    <Card className="w-full border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/70 backdrop-blur-sm overflow-hidden">
      <Tabs defaultValue="profile" className="w-full">
        {/* Refined TabsList styling */}
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800/50 h-12 rounded-none border-b border-slate-200 dark:border-slate-800">
          <TabsTrigger value="profile" className="text-sm font-medium flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-none h-full">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Hesap Ayarları</span>
            <span className="sm:hidden">Hesap</span>
          </TabsTrigger>
          <TabsTrigger value="memberships" className="text-sm font-medium flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-none h-full">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Spor Salonlarım</span>
            <span className="sm:hidden">Salonlar</span>
          </TabsTrigger>
          <TabsTrigger value="workouts" className="text-sm font-medium flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-sm rounded-none h-full">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Antrenman Geçmişi</span>
            <span className="sm:hidden">Geçmiş</span>
          </TabsTrigger>
        </TabsList>

        {/* Hesap Ayarları Tab */}
        <TabsContent value="profile" className="p-6">
          {/* Use Card for structure within the tab */}
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl">Hesap Bilgileri</CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi buradan güncelleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Ad</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Adınız"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Soyad</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Soyadınız"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile?.email || ""}
                      disabled
                      className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      E-posta adresinizi değiştiremezsiniz.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon Numarası (Opsiyonel)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone ?? ""}
                      onChange={handleInputChange}
                      placeholder="(5xx) xxx xx xx"
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spor Salonlarım Tab */}
        <TabsContent value="memberships" className="p-6">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl">Üye Olduğum Spor Salonları</CardTitle>
              <CardDescription>
                Aktif spor salonu üyelikleriniz burada listelenir.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {userGyms.length === 0 ? (
                <Alert variant="default" className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                  <Building2 className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
                  <AlertTitle>Spor Salonu Bulunmuyor</AlertTitle>
                  <AlertDescription>
                    Henüz bir spor salonuna üye değilsiniz.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userGyms.map((gym) => (
                    <Card key={gym.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                          {gym.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                          <MapPin className="h-3.5 w-3.5" />
                          
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                        {/* Additional gym details can be added here */}
                        {/* TODO: Add membership details like join date if available */}
                      </CardContent>
                      {/* Optional Footer for actions like 'View Gym' */}
                      {/* <CardFooter className="pt-3">
                        <Button variant="outline" size="sm">Salonu Görüntüle</Button>
                      </CardFooter> */}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Antrenman Geçmişi Tab - Placeholder */}
        <TabsContent value="workouts" className="p-6">
           <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl">Antrenman Geçmişi</CardTitle>
              <CardDescription>
                Tamamladığınız antrenmanlar ve ilerlemeniz burada gösterilecektir.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <Alert variant="default" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300">
                    <Dumbbell className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                    <AlertTitle>Yakında!</AlertTitle>
                    <AlertDescription>
                        Bu özellik şu anda geliştirilme aşamasındadır. Antrenmanlarınızı yakında buradan takip edebileceksiniz.
                    </AlertDescription>
                </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
