"use client";

import { Controller, Control } from "react-hook-form";
import { ROLE_INFO } from "./constants";
import { FormValues } from "./schemas";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface RoleSelectionProps {
  control: Control<FormValues>;
  availableRoles: Array<"Trainer" | "GymManager">;
  isLoading: boolean;
  error?: string;
}

// Yeni tasarım için renk teması
const themes = {
  Trainer: {
    gradient: "from-blue-900 via-blue-700 to-blue-500",
    hover: "from-blue-800 via-blue-600 to-blue-400",
    accent: "bg-blue-500",
    light: "bg-blue-300",
    border: "border-blue-400",
    shadow: "shadow-blue-500/20"
  },
  GymManager: {
    gradient: "from-purple-900 via-purple-700 to-purple-500",
    hover: "from-purple-800 via-purple-600 to-purple-400",
    accent: "bg-purple-500",
    light: "bg-purple-300",
    border: "border-purple-400",
    shadow: "shadow-purple-500/20"
  }
};

const RoleSelection = ({
  control,
  availableRoles,
  isLoading,
  error,
}: RoleSelectionProps) => {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500"
          >
            Rolünü Keşfet
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Geleceğinizi şekillendirin. Platformumuzda sizin için uygun rol ile potansiyelinizi ortaya çıkarın.
          </motion.p>
        </div>

        <Controller
          name="roleType"
          control={control}
          render={({ field, fieldState }) => (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {availableRoles.map((role) => {
                  const isSelected = field.value === role;
                  const isHovered = hoveredRole === role;
                  const theme = themes[role];
                  
                  return (
                    <motion.div
                      key={role}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                      whileHover={{ scale: 1.02 }}
                      onHoverStart={() => setHoveredRole(role)}
                      onHoverEnd={() => setHoveredRole(null)}
                    >
                      <motion.button
                        type="button"
                        disabled={isLoading}
                        onClick={() => field.onChange(role)}
                        className={cn(
                          "relative w-full h-full overflow-hidden rounded-2xl",
                          "border-2 transition-all duration-300",
                          isSelected ? `${theme.border} ${theme.shadow} shadow-xl` : "border-gray-700",
                          isLoading && "opacity-60 cursor-not-allowed"
                        )}
                        style={{ minHeight: "320px" }}
                      >
                        {/* Background with animated gradient */}
                        <div 
                          className={cn(
                            "absolute inset-0 bg-gradient-to-br transition-all duration-500",
                            isSelected || isHovered ? theme.hover : theme.gradient
                          )}
                        />
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div 
                            layoutId="selection-indicator"
                            className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                        
                        {/* Content */}
                        <div className="relative z-10 p-8 flex flex-col items-center justify-between h-full">
                          {/* Top section */}
                          <div className="text-center mb-6">
                            <div className={cn("inline-flex p-4 rounded-full mb-4", theme.accent)}>
                              <span className="text-4xl text-white">{ROLE_INFO[role].icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{ROLE_INFO[role].label}</h3>
                          </div>
                          
                          {/* Middle section */}
                          <div className="flex-grow w-full">
                            <div className={cn("p-4 rounded-xl mb-6 bg-white/10 backdrop-blur-sm")}>
                              <p className="text-gray-100">{ROLE_INFO[role].description}</p>
                            </div>
                            
                            {/* Feature bullets */}
                            <ul className="space-y-2 mb-6 text-left">
                              {role === "Trainer" ? (
                                <>
                                  <li className="flex items-center text-gray-200">
                                    <span className={cn("h-2 w-2 rounded-full mr-2", theme.light)}></span>
                                    Kişisel antrenman programları oluştur
                                  </li>
                                  <li className="flex items-center text-gray-200">
                                    <span className={cn("h-2 w-2 rounded-full mr-2", theme.light)}></span>
                                    Müşterilerle doğrudan iletişim kur
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li className="flex items-center text-gray-200">
                                    <span className={cn("h-2 w-2 rounded-full mr-2", theme.light)}></span>
                                    Tüm salonu ve ekipmanları yönet
                                  </li>
                                  <li className="flex items-center text-gray-200">
                                    <span className={cn("h-2 w-2 rounded-full mr-2", theme.light)}></span>
                                    Personel ve üyelik programlarını düzenle
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                          
                          {/* Bottom section */}
                          <Badge 
                            variant={isSelected ? "default" : "outline"} 
                            className={cn(
                              "px-6 py-2 text-lg font-medium rounded-full",
                              isSelected ? theme.accent : "bg-transparent border border-gray-400"
                            )}
                          >
                            {role}
                          </Badge>
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
              
              {fieldState.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive" className="bg-red-900/60 border border-red-500">
                    <AlertDescription className="text-base font-semibold text-white">
                      {fieldState.error.message}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </div>
          )}
        />
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8"
          >
            <Alert variant="destructive" className="bg-red-900/60 border border-red-500">
              <AlertDescription className="text-base font-semibold text-white">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RoleSelection;