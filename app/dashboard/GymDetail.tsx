"use client";
import { useEffect, useState } from "react";
import { getGymMembers, addMemberToGym } from "@/lib/profileApi";
import EmailAutocomplete from "../components/EmailAutocomplete";

interface GymDetailProps {
  gym: { id: string; name: string; city: string };
  onBack: () => void;
}

export default function GymDetail({ gym, onBack }: GymDetailProps) {
  const [members, setMembers] = useState<{ id: string; first_name: string; last_name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      const data = await getGymMembers(gym.id);
      setMembers(data);
      setLoading(false);
    }
    fetchMembers();
  }, [gym.id]);

  return (
    <div className="p-4">
      <button onClick={onBack} className="mb-4 text-primary underline">← Geri</button>
      <h2 className="text-xl font-bold mb-2">{gym.name} - {gym.city}</h2>
      <div className="mb-4">Salon üyeleri:</div>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : members.length === 0 ? (
        <div className="text-muted-foreground">Henüz üye yok.</div>
      ) : (
        <ul className="space-y-1">
          {members.map((m) => (
            <li key={m.id} className="border rounded p-2 bg-muted flex justify-between items-center">
              <span>{m.first_name} {m.last_name} ({m.email})</span>
            </li>
          ))}
        </ul>
      )}
      {/* Üye ekleme formu */}
      <GymMemberAddForm gymId={gym.id} onAdded={() => {
        setLoading(true);
        getGymMembers(gym.id).then(setMembers).finally(() => setLoading(false));
      }} />
    </div>
  );
}

// Üye ekleme formu
function GymMemberAddForm({ gymId, onAdded }: { gymId: string; onAdded: () => void }) {
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; first_name: string; last_name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addMemberToGym({ gymId, email });
      setSuccess("Üye eklendi!");
      setEmail("");
      setSelectedUser(null);
      onAdded();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 relative">
      <label className="font-medium">Üye Ekle (E-posta):</label>
      <EmailAutocomplete
        value={email}
        onChange={v => {
          setEmail(v);
          setSelectedUser(null);
        }}
        onSelect={user => {
          setEmail(user.email);
          setSelectedUser(user);
        }}
      />
      {selectedUser && (
        <div className="text-xs text-muted-foreground mt-1">
          Seçilen: {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
        </div>
      )}
      <button
        type="submit"
        className="px-4 py-2 rounded bg-primary text-white font-semibold mt-1"
        disabled={loading || !email}
      >
        {loading ? "Ekleniyor..." : "Üye Ekle"}
      </button>
      {error && <div className="text-destructive text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </form>
  );
}
