"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AnimationVariant = 
  | "fade-in" 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "zoom-in" 
  | "zoom-out"
  | "none";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function AnimatedContainer({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  once = true,
}: AnimatedContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  // Define animation classes based on variant
  const getAnimationClasses = () => {
    const baseClasses = "transition-all";
    const durationClass = `duration-${duration}`;
    const delayClass = delay > 0 ? `delay-${delay}` : "";

    // Initial and animated states
    let initialClasses = "";
    let animatedClasses = "";

    switch (variant) {
      case "fade-in":
        initialClasses = "opacity-0";
        animatedClasses = "opacity-100";
        break;
      case "fade-up":
        initialClasses = "opacity-0 translate-y-8";
        animatedClasses = "opacity-100 translate-y-0";
        break;
      case "fade-down":
        initialClasses = "opacity-0 -translate-y-8";
        animatedClasses = "opacity-100 translate-y-0";
        break;
      case "fade-left":
        initialClasses = "opacity-0 translate-x-8";
        animatedClasses = "opacity-100 translate-x-0";
        break;
      case "fade-right":
        initialClasses = "opacity-0 -translate-x-8";
        animatedClasses = "opacity-100 translate-x-0";
        break;
      case "zoom-in":
        initialClasses = "opacity-0 scale-95";
        animatedClasses = "opacity-100 scale-100";
        break;
      case "zoom-out":
        initialClasses = "opacity-0 scale-105";
        animatedClasses = "opacity-100 scale-100";
        break;
      case "none":
      default:
        return className || "";
    }

    return cn(
      baseClasses,
      durationClass,
      delayClass,
      isVisible ? animatedClasses : initialClasses,
      className
    );
  };

  return (
    <div ref={ref} className={getAnimationClasses()}>
      {children}
    </div>
  );
}

export function AnimatedGroup({
  children,
  className,
  variant = "fade-up",
  staggerDelay = 100,
  duration = 500,
  threshold = 0.1,
  once = true,
}: AnimatedContainerProps & { staggerDelay?: number }) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <AnimatedContainer
            variant={variant}
            delay={index * staggerDelay}
            duration={duration}
            threshold={threshold}
            once={once}
          >
            {child}
          </AnimatedContainer>
        );
      })}
    </div>
  );
}
