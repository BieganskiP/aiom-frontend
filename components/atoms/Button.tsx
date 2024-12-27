import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className = "", variant = "primary", size = "md", ...props },
    ref
  ) => {
    const baseStyles =
      "rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 disabled:hover:bg-primary-600",
      secondary:
        "bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:hover:bg-primary-50",
      outline:
        "border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:hover:bg-white",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5",
      lg: "px-5 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
