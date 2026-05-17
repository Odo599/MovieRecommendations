import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function SecondaryButton({
    children,
    className = "",
    ...props
}: SecondaryButtonProps) {
    return (
        <button
            className={`m-1 p-2 rounded-lg border-2 border-pink-700 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
