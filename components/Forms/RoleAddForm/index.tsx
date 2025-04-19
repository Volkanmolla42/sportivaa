"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

// Import custom components
import RoleSelection from "./RoleSelection";
import RoleInfoCard from "./RoleInfoCard";
import TrainerForm from "./TrainerForm";
import GymManagerForm from "./GymManagerForm";
import FormProgress from "./FormProgress";
import FormStatusMessages from "./FormStatusMessages";

// Import hooks and utilities
import { useFormProgress } from "./useFormProgress";
import { useFormSubmit } from "./useFormSubmit";
import { formSchema, FormValues } from "./schemas";
import { getAvailableRoles } from "./constants";

export default function RoleAddForm() {
  const { user, roles, refresh } = useAuth();
  const router = useRouter();

  // Filter out roles the user already has
  const availableRoles = getAvailableRoles(roles);

  // Set up form with React Hook Form and Zod validation
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      roleType: undefined,
    },
  });

  // Watch the selected role to show appropriate form fields
  const selectedRole = watch("roleType");

  // Calculate form progress
  const progress = useFormProgress(watch);

  // Form submission handler
  const { isLoading, error, success, onSubmit } = useFormSubmit({
    user,
    refresh,
  });

  // If user has all roles, show a message
  if (availableRoles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rol Ekle</CardTitle>
          <CardDescription>
            Hesabınıza yeni roller ekleyerek platformdaki yeteneklerinizi genişletin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Tüm rollere sahipsiniz</AlertTitle>
            <AlertDescription>
              Şu anda mevcut tüm rollere sahipsiniz. Başka eklenebilecek rol bulunmamaktadır.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Dashboard&apos;a Dön
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle>Rol Ekle</CardTitle>
        <CardDescription>
          Hesabınıza yeni roller ekleyerek platformdaki yeteneklerinizi genişletin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <FormProgress progress={progress} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role selection */}
          <RoleSelection
            control={control}
            availableRoles={availableRoles}
            isLoading={isLoading}
          />

          {/* Role information card */}
          {selectedRole && <RoleInfoCard selectedRole={selectedRole} />}

          {/* Trainer specific fields */}
          {selectedRole === "Trainer" && (
            <TrainerForm control={control} isLoading={isLoading} />
          )}

          {/* Gym Manager specific fields */}
          {selectedRole === "GymManager" && (
            <GymManagerForm control={control} isLoading={isLoading} />
          )}

          {/* Error and success messages */}
          <FormStatusMessages error={error} success={success} />

          {/* Submit button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isLoading || !isValid || success}
              className="w-full"
            >
              {isLoading ? "Ekleniyor..." : "Rolü Ekle"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={isLoading}
              className="w-full"
            >
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
