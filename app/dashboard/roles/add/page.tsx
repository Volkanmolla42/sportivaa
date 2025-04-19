"use client";

import { useAuth } from "@/contexts/AuthContext";
import RoleAddForm from "@/components/Forms/RoleAddForm";
import { withRoleAccess } from "@/components/Dashboard/withRoleAccess";

/**
 * Rol ekleme sayfası
 * Herhangi bir rol ile erişilebilir
 */
export default function RoleAddPage() {
  const { user } = useAuth();
  const userId = user?.id;

  // Rol erişim yüksek seviye bileşeniyle sarmalanmış rol ekleme formu
  // Member rolü olan herkes bu sayfaya erişebilir
  const RoleAddWithAccess = withRoleAccess({
    requiredRole: "Member",
    Component: () => (
      <div className="max-w-md mx-auto">
        <RoleAddForm />
      </div>
    ),
    navigateTo: "/dashboard"
  });

  return <RoleAddWithAccess userId={userId} />;
}
