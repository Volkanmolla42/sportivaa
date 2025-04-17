"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Context veri tipi
type AuthContextType = {
  userId: string | null;
  isLoading: boolean;
  error: string | null;
};

// Başlangıç değeri
const initialState: AuthContextType = {
  userId: null,
  isLoading: true,
  error: null
};

// Context oluşturma
const AuthContext = createContext<AuthContextType>(initialState);

// Hook
export const useAuth = () => useContext(AuthContext);

// Provider bileşeni
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextType>(initialState);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setState({
            userId: null,
            isLoading: false,
            error: error.message
          });
          return;
        }
        
        setState({
          userId: data.session?.user?.id || null,
          isLoading: false,
          error: null
        });
      } catch (err) {
        setState({ 
          userId: null, 
          isLoading: false, 
          error: err instanceof Error ? err.message : "Bilinmeyen hata" 
        });
      }
    };

    // Oturumu kontrol et
    checkSession();

    // Oturum değişikliklerini dinle
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState({
        userId: session?.user?.id || null,
        isLoading: false,
        error: null
      });
    });

    // Cleanup
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}
