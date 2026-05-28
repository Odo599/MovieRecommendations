import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HeaderText({ text }: { text: string }) {
    return (
        <div className="flex items-center px-6">
            <div className="flex-1">
                <Link to={".."}>
                    <FontAwesomeIcon icon={["fas", "arrow-left"]} width={16}/>
                </Link>
            </div>
            <div className="text-3xl m-2 pt-1">{text}</div>
            <div className="flex-1" />
        </div>
    );
}
