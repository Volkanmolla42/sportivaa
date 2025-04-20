"use client";

import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
}

/**
 * Reusable form progress indicator component
 */
export default function FormProgress({ 
  progress, 
  showPercentage = true, 
  className = "mb-6" 
}: FormProgressProps) {
  return (
    <div className={className}>
      {showPercentage && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600 dark:text-slate-400">Form tamamlama</span>
          <span className="font-medium">{progress}%</span>
        </div>
      )}
      <Progress 
        value={progress} 
        className="h-2 bg-slate-100 dark:bg-slate-800" 
      />
    </div>
  );
}
