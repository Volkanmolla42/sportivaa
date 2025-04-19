"use client";

import { useState, useEffect } from "react";
import { UseFormWatch } from "react-hook-form";
import { FormValues } from "./schemas";

export function useFormProgress(watch: UseFormWatch<FormValues>) {
  const [progress, setProgress] = useState(0);
  const selectedRole = watch("roleType");

  // Update progress based on form completion
  useEffect(() => {
    if (!selectedRole) {
      setProgress(0);
      return;
    }

    // Calculate progress based on filled fields
    let filledFields = 0;
    let totalFields = 1; // roleType is always required

    if (selectedRole === "Trainer") {
      totalFields += 2; // experience and specialty are required
      if (watch("experience") !== undefined) filledFields++;
      if (watch("specialty")) filledFields++;

      // Optional fields contribute less to progress
      totalFields += 0.5;
      totalFields += 0.5;
    } else if (selectedRole === "GymManager") {
      totalFields += 2; // gymName and city are required
      if (watch("gymName")) filledFields++;
      if (watch("city")) filledFields++;
    }

    // Add roleType to filled fields if selected
    filledFields++;

    const calculatedProgress = Math.min(100, Math.round((filledFields / totalFields) * 100));
    setProgress(calculatedProgress);
  }, [watch, selectedRole]);

  return progress;
}
