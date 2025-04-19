"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface FormStatusMessagesProps {
  error: string | null;
  success: boolean;
}

export default function FormStatusMessages({ error, success }: FormStatusMessagesProps) {
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Başarılı</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Rol başarıyla eklendi! Dashboard&apos;a yönlendiriliyorsunuz...
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
