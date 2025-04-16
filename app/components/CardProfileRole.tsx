"use client";

import { useEffect, useState } from "react";
import { getUserRoles,getUserName, updateUserName } from "@/lib/profileApi";
import TrainerRegisterForm from "@/app/components/TrainerRegisterForm";
import GymManagerRegisterForm from "@/app/components/GymManagerRegisterForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CardProfileRoleProps {
  userId: string;
}

const ROLE_LABELS: Record<string, string> = {
  member: "Üye",
  trainer: "Eğitmen",
  gymmanager: "Salon Yöneticisi",
  Member: "Üye",
  Trainer: "Eğitmen",
  GymManager: "Salon Yöneticisi",
};

const DASHBOARD_LINKS: Record<string, { href: string; label: string }> = {
  Member: { href: "/dashboard/member", label: "Üye Paneli" },
  Trainer: { href: "/dashboard/trainer", label: "Eğitmen Paneli" },
  GymManager: { href: "/dashboard/gymmanager", label: "Salon Yöneticisi Paneli" },
};



export default function CardProfileRole({ userId }: CardProfileRoleProps) {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<{ first_name: string; last_name: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const router = useRouter();
  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [showGymManagerForm, setShowGymManagerForm] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const userRoles = await getUserRoles(userId);
      setRoles(userRoles);
      const name = await getUserName(userId);
      setUserName(name);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleNameSave() {
    setIsLoading(true);
    try {
      await updateUserName(userId, editFirstName, editLastName);
      setUserName({ first_name: editFirstName, last_name: editLastName });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="w-full text-center py-4">Roller yükleniyor...</div>;
  }

  if (showTrainerForm) {
    return <TrainerRegisterForm userId={userId} onComplete={() => { setShowTrainerForm(false); fetchAll(); }} />;
  }

  if (showGymManagerForm) {
    return <GymManagerRegisterForm userId={userId} onComplete={() => { setShowGymManagerForm(false); fetchAll(); }} />;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="text-sm font-semibold mb-1">Profil Bilgileri:</div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <input
              className="input input-sm border rounded px-2 py-1"
              value={editFirstName}
              onChange={e => setEditFirstName(e.target.value)}
              placeholder="Ad"
            />
            <input
              className="input input-sm border rounded px-2 py-1"
              value={editLastName}
              onChange={e => setEditLastName(e.target.value)}
              placeholder="Soyad"
            />
            <button
              className="px-2 py-1 rounded bg-primary text-white text-xs"
              onClick={handleNameSave}
              disabled={isLoading}
            >Kaydet</button>
            <button
              className="px-2 py-1 rounded border text-xs"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >İptal</button>
          </>
        ) : (
          <>
            <span className="font-medium text-base">
              {userName?.first_name || "-"} {userName?.last_name || ""}
            </span>
            <button
              className="px-2 py-1 rounded border text-xs ml-2"
              onClick={() => {
                setEditFirstName(userName?.first_name || "");
                setEditLastName(userName?.last_name || "");
                setIsEditing(true);
              }}
            >Düzenle</button>
          </>
        )}
      </div>
      <div className="text-sm font-semibold mb-1">Sahip olduğunuz roller:</div>
      <div className="flex gap-2 flex-wrap">
        {roles.map((role) => (
          <span
            key={role}
            className="px-4 py-2 rounded border transition text-sm font-medium border-primary dark:border-primary"
          >
            {ROLE_LABELS[role] || role}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {roles.map((role) => {
          const dash = DASHBOARD_LINKS[role];
          return dash ? (
            <Link
              key={role}
              href={dash.href}
              className="block w-full px-4 py-2 rounded bg-primary text-white text-center font-medium hover:bg-blue-700 transition dark:bg-primary dark:hover:bg-blue-800"
            >
              {dash.label}
            </Link>
          ) : null;
        })}
      </div>
      <div className="flex gap-2 mt-2">
        {!roles.includes("Trainer") && (
          <button
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 transition text-xs"
            onClick={() => setShowTrainerForm(true)}
            disabled={isLoading}
          >
            Eğitmen Rolü Ekle
          </button>
        )}
        {!roles.includes("GymManager") && (
          <button
            className="px-3 py-1 rounded bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 transition text-xs"
            onClick={() => setShowGymManagerForm(true)}
            disabled={isLoading}
          >
            Salon Yöneticisi Rolü Ekle
          </button>
        )}
      </div>
    </div>
  );
}
