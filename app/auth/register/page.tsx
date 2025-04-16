import AuthForm from '@/app/components/AuthForm';

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>
      <AuthForm mode="register" />
    </main>
  );
}
