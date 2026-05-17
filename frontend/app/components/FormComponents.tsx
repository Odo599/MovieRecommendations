import type { ComponentProps, PropsWithChildren, ReactNode } from "react";

type FormFieldProps = {
    type: string;
    name: string;
    children: ReactNode;
    defaultValue?: string;
};

export function WelcomeContainer({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="items-center space-y-7">{children}</div>
        </div>
    );
}

export function FormField({
    type,
    name,
    children,
    defaultValue,
}: FormFieldProps) {
    return (
        <>
            <label
                htmlFor={name}
                className="w-full md:w-32 text-gray-400 font-medium mb-1 md:md-0 md:pr-4"
            >
                {children}
                <input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full rounded-md border border-gray-300 text-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </label>
            <br />
        </>
    );
}

export function MainForm({
    children,
    ...props
}: PropsWithChildren<ComponentProps<"form">>) {
    return (
        <form {...props} className="space-y-6">
            {children}
        </form>
    );
}

export function ErrorBox({ text }: { text?: string }) {
    return text ? <div>{text}</div> : null;
}
