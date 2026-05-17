import type { ButtonHTMLAttributes, ReactNode } from "react";

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export function PrimaryButton({
    children,
    className = "",
    ...props
}: StyledButtonProps) {
    return (
        <button
            className={`p-2 w-full rounded-md bg-pink-700 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({
    children,
    className = "",
    ...props
}: StyledButtonProps) {
    return (
        <button
            className={`p-2 w-full rounded-lg border-2 border-pink-700 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
