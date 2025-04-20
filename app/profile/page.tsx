import { Metadata } from "next";
import { Suspense } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileSkeleton from "./components/ProfileSkeleton";
import ProfileContent from "./components/ProfileContent";


export const metadata: Metadata = {
  title: "Profil | Sportiva",
  description: "Sportiva platformunda profil bilgilerinizi yönetin",
};

export default function ProfilePage() {
  return (
    <div className="container max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileHeader />
        <ProfileContent />
      </Suspense>
    </div>
  );
}
