"use client";
import { useEffect, useState } from "react";
import { getUserName } from "@/contexts/AuthContext";

interface UserProfileNameProps {
  userId: string;
}

export function UserProfileName({ userId }: UserProfileNameProps) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getUserName(userId)
      .then((data) => {
        if (isMounted) {
          setName(data.first_name);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Kullanıcı adı alınamadı");
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) return <span className="animate-pulse text-slate-400">Yükleniyor...</span>;
  if (error) return <span className="text-red-500">{error}</span>;
  return <span>{name || "Kullanıcı"}</span>;
}
