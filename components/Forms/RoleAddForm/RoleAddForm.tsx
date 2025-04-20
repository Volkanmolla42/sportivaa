"use client";
import React, { useState } from "react";
import { useAuth} from "@/contexts/AuthContext";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { dataService } from "@/services/dataService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_INFO, SPECIALTY_OPTIONS, CITIES, getAvailableRoles } from "./constants";


export default function RoleAddForm() {
  const { user, roles, refresh } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"Trainer" | "GymManager" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Trainer form fields
  const [experience, setExperience] = useState<string>("1");
  const [specialty, setSpecialty] = useState<string>("");

  // Gym Manager form fields
  const [gymName, setGymName] = useState<string>("");
  const [city, setCity] = useState<string>("");

  // Filter out roles the user already has
  const availableRoles = getAvailableRoles(roles);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole || !user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Call the appropriate service based on the selected role
      if (selectedRole === "Trainer") {
        // Validate trainer fields
        if (!specialty.trim()) {
          throw new Error("Uzmanlık alanı boş olamaz");
        }

        const experienceNum = parseInt(experience, 10);
        if (isNaN(experienceNum) || experienceNum < 0) {
          throw new Error("Deneyim yılı geçerli bir sayı olmalıdır");
        }

        await dataService.createTrainerProfile(user.id, experienceNum, specialty);
      } else if (selectedRole === "GymManager") {
        // Validate gym manager fields
        if (!gymName.trim()) {
          throw new Error("Salon adı boş olamaz");
        }
        if (!city.trim()) {
          throw new Error("Şehir seçmelisiniz");
        }

        // First update the user to be a gym manager
        await dataService.createGymManagerProfile(user.id);

        // Then create a gym with the provided information
        await dataService.createGym({
          name: gymName,
          city: city,
          owner_user_id: user.id
        });
      }

      setSuccess(true);
      // Refresh user roles
      await refresh();

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
  }

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
            Dashboardaposa Dön
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rol Ekle</CardTitle>
        <CardDescription>
          Hesabınıza yeni roller ekleyerek platformdaki yeteneklerinizi genişletin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as "Trainer" | "GymManager")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Eklemek istediğiniz rolü seçin" />
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
          </div>

          {selectedRole && (
            <div className={`p-4 rounded-lg bg-gradient-to-r ${ROLE_INFO[selectedRole].bgClass} text-white`}>
              <div className="flex items-center mb-2">
                {ROLE_INFO[selectedRole].icon}
                <h3 className="ml-2 font-semibold">{ROLE_INFO[selectedRole].label}</h3>
              </div>
              <p className="text-sm mb-2">{ROLE_INFO[selectedRole].description}</p>
              {ROLE_INFO[selectedRole].benefits && (
                <div className="mb-2">
                  <h4 className="font-semibold text-xs mb-1">Avantajlar:</h4>
                  <ul className="list-disc list-inside text-xs">
                    {ROLE_INFO[selectedRole].benefits.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
              {ROLE_INFO[selectedRole].requirements && (
                <div>
                  <h4 className="font-semibold text-xs mb-1">Gereksinimler:</h4>
                  <ul className="list-disc list-inside text-xs">
                    {ROLE_INFO[selectedRole].requirements.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {selectedRole === "Trainer" && (
            <div className="space-y-3 mt-4 p-4 border rounded-lg">
              <h3 className="font-medium">Eğitmen Bilgileri</h3>
              <div className="space-y-2">
                <Label htmlFor="experience">Deneyim (Yıl)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Uzmanlık Alanı</Label>
                <Select
                  value={specialty}
                  onValueChange={setSpecialty}
                  required
                >
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Uzmanlık seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedRole === "GymManager" && (
            <div className="space-y-3 mt-4 p-4 border rounded-lg">
              <h3 className="font-medium">Salon Bilgileri</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Yönetici olacağınız salon için gerekli bilgileri doldurun. Bu bilgiler üyeler tarafından görüntülenecektir.
              </p>
              <div className="space-y-2">
                <Label htmlFor="gymName">Salon Adı</Label>
                <Input
                  id="gymName"
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="Örn: Sportiva Fitness Club"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Şehir</Label>
                <Select
                  value={city}
                  onValueChange={(value) => setCity(value)}
                >
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Şehir seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.sort().map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertTitle>Başarılı</AlertTitle>
              <AlertDescription>
                Rol başarıyla eklendi! Dashboardaposa yönlendiriliyorsunuz...
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isLoading || !selectedRole || success}
            className="w-full"
          >
            {isLoading ? "Ekleniyor..." : "Rolü Ekle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
