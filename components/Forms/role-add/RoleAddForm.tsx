"use client";

// No need for useState as we're using React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

import { FormValues, formSchema } from "../schemas";
import { getAvailableRoles } from "../constants";
import { useFormProgress } from "../hooks/use-form-progress";
import { useFormSubmit } from "../hooks/use-form-submit";

import FormProgress from "../ui/FormProgress";
import FormStatusMessages from "../ui/FormStatusMessages";
import RoleSelection from "./RoleSelection";
import TrainerFields from "./fields/TrainerFields";
import GymManagerFields from "./fields/GymManagerFields";

/**
 * Main form component for adding a new role to a user account
 */
export default function RoleAddForm() {
  const { roles } = useAuth();
  const router = useRouter();
  
  // Form setup with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleType: undefined as unknown as "Trainer" | "GymManager",
    },
    mode: "onChange",
  });
  
  // Custom hooks for form functionality
  const progress = useFormProgress(form.watch);
  const { handleSubmit, status } = useFormSubmit({ redirectPath: "/dashboard" });
  
  // Filter out roles the user already has
  const availableRoles = getAvailableRoles(roles);

  // No available roles message
  if (availableRoles.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-md border border-slate-200 dark:border-slate-700">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <CardTitle>Rol Ekle</CardTitle>
          <CardDescription>
            Hesabınıza yeni roller ekleyerek platformdaki yeteneklerinizi genişletin.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert>
            <AlertTitle>Tüm rollere sahipsiniz</AlertTitle>
            <AlertDescription>
              Şu anda mevcut tüm rollere sahipsiniz. Başka eklenebilecek rol bulunmamaktadır.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Dashboard&apos;a Dön
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    handleSubmit(data);
  };

  // Role-specific field components
  const selectedRole = form.watch("roleType") as "Trainer" | "GymManager" | undefined;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <CardTitle>Rol Ekle</CardTitle>
        <CardDescription>
          Hesabınıza yeni roller ekleyerek platformdaki yeteneklerinizi genişletin.
        </CardDescription>
        <FormProgress progress={progress} />
      </CardHeader>
      
      <CardContent className="pt-6">
        <form id="role-add-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <RoleSelection 
            control={form.control} 
            availableRoles={availableRoles} 
            isLoading={status.isLoading} 
          />
          
          {selectedRole === "Trainer" && (
            <TrainerFields 
              control={form.control} 
              isLoading={status.isLoading} 
            />
          )}
          
          {selectedRole === "GymManager" && (
            <GymManagerFields 
              control={form.control} 
              isLoading={status.isLoading} 
            />
          )}
          
          <FormStatusMessages 
            status={status} 
            successTitle="Rol Eklendi"
            successMessage="Yeni rol hesabınıza başarıyla eklendi. Yönlendiriliyorsunuz..." 
          />
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <Button 
          variant="outline" 
          onClick={() => router.push("/dashboard")}
          disabled={status.isLoading}
        >
          İptal
        </Button>
        
        <Button 
          type="submit"
          form="role-add-form"
          disabled={status.isLoading || !selectedRole || progress < 50}
          className="relative"
        >
          {status.isLoading ? (
            <>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span className="opacity-0">Rol Ekle</span>
            </>
          ) : (
            "Rol Ekle"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
