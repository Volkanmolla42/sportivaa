import { CtaSection, FeaturesSection, FooterSection, HeaderSection, HeroSection, TestimonialsSection } from "@/components";

export default function Home() {
  return (
    <>
      <HeaderSection />
      <main className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
        <div className="relative">
          <HeroSection />
          <div className="relative">
            <div className="absolute inset-0 bg-[url('/images/gradient-bg.svg')] bg-no-repeat bg-cover opacity-10 dark:opacity-5"></div>
            <FeaturesSection />
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <TestimonialsSection />
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-gray-950/50 pointer-events-none"></div>
            <CtaSection />
          </div>
          <FooterSection />
        </div>
      </main>
    </>
  );
}
