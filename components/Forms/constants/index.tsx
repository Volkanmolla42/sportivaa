import { Dumbbell, Building2 } from "lucide-react";
import { UserRole } from "@/contexts/AuthContext";
import React, { ReactNode } from "react";

/**
 * Role information mapping with descriptions, icons, and requirements
 */
export interface RoleInfo {
  label: string;
  icon: ReactNode;
  description: string;
  bgClass: string;
  benefits: string[];
  requirements: string[];
}

export const ROLE_INFO: Record<string, RoleInfo> = {
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

/**
 * Specialty options for trainers 
 */
export const SPECIALTY_OPTIONS = [
  "Fitness",
  "Pilates",
  "Yoga",
  "Kişisel Antrenörlük",
  "Fonksiyonel Antrenman",
  "Grup Dersleri",
  "Beslenme",
  "Diğer"
];

/**
 * Turkish cities list for gym managers
 */
export const CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort();

/**
 * Helper function to filter available roles
 */
export const getAvailableRoles = (userRoles: UserRole[]): Array<"Trainer" | "GymManager"> => {
  return Object.keys(ROLE_INFO).filter(
    (role) => !userRoles.includes(role as UserRole)
  ) as Array<"Trainer" | "GymManager">;
};

/**
 * Form step labels for progress tracking
 */
export const FORM_STEPS = {
  ROLE_SELECTION: "role-selection",
  ROLE_DETAILS: "role-details",
  CONFIRMATION: "confirmation",
};
