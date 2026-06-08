import type { WatchProviderSchema } from "~/lib/types";

function WatchProviderTag({
    watchProvider,
}: {
    watchProvider: WatchProviderSchema;
}) {
    return (
        <img
            height="36"
            width="36"
            className="rounded-lg h-9 w-9 flex-shrink-0 object-cover"
            src={`https://media.themoviedb.org/t/p/original${watchProvider.iconPath}`}
            alt={watchProvider.name}
        />
    );
}

export default function WatchProviderTags({
    watchProviders,
}: {
    watchProviders: WatchProviderSchema[];
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {watchProviders.map((provider) => (
                <WatchProviderTag
                    watchProvider={provider}
                    key={provider.name}
                />
            ))}
        </div>
    );
}
