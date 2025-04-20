"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Dumbbell, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { dataService } from "@/services/dataService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Combobox } from "@/components/ui/Combobox";

// --- Turkish Cities Constant ---
const turkishCities = [
  { label: "Adana", value: "Adana" }, { label: "Adıyaman", value: "Adıyaman" },
  { label: "Afyonkarahisar", value: "Afyonkarahisar" }, { label: "Ağrı", value: "Ağrı" },
  { label: "Amasya", value: "Amasya" }, { label: "Ankara", value: "Ankara" },
  { label: "Antalya", value: "Antalya" }, { label: "Artvin", value: "Artvin" },
  { label: "Aydın", value: "Aydın" }, { label: "Balıkesir", value: "Balıkesir" },
  { label: "Bilecik", value: "Bilecik" }, { label: "Bingöl", value: "Bingöl" },
  { label: "Bitlis", value: "Bitlis" }, { label: "Bolu", value: "Bolu" },
  { label: "Burdur", value: "Burdur" }, { label: "Bursa", value: "Bursa" },
  { label: "Çanakkale", value: "Çanakkale" }, { label: "Çankırı", value: "Çankırı" },
  { label: "Çorum", value: "Çorum" }, { label: "Denizli", value: "Denizli" },
  { label: "Diyarbakır", value: "Diyarbakır" }, { label: "Edirne", value: "Edirne" },
  { label: "Elazığ", value: "Elazığ" }, { label: "Erzincan", value: "Erzincan" },
  { label: "Erzurum", value: "Erzurum" }, { label: "Eskişehir", value: "Eskişehir" },
  { label: "Gaziantep", value: "Gaziantep" }, { label: "Giresun", value: "Giresun" },
  { label: "Gümüşhane", value: "Gümüşhane" }, { label: "Hakkâri", value: "Hakkâri" },
  { label: "Hatay", value: "Hatay" }, { label: "Isparta", value: "Isparta" },
  { label: "Mersin", value: "Mersin" }, { label: "İstanbul", value: "İstanbul" },
  { label: "İzmir", value: "İzmir" }, { label: "Kars", value: "Kars" },
  { label: "Kastamonu", value: "Kastamonu" }, { label: "Kayseri", value: "Kayseri" },
  { label: "Kırklareli", value: "Kırklareli" }, { label: "Kırşehir", value: "Kırşehir" },
  { label: "Kocaeli", value: "Kocaeli" }, { label: "Konya", value: "Konya" },
  { label: "Kütahya", value: "Kütahya" }, { label: "Malatya", value: "Malatya" },
  { label: "Manisa", value: "Manisa" }, { label: "Kahramanmaraş", value: "Kahramanmaraş" },
  { label: "Mardin", value: "Mardin" }, { label: "Muğla", value: "Muğla" },
  { label: "Muş", value: "Muş" }, { label: "Nevşehir", value: "Nevşehir" },
  { label: "Niğde", value: "Niğde" }, { label: "Ordu", value: "Ordu" },
  { label: "Rize", value: "Rize" }, { label: "Sakarya", value: "Sakarya" },
  { label: "Samsun", value: "Samsun" }, { label: "Siirt", value: "Siirt" },
  { label: "Sinop", value: "Sinop" }, { label: "Sivas", value: "Sivas" },
  { label: "Tekirdağ", value: "Tekirdağ" }, { label: "Tokat", value: "Tokat" },
  { label: "Trabzon", value: "Trabzon" }, { label: "Tunceli", value: "Tunceli" },
  { label: "Şanlıurfa", value: "Şanlıurfa" }, { label: "Uşak", value: "Uşak" },
  { label: "Van", value: "Van" }, { label: "Yozgat", value: "Yozgat" },
  { label: "Zonguldak", value: "Zonguldak" }, { label: "Aksaray", value: "Aksaray" },
  { label: "Bayburt", value: "Bayburt" }, { label: "Karaman", value: "Karaman" },
  { label: "Kırıkkale", value: "Kırıkkale" }, { label: "Batman", value: "Batman" },
  { label: "Şırnak", value: "Şırnak" }, { label: "Bartın", value: "Bartın" },
  { label: "Ardahan", value: "Ardahan" }, { label: "Iğdır", value: "Iğdır" },
  { label: "Yalova", value: "Yalova" }, { label: "Karabük", value: "Karabük" },
  { label: "Kilis", value: "Kilis" }, { label: "Osmaniye", value: "Osmaniye" },
  { label: "Düzce", value: "Düzce" },
] as const;

const cityValues = turkishCities.map(city => city.value) as [string, ...string[]];

// --- Zod Schemas --- 

const trainerFormSchema = z.object({
  experience: z.coerce.number().min(0, "Deneyim 0'dan küçük olamaz."),
  specialty: z.string().min(3, "Uzmanlık alanı en az 3 karakter olmalıdır.").max(100),
});

const gymManagerFormSchema = z.object({
  gymName: z.string().min(2, "Salon adı en az 2 karakter olmalıdır.").max(50),
  gymCity: z.enum(cityValues, {
    required_error: "Şehir seçimi zorunludur.",
    invalid_type_error: "Geçersiz şehir seçimi.",
  }),
});

// Combined schema for validation based on selected role
const combinedSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("Trainer") }).merge(trainerFormSchema),
  z.object({ role: z.literal("GymManager") }).merge(gymManagerFormSchema),
]);

type CombinedFormValues = z.infer<typeof combinedSchema>;

// --- Component --- 

