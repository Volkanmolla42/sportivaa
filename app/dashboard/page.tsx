import { Metadata } from "next";
import { generateMetadata } from "@/components/shared/SEO";
import DashboardClientPage from "./client-page";

export const metadata: Metadata = generateMetadata({
  title: "Dashboard",
  description:
    "Sportiva platformunun kontrol panelinde her şeyi tek yerden yönetebilirsin. Salonlar, antrenmanlar ve daha fazlasına hızlıca erişebilirsin.",
  keywords: [
    "dashboard",
    "kontrol paneli",
    "üye paneli",
    "eğitmen paneli",
    "salon yönetimi",
  ],
});

export default function DashboardPage() {
  // Client-side auth check'i kullanarak dashboard içeriğini göster
  // Not: Client-side'da auth kontrolü yapılıyor ve kullanıcı giriş yapmamışsa yönlendiriliyor
  return <DashboardClientPage />;
}
