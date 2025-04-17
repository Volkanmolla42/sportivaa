"use client";

import { useEffect, useState } from "react";
import { getUserRoles, getUserName, updateUserName } from "@/lib/profileApi";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TrainerRegisterForm from "../Forms/TrainerRegisterForm";
import GymManagerRegisterForm from "../Forms/GymManagerRegisterForm";

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
  const [state, setState] = useState<{
    isLoading: boolean;
    mode: 'view' | 'editName' | 'addTrainer' | 'addGymManager';
    userName: { first_name: string; last_name: string } | null;
    roles: string[];
    firstName: string;
    lastName: string;
  }>({
    isLoading: true,
    mode: 'view',
    userName: null,
    roles: [],
    firstName: '',
    lastName: '',
  });
  const router = useRouter();

  // Profil veri yükleme fonksiyonu
  const fetchData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    const roles = await getUserRoles(userId);
    const name = await getUserName(userId);
    setState({
      isLoading: false,
      mode: 'view',
      userName: name,
      roles,
      firstName: name.first_name,
      lastName: name.last_name,
    });
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const { isLoading, mode, userName, roles, firstName, lastName } = state;

  if (isLoading) {
    return <div className="p-4 text-center"><Skeleton className="h-4 w-32 mx-auto" /></div>;
  }

  if (mode === 'editName') {
    return (
      <div className="bg-card p-6 rounded-lg shadow flex flex-col gap-4">
        <h3 className="font-semibold">İsmini Düzenle</h3>
        <input
          className="border rounded px-2 py-1"
          value={firstName}
          onChange={e => setState(prev => ({ ...prev, firstName: e.target.value }))}
          placeholder="Ad"
        />
        <input
          className="border rounded px-2 py-1"
          value={lastName}
          onChange={e => setState(prev => ({ ...prev, lastName: e.target.value }))}
          placeholder="Soyad"
        />
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              setState(prev => ({ ...prev, isLoading: true }));
              await updateUserName(userId, firstName, lastName);
              setState(prev => ({
                ...prev,
                isLoading: false,
                mode: 'view',
                userName: { first_name: firstName, last_name: lastName },
              }));
            }}
          >
            Kaydet
          </Button>
          <Button variant="outline" onClick={() => setState(prev => ({ ...prev, mode: 'view' }))}>
            İptal
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'addTrainer') {
    return <TrainerRegisterForm userId={userId} onComplete={fetchData} />;
  }
  if (mode === 'addGymManager') {
    return <GymManagerRegisterForm userId={userId} onComplete={fetchData} />;
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Ad Soyad:</div>
          <div>{userName?.first_name} {userName?.last_name}</div>
        </div>
        <Button variant="ghost" onClick={() => setState(prev => ({ ...prev, mode: 'editName' }))}>
          Düzenle
        </Button>
      </div>
      <div>
        <div className="font-medium mb-2">Roller</div>
        <div className="flex gap-2 flex-wrap">
          {roles.map(role => (
            <span key={role} className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">
              {ROLE_LABELS[role] || role}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button onClick={() => setState(prev => ({ ...prev, mode: 'addTrainer' }))} disabled={roles.includes('Trainer')}>
          Eğitmen Rolü Ekle
        </Button>
        <Button onClick={() => setState(prev => ({ ...prev, mode: 'addGymManager' }))} disabled={roles.includes('GymManager')}>
          Salon Yöneticisi Rolü Ekle
        </Button>
      </div>
      <div className="pt-4 border-t">
        {roles.map(role => {
          const dash = DASHBOARD_LINKS[role];
          return dash ? (
            <Button key={role} className="w-full" onClick={() => router.push(dash.href)}>
              {dash.label}
            </Button>
          ) : null;
        })}
      </div>
    </div>
  );
}
