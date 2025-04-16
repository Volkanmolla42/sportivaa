import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 p-4 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-xl w-full flex flex-col gap-8 items-center text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sportiva</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Spor salonları, eğitmenler ve üyeler için tek noktadan dijital platform. Üyelik yönetimi, randevu ve spor geçmişi artık çok kolay.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/auth/login" className="px-4 py-2 rounded  text-white hover:bg-blue-700 transition w-full sm:w-auto  dark:hover:bg-blue-800">Giriş Yap</Link>
          <Link href="/auth/register" className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-base-100 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition w-full sm:w-auto">Kayıt Ol</Link>
        </div>
      </div>
      <footer className="mt-12 text-gray-400 dark:text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} Sportiva. Tüm hakları saklıdır.
      </footer>
    </main>
  );
}
