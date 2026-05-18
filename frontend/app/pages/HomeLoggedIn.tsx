import { useNavigate } from "react-router";
import SearchBar from "~/components/SearchBar";

export default function HomeLoggedIn() {
    const navigate = useNavigate();
    const onSearch = (query: string) => {
        console.log(`/search/${query}`);
        navigate(`/search/${query}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <SearchBar onSubmit={onSearch} />
        </div>
    );
}
