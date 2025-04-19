"use client";

import { ReactNode, memo } from "react";
import { UserRole } from "@/contexts/AuthContext";

interface WelcomeMessageProps {
  firstName?: string;
  lastName?: string;
  role?: UserRole | "default";
  children?: ReactNode;
}

// Role-based messages mapping
const ROLE_MESSAGES = {
  default:
    "Sportiva platformunun kontrol panelinde her şeyi tek yerden yönetebilirsin.",
  Member:
    "Üyelik bilgilerinizi, antrenman programlarınızı ve randevularınızı görüntüleyebilirsiniz.",
  Trainer:
    "Eğitmen panelinizde öğrencilerinizi, programlarınızı ve çalışma takvimlerinizi yönetebilirsiniz.",
  GymManager:
    "Salon yöneticisi panelinizde salonunuzu, üyelerinizi ve eğitmenlerinizi yönetebilirsiniz.",
};

function WelcomeMessage({
  firstName,
  lastName,
  role = "default",
  children,
}: WelcomeMessageProps) {
  // Validate string inputs
  const hasFirstName =
    firstName && typeof firstName === "string" && firstName.trim().length > 0;
  const hasLastName =
    lastName && typeof lastName === "string" && lastName.trim().length > 0;

  // Create full name with fallback
  let fullName = "Sporcu";
  if (hasFirstName && hasLastName) {
    fullName = `${firstName} ${lastName}`;
  } else if (hasFirstName) {
    fullName = firstName;
  } else if (hasLastName) {
    fullName = lastName;
  }

  return (
    <div className="space-y-2">
      <div className="text-lg md:text-xl font-medium">
        Hoş geldin, {fullName}!
      </div>
      {!children && role && (
        <p className="text-slate-600 dark:text-slate-400">
          {ROLE_MESSAGES[role] || ROLE_MESSAGES.default}
        </p>
      )}
      {children}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(WelcomeMessage);
