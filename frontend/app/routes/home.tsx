import info from "~/lib/info";
import type { Route } from "./+types/home";
import { useState } from "react";
import login from "~/lib/login";
import search from "~/lib/search";
import similar from "~/lib/similar";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Movie Recommendations" }];
}

export default function Home() {
    return (
        <div>
            <p>Home</p>
        </div>
    );
}
