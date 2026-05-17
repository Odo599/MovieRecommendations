import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function PrimaryButton({
    children,
    className = "",
    ...props
}: PrimaryButtonProps) {
    return (
        <button
            className={`m-1 p-2 rounded-md bg-pink-700 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
