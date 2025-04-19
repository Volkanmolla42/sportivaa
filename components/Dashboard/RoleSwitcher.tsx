"use client";

import React from "react";

interface RoleSwitcherProps {
  roles: string[];
  selectedRole: string;
  onChange: (role: string) => void;
}

export default function RoleSwitcher({ roles, selectedRole, onChange }: RoleSwitcherProps) {
  return (
    <select
      value={selectedRole}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700"
    >
      {roles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}
