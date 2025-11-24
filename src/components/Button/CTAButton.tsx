import React from "react";

interface CTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

/**
 * CTA Button Component
 * Primary call-to-action button with automotive aesthetic
 * Features: Yellow background, sharp edges, smooth transitions, responsive sizing
 */
export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      iconPosition = "left",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const variantClasses = {
      primary:
        "bg-[#FFD700] text-[#001F3F] hover:bg-[#FFC700] active:bg-[#E6B800] font-bold",
      secondary:
        "bg-[#0A1D47] text-white border-2 border-[#FFD700] hover:bg-[#1A3A52] active:bg-[#0A1D47]",
      outline:
        "bg-transparent text-[#FFD700] border-2 border-[#FFD700] hover:bg-[#FFD700]/10 active:bg-[#FFD700]/20",
    };

    const baseClasses =
      "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ""}`}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            <span>{children}</span>
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </button>
    );
  }
);

CTAButton.displayName = "CTAButton";

export default CTAButton;
