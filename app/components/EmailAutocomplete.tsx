"use client";
import { useState, useEffect} from "react";
import { Input } from "@/components/ui/input";
import { getUsersByEmailPrefix } from "@/lib/profileApi";

interface EmailAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (user: { id: string; email: string; first_name: string; last_name: string }) => void;
}

export default function EmailAutocomplete({ value, onChange, onSelect }: EmailAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<{ id: string; email: string; first_name: string; last_name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    // Debounce için timeout
    const handler = setTimeout(() => {
      getUsersByEmailPrefix(value).then((users) => {
        setSuggestions(users);
        setLoading(false);
      });
    }, 400);
    // Temizle
    return () => {
      clearTimeout(handler);
      setLoading(false);
    };
  }, [value]);

  return (
    <div className="relative">
      <Input
        type="email"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="E-posta adresi"
        autoComplete="off"
      />
      {loading && <div className="absolute left-0 mt-1 text-xs text-muted-foreground">Yükleniyor...</div>}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-card border rounded shadow z-10 max-h-48 overflow-auto">
          {suggestions.map(user => (
            <li
              key={user.id}
              className="px-3 py-2 hover:bg-primary/10 cursor-pointer flex justify-between"
              onClick={() => onSelect(user)}
            >
              <span>{user.email}</span>
              <span className="text-xs text-muted-foreground ml-2">{user.first_name} {user.last_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
