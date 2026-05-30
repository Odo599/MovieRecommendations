function WatchProviderTag({ watchProvider }: { watchProvider: string }) {
    return (
        <div className="rounded-lg bg-red-500 text-center text-sm inline-block m-1 px-2 py-1">
            {watchProvider}
        </div>
    );
}

export default function WatchProviderTags({
    watchProviders,
}: {
    watchProviders: string[];
}) {
    return (
        <div className="flex-1">
            {watchProviders.map((provider) => (
                <WatchProviderTag watchProvider={provider} key={provider} />
            ))}
        </div>
    );
}
