"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, Dumbbell } from "lucide-react";

export default function ProfileSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2" disabled>
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil Bilgileri</span>
            <span className="sm:hidden">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="memberships" className="flex items-center gap-2" disabled>
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Üyeliklerim</span>
            <span className="sm:hidden">Üyelik</span>
          </TabsTrigger>
          <TabsTrigger value="workouts" className="flex items-center gap-2" disabled>
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Antrenmanlarım</span>
            <span className="sm:hidden">Antrenman</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-full" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-40" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
