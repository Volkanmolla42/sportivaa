"use client";
import React, { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dumbbell, Building2, Info, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { dataService } from "@/services/dataService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Progress } from "@/components/ui/progress";


// Role information mapping
const ROLE_INFO = {
  Trainer: {
    label: "Eğitmen",
    icon: <Dumbbell className="w-5 h-5" />,
    description: "Eğitmen olarak öğrencilerinizi, programlarınızı ve çalışma takvimlerinizi yönetebilirsiniz.",
    bgClass: "from-amber-500 to-orange-500",
    benefits: [
      "Kendi öğrenci listenizi oluşturabilirsiniz",
      "Kişisel antrenman programları hazırlayabilirsiniz",
      "Randevu takvimi yönetimi yapabilirsiniz",
      "Performans takibi ve raporlama yapabilirsiniz"
    ],
    requirements: [
      "Deneyim yılı bilgisi",
      "Uzmanlık alanı",
      "Sertifikalar (isteğe bağlı)"
    ]
  },
  GymManager: {
    label: "Salon Yöneticisi",
    icon: <Building2 className="w-5 h-5" />,
    description: "Salon yöneticisi olarak salonunuzu, üyelerinizi ve eğitmenlerinizi yönetebilirsiniz.",
    bgClass: "from-green-500 to-emerald-500",
    benefits: [
      "Salon üyelerinizi yönetebilirsiniz",
      "Eğitmen ekibi oluşturabilirsiniz",
      "Salon istatistiklerini görebilirsiniz",
      "Etkinlik ve duyurular oluşturabilirsiniz"
    ],
    requirements: [
      "Salon bilgileri",
      "Konum bilgisi"
    ]
  },
};

// Specialty options for trainers
const SPECIALTY_OPTIONS = [
  "Fitness",
  "Pilates",
  "Yoga",
  "Kişisel Antrenörlük",
  "Fonksiyonel Antrenman",
  "Grup Dersleri",
  "Beslenme",
  "Diğer"
];

// Turkish cities list for gym managers
const CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort();

// Define Zod schemas for form validation
const baseSchema = z.object({
  roleType: z.enum(["Trainer", "GymManager"], {
    required_error: "Lütfen bir rol seçin",
  }),
});

const trainerSchema = baseSchema.extend({
  roleType: z.literal("Trainer"),
  experience: z.coerce
    .number({
      required_error: "Deneyim yılı gereklidir",
      invalid_type_error: "Deneyim yılı sayı olmalıdır",
    })
    .min(0, "Deneyim yılı negatif olamaz")
    .max(50, "Deneyim yılı çok yüksek görünüyor"),
  specialty: z
    .string({
      required_error: "Uzmanlık alanı gereklidir",
    })
    .min(2, "Uzmanlık alanı en az 2 karakter olmalıdır")
    .max(100, "Uzmanlık alanı çok uzun"),
});

const gymManagerSchema = baseSchema.extend({
  roleType: z.literal("GymManager"),
  gymName: z
    .string({
      required_error: "Salon adı gereklidir",
    })
    .min(2, "Salon adı en az 2 karakter olmalıdır")
    .max(100, "Salon adı çok uzun"),
  city: z.string({
    required_error: "Şehir seçmelisiniz",
  }),
});

// Create a discriminated union schema
const formSchema = z.discriminatedUnion("roleType", [
  trainerSchema,
  gymManagerSchema,
]);

// Infer TypeScript types from the schema
type FormValues = z.infer<typeof formSchema>;

export default function RoleAddFormEnhanced() {
  const { user, roles, refresh } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Filter out roles the user already has
  const availableRoles = Object.keys(ROLE_INFO).filter(
    (role) => !roles.includes(role as UserRole)
  ) as Array<"Trainer" | "GymManager">;

  // Set up form with React Hook Form and Zod validation
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    // setValue ve reset kullanılmıyor, ama ileride gerekebilir
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      roleType: undefined,
    },
  });

  // Watch the selected role to show appropriate form fields
  const selectedRole = watch("roleType");

  // Update progress based on form completion
  useEffect(() => {
    if (!selectedRole) {
      setProgress(0);
      return;
    }

    // Calculate progress based on filled fields
    let filledFields = 0;
    let totalFields = 1; // roleType is always required

    if (selectedRole === "Trainer") {
      totalFields += 2; // experience and specialty are required
      if (watch("experience") !== undefined) filledFields++;
      if (watch("specialty")) filledFields++;

      // Optional fields contribute less to progress
      totalFields += 0.5;
      totalFields += 0.5;
    } else if (selectedRole === "GymManager") {
      totalFields += 2; // gymName and city are required
      if (watch("gymName")) filledFields++;
      if (watch("city")) filledFields++;

      // GymManager için ek alanlar eklenebilir
    }

    // Add roleType to filled fields if selected
    filledFields++;

    const calculatedProgress = Math.min(100, Math.round((filledFields / totalFields) * 100));
    setProgress(calculatedProgress);
  }, [watch, selectedRole]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Call the appropriate service based on the selected role
      if (data.roleType === "Trainer") {
        await dataService.createTrainerProfile(
          user.id,
          data.experience,
          data.specialty
        );
      } else if (data.roleType === "GymManager") {
        // First update the user to be a gym manager
        await dataService.createGymManagerProfile(user.id);

        // Then create a gym with the provided information
        const gymId = await dataService.createGym({
          name: data.gymName,
          city: data.city,
          owner_user_id: user.id
        });

        // Add the user as a member of their own gym
        await dataService.addUserToGym(user.id, gymId, "owner");
      }

      setSuccess(true);
      // Refresh user roles
      await refresh();

      // Show success state with progress to 100%
      setProgress(100);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "Bir hata oluştu.");
      } else {
        setError("Rol eklenirken bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (availableRoles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rol Ekle</CardTitle>
          <CardDescription>
            Hesabınıza yeni roller ekleyerek platformdaki yeteneklerinizi genişletin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Tüm rollere sahipsiniz</AlertTitle>
            <AlertDescription>
              Şu anda mevcut tüm rollere sahipsiniz. Başka eklenebilecek rol bulunmamaktadır.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Dashboard&apos;a Dön
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle>Rol Ekle</CardTitle>
        <CardDescription>
          Hesabınıza yeni roller ekleyerek platformdaki yeteneklerinizi genişletin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Form tamamlama</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role selection */}
          <div className="space-y-2">
            <Label htmlFor="roleType">Eklemek istediğiniz rolü seçin</Label>
            <Controller
              name="roleType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger id="roleType" className="w-full">
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center">
                          {ROLE_INFO[role]?.icon}
                          <span className="ml-2">{ROLE_INFO[role]?.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roleType && (
              <p className="text-sm text-red-500 mt-1">{errors.roleType.message}</p>
            )}
          </div>

          {/* Role information card */}
          {selectedRole && (
            <div className={`p-4 rounded-lg bg-gradient-to-r ${ROLE_INFO[selectedRole].bgClass} text-white`}>
              <div className="flex items-center mb-2">
                {ROLE_INFO[selectedRole].icon}
                <h3 className="ml-2 font-semibold">{ROLE_INFO[selectedRole].label}</h3>
              </div>
              <p className="text-sm mb-3">{ROLE_INFO[selectedRole].description}</p>

              <div className="space-y-2 mt-3">
                <h4 className="text-sm font-medium">Bu rol ile yapabilecekleriniz:</h4>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  {ROLE_INFO[selectedRole].benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Trainer specific fields */}
          {selectedRole === "Trainer" && (
            <div className="space-y-4 p-4 border rounded-lg border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-lg">Eğitmen Bilgileri</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Eğitmen profiliniz için gerekli bilgileri doldurun. Bu bilgiler üyeler tarafından görüntülenecektir.
              </p>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Deneyim (Yıl) <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      placeholder="Örn: 3"
                      {...field}
                      disabled={isLoading}
                    />
                  )}
                />

              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">
                  Uzmanlık Alanı <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="specialty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="specialty" className="w-full">
                        <SelectValue placeholder="Uzmanlık alanınızı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALTY_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

              </div>





              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">Eğitmen Profili Bilgilendirmesi</p>
                  <p className="mt-1">
                    Eğitmen rolü ekledikten sonra, profil sayfanızdan daha fazla bilgi ekleyebilir ve
                    antrenman programları oluşturabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gym Manager specific fields */}
          {selectedRole === "GymManager" && (
            <div className="space-y-4 p-4 border rounded-lg border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-lg">Salon Bilgileri</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Yönetici olacağınız salon için gerekli bilgileri doldurun. Bu bilgiler üyeler tarafından görüntülenecektir.
              </p>

              <div className="space-y-2">
                <Label htmlFor="gymName">
                  Salon Adı <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="gymName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="gymName"
                      placeholder="Örn: Sportiva Fitness Club"
                      {...field}
                      disabled={isLoading}
                    />
                  )}
                />

              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  Şehir <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="city" className="w-full">
                        <SelectValue placeholder="Şehir seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

              </div>



              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">Salon Yöneticisi Bilgilendirmesi</p>
                  <p className="mt-1">
                    Salon yöneticisi rolü ekledikten sonra, salon sayfanızdan daha fazla bilgi ekleyebilir,
                    üye ve eğitmen yönetimi yapabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error and success messages */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-300">Başarılı</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                Rol başarıyla eklendi! Dashboard&apos;a yönlendiriliyorsunuz...
              </AlertDescription>
            </Alert>
          )}

          {/* Submit button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isLoading || !isValid || success}
              className="w-full"
            >
              {isLoading ? "Ekleniyor..." : "Rolü Ekle"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={isLoading}
              className="w-full"
            >
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
