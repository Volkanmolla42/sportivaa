"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { AuthUser } from "@/types/supabase";
import { getUserProfile, type UserData } from "@/lib/profileApi";

// Context veri tipi
type AuthContextType = {
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  user: AuthUser | null; // Supabase auth user objesi (types/supabase'den)
  userData: UserData | null; // Uygulama kullanıcı bilgileri (veritabanında saklanan)
};

// Başlangıç değeri
const initialState: AuthContextType = {
  userId: null,
  isLoading: true,
  error: null,
  user: null,
  userData: null
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
            error: error.message,
            user: null,
            userData: null
          });
          return;
        }
        
        // Kullanıcı ID'si varsa profil bilgilerini getir
        const userId = data.session?.user?.id;
        if (userId) {
          // profileApi'den getUserProfile fonksiyonunu kullan
          const userData = await getUserProfile(userId);
          setState({
            userId: userId,
            isLoading: false,
            error: null,
            user: data.session?.user || null,
            userData
          });
        } else {
          setState({
            userId: null,
            isLoading: false,
            error: null,
            user: null,
            userData: null
          });
        }
      } catch (err) {
        setState({ 
          userId: null, 
          isLoading: false, 
          error: err instanceof Error ? err.message : "Bilinmeyen hata",
          user: null,
          userData: null 
        });
      }
    };

    // Oturumu kontrol et
    checkSession();

    // Oturum değişikliklerini dinle
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      const userId = session?.user?.id;
      if (userId) {
        // Kullanıcı oturumu açtığında profil bilgilerini getir
        const userData = await getUserProfile(userId);
        setState({
          userId: userId,
          isLoading: false,
          error: null,
          user: session?.user || null,
          userData
        });
      } else {
        setState({
          userId: null,
          isLoading: false,
          error: null,
          user: null,
          userData: null
        });
      }
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
