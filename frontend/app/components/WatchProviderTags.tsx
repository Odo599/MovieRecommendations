import type { APIWatchProvider } from "~/lib/types";

function WatchProviderTag({
    watchProvider,
}: {
    watchProvider: APIWatchProvider;
}) {
    return (
        <div className="rounded-lg bg-red-500 text-center text-sm inline-flex m-1 px-2 py-1 flex items-center gap-2">
            <img
                height="24"
                width="24"
                src={`https://media.themoviedb.org/t/p/original${watchProvider.icon_path}`}
            />
            {watchProvider.name}
        </div>
    );
}

export default function WatchProviderTags({
    watchProviders,
}: {
    watchProviders: APIWatchProvider[];
}) {
    return (
        <div className="flex-1">
            {watchProviders.map((provider) => (
                <WatchProviderTag
                    watchProvider={provider}
                    key={provider.name}
                />
            ))}
        </div>
    );
}
