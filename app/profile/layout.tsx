import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil | Sportiva",
  description: "Sportiva platformu profil yönetimi",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/20 dark:from-slate-950 dark:to-slate-900/20 pb-8">
      {children}
    </main>
  );
}
