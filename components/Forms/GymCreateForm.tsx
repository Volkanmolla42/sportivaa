"use client";
import React, { useState } from "react";
import { createGym } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type GymCreateFormProps = {
  ownerUserId: string;
  onCreated?: (gymId: string) => void;
};

export function GymCreateForm({ ownerUserId, onCreated }: GymCreateFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const gymId = await createGym({ name, address, phone, owner_user_id: ownerUserId });
      setName("");
      setAddress("");
      setPhone("");
      if (onCreated) onCreated(gymId);
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
        placeholder="Salon Adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Adres"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <Input
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      {error && <div className="text-destructive text-sm">{error}</div>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Oluşturuluyor..." : "Salon Oluştur"}
      </Button>
    </form>
  );
}
