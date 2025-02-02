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
        "bg-primary-600 text-white hover:bg-primary-600 disabled:hover:bg-primary-500",
      secondary:
        "bg-accent-400 text-white hover:bg-accent-500 disabled:hover:bg-accent-400",
      outline:
        "border border-bg-700 text-neutral-200 hover:bg-bg-700 disabled:hover:bg-transparent",
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
