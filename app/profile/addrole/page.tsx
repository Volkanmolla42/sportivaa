import { Metadata } from "next";
import AddRoleForm from "./components/AddRoleForm";

export const metadata: Metadata = {
  title: "Rol Ekle | Sportiva",
  description: "Sportiva platformunda kendinize yeni roller ekleyin",
};

export default function AddRolePage() {
  return (
    <div className="container max-w-3xl mx-auto py-6 sm:py-10 px-4 animate-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
      <AddRoleForm />
    </div>
  );
}
