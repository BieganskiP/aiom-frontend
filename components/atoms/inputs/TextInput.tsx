import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  labelClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className = "", labelClassName = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={props.id}
            className={`text-sm font-medium text-neutral-200 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            rounded-lg border bg-bg-700 border-bg-700
            px-4 py-2.5
            text-foreground placeholder:text-neutral-500
            focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
            disabled:bg-bg-800 disabled:text-neutral-400
            ${
              error
                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                : ""
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-error-500">{error.message}</span>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
