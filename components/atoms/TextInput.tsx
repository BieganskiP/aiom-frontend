import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            rounded-lg border border-neutral-200 px-4 py-2.5
            text-neutral-800 placeholder:text-neutral-400
            focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
            disabled:bg-neutral-50 disabled:text-neutral-400
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
