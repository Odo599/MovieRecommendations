import type {
    ButtonHTMLAttributes,
    LinkHTMLAttributes,
    ReactNode,
} from "react";
import { Link, type Path } from "react-router";

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

type StyledLinkProps = {
    children: ReactNode;
    to: string | Path;
};

export function PrimaryButton({
    children,
    className = "",
    ...props
}: StyledButtonProps) {
    return (
        <button
            className={`p-2 w-full rounded-md bg-pink-700 cursor-pointer ${className}`}
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
            className={`p-2 w-full rounded-lg border-2 border-pink-700 cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function PrimaryLinkButton({ children, to }: StyledLinkProps) {
    return (
        <PrimaryButton className="flex">
            <Link to={to} className="grow">
                {children}
            </Link>
        </PrimaryButton>
    );
}
