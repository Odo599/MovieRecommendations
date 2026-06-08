export default function Poster({ posterPath }: { posterPath: string | null }) {
    return posterPath ? (
        <img
            src={`https://image.tmdb.org/t/p/w300${posterPath}`}
            className="mr-2 rounded-sm sm:rounded-md w-[66px] h-[99px] sm:w-[92px] sm:h-[138px]"
        />
    ) : (
        <></>
    );
}
