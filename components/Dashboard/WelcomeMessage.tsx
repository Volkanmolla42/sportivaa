"use client";

import { ReactNode } from "react";

interface WelcomeMessageProps {
  firstName?: string;
  lastName?: string;
  role?: "default" | "member" | "trainer" | "gymmanager";
  children?: ReactNode;
}

export default function WelcomeMessage({
  firstName,
  lastName,
  role = "default",
  children,
}: WelcomeMessageProps) {
  // Boş string kontrolü yerine string uzunluğunu kontrol ediyoruz
  console.log("WelcomeMessage props:", { firstName, lastName, role }); // Debug için

  const hasFirstName =
    firstName && typeof firstName === "string" && firstName.trim().length > 0;
  const hasLastName =
    lastName && typeof lastName === "string" && lastName.trim().length > 0;

  // İsim oluşturma
  let fullName = "Sporcu";
  if (hasFirstName && hasLastName) {
    fullName = `${firstName} ${lastName}`;
  } else if (hasFirstName) {
    fullName = firstName;
  } else if (hasLastName) {
    fullName = lastName;
  }

  // Rol bazlı mesajlar
  const roleMessages = {
    default:
      "Sportiva platformunun kontrol panelinde her şeyi tek yerden yönetebilirsin.",
    member:
      "Üyelik bilgilerinizi, antrenman programlarınızı ve randevularınızı görüntüleyebilirsiniz.",
    trainer:
      "Eğitmen panelinizde öğrencilerinizi, programlarınızı ve çalışma takvimlerinizi yönetebilirsiniz.",
    gymmanager:
      "Salon yöneticisi panelinizde salonunuzu, üyelerinizi ve eğitmenlerinizi yönetebilirsiniz.",
  };

  return (
    <div className="space-y-2">
      <div className="text-lg md:text-xl font-medium">
        Hoş geldin, {fullName}!
      </div>
      {!children && role && (
        <p className="text-slate-600 dark:text-slate-400">
          {roleMessages[role]}
        </p>
      )}
      {children}
    </div>
  );
}
