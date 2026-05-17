type FormFieldProps = {
    type: string;
    name: string;
    children: any;
};

export default function FormField({ type, name, children }: FormFieldProps) {
    return (
        <>
            <label htmlFor={name}>
                {children}
                <input type={type} name={name} />
            </label>
            <br />
        </>
    );
}
