import { cn } from "@/lib/utils";
import React from "react";

const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      className={cn(
        `px-3 py-1 h-9 rounded-[4px] border border-[var(--border)]
        hover:border-[var(--primary)]
        focus:outline-none focus:ring-0 focus:border-[var(--primary)] focus:shadow-[inset_0_0_0_1px_var(--primary)] transition-[border,box-shadow] duration-300`,
        className
      )}
      type={type}
      {...props}
    />
  );
};

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PasswordInputProps extends React.ComponentProps<"input"> {}

const PasswordInput = React.forwardRef<HTMLInputElement>(
  ({ className, ...props }: PasswordInputProps, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const disabled =
      props.value === "" || props.value === undefined || props.disabled;

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("hide-password-toggle w-full", className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword && !disabled ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>

        {/* hides browsers password toggles */}
        <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

export default Input;
