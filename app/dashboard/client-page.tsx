"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardClientPage() {
  const { error } = useAuth();
  const { toast } = useToast();

  // Hata varsa toast göster
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error,
      });
    }
  }, [error, toast]);

  // Dashboard içeriğini göster (layout'ta auth kontrolü yapıldığı için burada kontrol etmeye gerek yok)
  return <DashboardContent />;
}
