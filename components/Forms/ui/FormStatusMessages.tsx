"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle,} from "lucide-react";
import { FormSubmissionStatus } from "../schemas";

interface FormStatusMessagesProps {
  status: FormSubmissionStatus;
  successTitle?: string;
  successMessage?: string;
  className?: string;
}

/**
 * Reusable component for displaying form status messages (error/success)
 */
export default function FormStatusMessages({
  status,
  successTitle = "İşlem Başarılı",
  successMessage = "Formunuz başarıyla gönderildi.",
  className = "mt-4",
}: FormStatusMessagesProps) {
  if (!status.error && !status.success) return null;

  return (
    <div className={className}>
      {status.error && (
        <Alert variant="destructive" className="border-red-300 dark:border-red-800 animate-in fade-in-50 duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{status.error}</AlertDescription>
        </Alert>
      )}

      {status.success && (
        <Alert className="border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800 animate-in fade-in-50 duration-300">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">{successTitle}</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">{successMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