export default function AddRoleForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, startTransition] = useTransition(); 
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState<"Trainer" | "GymManager" | null>(null);

  // Fetch user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUser({ id: data.user.id });
      } else {
        router.push('/auth');
      }
    };
    getUser();
  }, [router]);

  // Initialize the form
  const form = useForm<CombinedFormValues>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      role: undefined, // Let the radio group handle initial state
      // Trainer defaults (only relevant if Trainer selected)
      experience: 0,
      specialty: "",
      // Gym Manager defaults (only relevant if GymManager selected)
      gymName: "",
      gymCity: "",
    },
  });

  // Watch the selected role to conditionally render forms
  const watchedRole = form.watch("role");

  useEffect(() => {
    setSelectedRole(watchedRole);
  }, [watchedRole]);

  // --- Submission Handler --- 

  const onSubmit = (values: CombinedFormValues) => {
    if (!currentUser) {
      toast({
        title: "Hata",
        description: "Kullanıcı oturumu bulunamadı.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        if (values.role === "Trainer") {
          // --- Trainer Path --- 
          await dataService.createTrainerProfile(
            currentUser.id,
            values.experience,
            values.specialty
          );
          toast({
            title: "Antrenör Rolü Eklendi ",
            description: "Başarıyla antrenör olarak kaydoldunuz.",
          });

        } else if (values.role === "GymManager") {
          // --- Gym Manager Path --- 
          // 1. Create the Gym
          await dataService.createGym({
            name: values.gymName,
            city: values.gymCity,
            owner_user_id: currentUser.id,
          });

          // 2. Assign GymManager role (Updates the users table)
          // Assuming createGymManagerProfile updates the user's 'is_gymmanager' flag
          await dataService.createGymManagerProfile(currentUser.id);

          // Optionally, add the user to the gym_users table as the owner/manager?
          // await dataService.addUserToGym(currentUser.id, newGymId, 'Owner'); // If needed

          toast({
            title: "Salon Yöneticisi Rolü Eklendi ",
            description: "Başarıyla salon yöneticisi olarak kaydoldunuz.",
          });
        }
        
        router.push("/dashboard"); // Redirect to dashboard page after success
        router.refresh(); // Refresh server components

      } catch (error) {
        console.error("Rol ekleme hatası:", error);
        toast({
          title: "Hata",
          description: "Rol eklenirken bir sorun oluştu. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
    });
  };

  // --- Render --- 

  return (
    <Card className="w-full max-w-2xl mx-auto border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/70 backdrop-blur-sm">
      <CardHeader>
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri
        </Button>
        <CardTitle className="text-center text-2xl pt-8">Yeni Rol Ekle</CardTitle>
        <CardDescription className="text-center">
          Platformda hangi rolde yer almak istediğinizi seçin.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-base font-semibold">Rol Seçimi</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                           <RadioGroupItem value="Trainer" id="trainer" className="sr-only" />
                        </FormControl>
                         <Label
                            htmlFor="trainer"
                            className={`flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 ${
                              field.value === 'Trainer' ? 'border-primary ring-2 ring-primary' : ''
                            }`}
                          >
                             <span className="mb-2 text-2xl"><Dumbbell className="h-6 w-6" /></span>
                            <span className="font-semibold">Trainer</span>
                            <span className="text-xs text-muted-foreground mt-1 text-center">
                                Sporculara rehberlik et, programlar oluştur.
                            </span>
                          </Label>
                      </FormItem>

                       <FormItem>
                         <FormControl>
                            <RadioGroupItem value="GymManager" id="gymManager" className="sr-only" />
                         </FormControl>
                         <Label
                            htmlFor="gymManager"
                            className={`flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 ${
                              field.value === 'GymManager' ? 'border-primary ring-2 ring-primary' : ''
                            }`}
                          >
                            <span className="mb-2 text-2xl"><Building2 className="h-6 w-6" /></span>
                            <span className="font-semibold">Spor Salonu Yöneticisi</span>
                             <span className="text-xs text-muted-foreground mt-1 text-center">
                                Spor salonunu yönet, üyeleri ve ekibi koordine et.
                            </span>
                          </Label>
                       </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedRole === "Trainer" && (
              <div className="space-y-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-800/30 animate-in fade-in-0 duration-500">
                 <h3 className="text-lg font-medium border-b pb-2 mb-4">Trainer Bilgileri</h3>
                 <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deneyim (Yıl)</FormLabel>
                        <FormControl>
                          <Input
                            type="number" 
                            min="0"
                            placeholder="Örn: 5"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Kaç yıldır antrenörlük yapıyorsunuz?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uzmanlık Alanı</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Örn: Vücut geliştirme, Fonksiyonel antrenman, Yoga..."
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Hangi alanlarda uzmanlaştınız?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            )}

            {selectedRole === "GymManager" && (
              <div className="space-y-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-800/30 animate-in fade-in-0 duration-500">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">Yeni Spor Salonu Bilgileri</h3>
                <p className="text-sm text-muted-foreground mb-4"> Yönetici olacağınız yeni spor salonunun bilgilerini girin.</p>
                <FormField
                  control={form.control}
                  name="gymCity"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Şehir *</FormLabel>
                      <Combobox
                        options={[...turkishCities]}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Şehir Seçin..."
                        searchPlaceholder="Şehir Ara..."
                        notFoundText="Şehir bulunamadı."
                        disabled={isSubmitting}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gymName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salon Adı *</FormLabel>
                      <FormControl>
                        <Input placeholder="Örn: Sportiva Merkez" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </div>
            )}

            <CardFooter className="flex justify-end p-0 pt-6">
              <Button type="submit" disabled={isSubmitting || !selectedRole} className="w-full sm:w-auto">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Rol Ekleniyor..." : (selectedRole ? `${selectedRole === 'Trainer' ? 'Trainer Profili Oluştur' : 'Salon ve Yönetici Rolü Oluştur'}` : 'Rol Seçin')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
