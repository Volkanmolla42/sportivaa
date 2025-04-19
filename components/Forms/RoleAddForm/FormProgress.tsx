"use client";

import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  progress: number;
}

export default function FormProgress({ progress }: FormProgressProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-1">
        <span>Form tamamlama</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
