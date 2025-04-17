import { HomeClient } from "./HomeClient";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 p-4 text-neutral-900 dark:text-neutral-100">
      <HomeClient />
      <footer className="mt-12 text-gray-400 dark:text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} Sportiva. Tüm hakları saklıdır.
      </footer>
    </main>
  );
}
