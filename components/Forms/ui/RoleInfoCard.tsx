"use client";

import { ROLE_INFO } from "../constants";

interface RoleInfoCardProps {
  roleType: "Trainer" | "GymManager";
  className?: string;
}

/**
 * Displays detailed information about a role including description, benefits, and requirements
 */
export default function RoleInfoCard({ roleType, className = "" }: RoleInfoCardProps) {
  const roleInfo = ROLE_INFO[roleType];

  return (
    <div 
      className={`p-4 rounded-lg bg-gradient-to-r ${roleInfo.bgClass} text-white shadow-md ${className}`}
    >
      <div className="flex items-center mb-2">
        {roleInfo.icon}
        <h3 className="ml-2 font-semibold">{roleInfo.label}</h3>
      </div>
      <p className="text-sm mb-3">{roleInfo.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {roleInfo.benefits && (
          <div className="mb-2">
            <h4 className="font-semibold text-xs mb-1 uppercase tracking-wide opacity-90">Avantajlar:</h4>
            <ul className="list-disc list-inside text-xs space-y-1">
              {roleInfo.benefits.map((benefit: string, index: number) => (
                <li key={index} className="opacity-90">{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        
        {roleInfo.requirements && (
          <div>
            <h4 className="font-semibold text-xs mb-1 uppercase tracking-wide opacity-90">Gereksinimler:</h4>
            <ul className="list-disc list-inside text-xs space-y-1">
              {roleInfo.requirements.map((requirement: string, index: number) => (
                <li key={index} className="opacity-90">{requirement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
