"use client";

import { ROLE_INFO } from "./constants";

interface RoleInfoCardProps {
  selectedRole: "Trainer" | "GymManager";
}

export default function RoleInfoCard({ selectedRole }: RoleInfoCardProps) {
  if (!selectedRole) return null;

  const roleInfo = ROLE_INFO[selectedRole];

  return (
    <div className={`p-4 rounded-lg bg-gradient-to-r ${roleInfo.bgClass} text-white`}>
      <div className="flex items-center mb-2">
        {roleInfo.icon}
        <h3 className="ml-2 font-semibold">{roleInfo.label}</h3>
      </div>
      <p className="text-sm mb-3">{roleInfo.description}</p>

      <div className="space-y-2 mt-3">
        <h4 className="text-sm font-medium">Bu rol ile yapabilecekleriniz:</h4>
        <ul className="text-sm space-y-1 list-disc pl-5">
          {roleInfo.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
