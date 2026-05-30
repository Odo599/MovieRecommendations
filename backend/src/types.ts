type PublicSearchResults = {
    id: number;
    overview: string;
    release_date: string;
    title: string;
    inWatchlist: boolean;
    watchlistId: string | null;
}[];

export { type PublicSearchResults };
