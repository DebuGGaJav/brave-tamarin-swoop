import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder = "?",
  className,
  size = "lg",
  disabled = false
}) => {
  const increment = () => {
    const currentValue = parseInt(value) || 0;
    onChange((currentValue + 1).toString());
  };

  const decrement = () => {
    const currentValue = parseInt(value) || 0;
    if (currentValue > 0) {
      onChange((currentValue - 1).toString());
    }
  };

  const sizeClasses = {
    sm: "w-20 h-12 text-lg",
    md: "w-28 h-14 text-xl", 
    lg: "w-32 h-16 text-2xl"
  };

  const buttonSizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  return (
    <Card className={cn("inline-block shadow-lg border-2 transition-all duration-200 hover:shadow-xl", className)}>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={decrement}
          disabled={disabled || (!value && parseInt(value) <= 0)}
          className={cn(
            "rounded-l-lg rounded-r-none border-r hover:bg-gray-100 transition-colors",
            buttonSizeClasses[size]
          )}
        >
          <Minus className={cn(
            size === "sm" ? "w-4 h-4" : 
            size === "md" ? "w-5 h-5" : "w-6 h-6"
          )} />
        </Button>
        
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "border-0 text-center font-bold focus:ring-0 focus:outline-none",
            sizeClasses[size]
          )}
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={increment}
          disabled={disabled}
          className={cn(
            "rounded-r-lg rounded-l-none border-l hover:bg-gray-100 transition-colors",
            buttonSizeClasses[size]
          )}
        >
          <Plus className={cn(
            size === "sm" ? "w-4 h-4" : 
            size === "md" ? "w-5 h-5" : "w-6 h-6"
          )} />
        </Button>
      </div>
    </Card>
  );
};