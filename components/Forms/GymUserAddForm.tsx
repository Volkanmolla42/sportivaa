"use client";
import React, { useState } from "react";
import { addUserToGym } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

export type GymUserAddFormProps = {
  gymId: string;
  addedBy: string;
};

export default function GymUserAddForm({ gymId, addedBy }: GymUserAddFormProps) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"Member" | "Trainer">("Member");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await addUserToGym({ user_id: userId, gym_id: gymId, role, added_by: addedBy });
      setUserId("");
      setRole("Member");
      setSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "Bir hata oluştu.");
      } else {
        setError("Bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input
        placeholder="Kullanıcı ID'si"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />
      <Select value={role} onValueChange={(value: string) => setRole(value as "Member" | "Trainer")}>
        <SelectItem value="Member">Üye</SelectItem>
        <SelectItem value="Trainer">Antrenör</SelectItem>
      </Select>
      {error && <div className="text-destructive text-sm">{error}</div>}
      {success && <div className="text-success text-sm">Kullanıcı başarıyla eklendi.</div>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Ekleniyor..." : "Kullanıcıyı Ekle"}
      </Button>
    </form>
  );
}
