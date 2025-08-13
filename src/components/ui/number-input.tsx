import * as React from "react";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> { // Omit 'size' from original HTML attributes
  size?: "sm" | "md" | "lg";
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, type, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-10 px-3 py-2 text-base",
      md: "h-12 px-4 py-2 text-xl",
      lg: "h-16 px-5 py-3 text-2xl",
    };

    return (
      <input
        type="number"
        className={cn(
          "flex w-32 rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center font-bold",
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };