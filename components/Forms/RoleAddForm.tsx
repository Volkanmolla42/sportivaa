"use client";
import React, { useState } from "react";
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
import {Dumbbell, Building2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { dataService } from "@/services/dataService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Role information mapping
const ROLE_INFO = {
  Trainer: {
    label: "Eğitmen",
    icon: <Dumbbell className="w-5 h-5" />,
    description: "Eğitmen olarak öğrencilerinizi, programlarınızı ve çalışma takvimlerinizi yönetebilirsiniz.",
    bgClass: "from-amber-500 to-orange-500",
  },
  GymManager: {
    label: "Salon Yöneticisi",
    icon: <Building2 className="w-5 h-5" />,
    description: "Salon yöneticisi olarak salonunuzu, üyelerinizi ve eğitmenlerinizi yönetebilirsiniz.",
    bgClass: "from-green-500 to-emerald-500",
  },
};

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

  // Filter out roles the user already has
  const availableRoles = Object.keys(ROLE_INFO).filter(
    (role) => !roles.includes(role as UserRole)
  ) as Array<"Trainer" | "GymManager">;

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
        await dataService.createGymManagerProfile(user.id);
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
              <p className="text-sm">{ROLE_INFO[selectedRole].description}</p>
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
                <Input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Örn: Fitness, Yoga, Pilates"
                  required
                />
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
