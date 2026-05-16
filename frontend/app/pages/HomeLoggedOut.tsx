import { useNavigate } from "react-router";

export default function HomeLoggedOut() {
    const navigate = useNavigate();

    return (
        <>
            <div className="p-[20px] flex md:flex-row justify-end gap-4 ">
                <p className="mr-auto">Movies</p>
                <button
                    onClick={() => navigate("/create-account")}
                    className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                    Create Account
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75"
                >
                    Login
                </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full text-xl">
                <p>Log in or create an account to get started</p>
            </div>
        </>
    );
}
