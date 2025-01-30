import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-bg-700 bg-bg-900 px-3 py-2 text-sm",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-neutral-500",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
