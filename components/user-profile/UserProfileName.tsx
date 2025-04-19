"use client";
import { useEffect, useState } from "react";
import { getUserName } from "@/contexts/AuthContext";

interface UserProfileNameProps {
  userId: string;
}

export function UserProfileName({ userId }: UserProfileNameProps) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getUserName(userId)
      .then((data) => {
        if (isMounted) {
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Kullanıcı adı alınamadı:", err);
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
  return <span>{firstName + " " + lastName || "Kullanıcı"}</span>;
}
