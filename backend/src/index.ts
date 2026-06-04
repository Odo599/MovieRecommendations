import "dotenv/config";
import { config } from "./config";
import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable, watchlistTable } from "./db/schema";
import { hashPassword, verifyPassword } from "./auth";
import jwt from "jsonwebtoken";
import multer from "multer";
import morgan from "morgan";
import {
    addUser,
    addWatchlistItem,
    deleteWatchlistItem,
    getUserFromEmail,
    getWatchlist,
} from "./db";
import { MovieDb } from "moviedb-promise";
import {
    getMovieInfo,
    getMovieWatchProviders,
    Provider,
    searchTmdb,
} from "./tmdb";
import { PublicSearchResults } from "./types";

const app = express();
const db = drizzle(config.DATABASE_URL);
const upload = multer();
const moviedb = new MovieDb(config.TMDB_API_KEY);
const PORT = process.env.PORT || 3000;

export { db, moviedb }; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const verifyBodies = (body: unknown[]) => {
    let valid = true;
    body.forEach((val) => {
        if (!val && typeof val !== "string") valid = false;
    });
    return valid;
};

interface JwtUserPayload {
    email: string;
}

export function verifyUserToken(authHeader: string | undefined): string | null {
    if (!authHeader) return null;

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    if (!token) return null;

    try {
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as JwtUserPayload;

        return decoded.email || null;
    } catch {
        return null;
    }
}

app.post("/api/login", upload.none(), async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!verifyBodies([email, password]))
        return res.status(400).json({ msg: "incorrectly structured data" });

    const user = await getUserFromEmail(email);

    if (user) {
        const success = await verifyPassword(user.passwordHash, password);
        if (success) {
            const token = jwt.sign({ email: email }, config.JWT_SECRET, {
                expiresIn: "1h",
            });
            return res.status(200).json({ access_token: token });
        }
    }
    // todo sleep for 50 ms
    return res.status(401).json({ msg: "Bad Credentials" });
});

app.post("/api/users/create", upload.none(), async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const countryCode = req.body.countryCode;

    if (!verifyBodies([username, email, password, countryCode])) {
        return res.status(400).json({ msg: "incorrectly structured data" });
    }

    const existingUser = await getUserFromEmail(email);
    if (!existingUser) {
        const user: typeof usersTable.$inferInsert = {
            username: username,
            email: email,
            passwordHash: await hashPassword(password),
            countryCode: countryCode,
        };
        await addUser(user);
        const token = jwt.sign({ email: email }, config.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(201).json({ access_token: token });
    }
    return res.status(409).json({ msg: "username or email taken" });
});

app.get("/api/movie/search", async (req, res) => {
    const query = req.query.q;
    const email = verifyUserToken(req.headers.authorization);

    if (email == null) {
        return res.status(401).json({ msg: "invalid token" });
    }
    if (typeof query !== "string") {
        return res.status(400).json({ msg: "missing query" });
    }
    const searchResults = await searchTmdb(query);
    const watchlist = await getWatchlist(email);

    const result: PublicSearchResults = [];
    searchResults.results.forEach((movie) => {
        let inWatchlist = false;
        let watchlistId: string | null = null;

        watchlist.forEach((watchlistItem) => {
            if (movie.id == watchlistItem.movieId) {
                inWatchlist = true;
                watchlistId = watchlistItem.id;
            }
        });

        result.push({
            ...movie,
            inWatchlist: inWatchlist,
            watchlistId: watchlistId,
        });
    });

    return res.status(200).json(result);
});

app.get("/api/watchlist", async (req, res) => {
    const email = verifyUserToken(req.headers.authorization);
    if (email == null) {
        return res.status(401).json({ msg: "invalid token" });
    }
    const user = await getUserFromEmail(email);
    if (user == null) {
        return res.status(401).json({ msg: "invalid token" });
    }

    type PublicWatchlistItem = {
        id: string;
        movieId: number;
        overview: string;
        releaseDate: string;
        title: string;
        watchProviders: Provider[];
    };

    const watchlist = await getWatchlist(email);
    const result: PublicWatchlistItem[] = [];
    for (const watchlistItem of watchlist) {
        const details = await getMovieInfo(watchlistItem.movieId);
        const watchProviders = await getMovieWatchProviders(
            watchlistItem.movieId,
            user.countryCode
        );

        result.push({
            ...watchlistItem,
            overview: details.overview,
            releaseDate: details.release_date,
            title: details.title,
            watchProviders: watchProviders,
        });
    }
    return res.status(200).json(result);
});

app.post("/api/watchlist/:movie_id_str", async (req, res) => {
    const email = verifyUserToken(req.headers.authorization);
    const movieId = Number(req.params.movie_id_str);

    if (email == null) {
        return res.status(401).json({ msg: "invalid token" });
    }
    if (isNaN(movieId)) {
        return res.status(400).json({ msg: "could not parse id as integer" });
    }

    const user = await getUserFromEmail(email);
    if (user == null) {
        return res.status(401).json({ msg: "invalid token" });
    }

    const item: typeof watchlistTable.$inferInsert = {
        movieId: movieId,
        userId: user.id,
    };

    const insertedItem = await addWatchlistItem(item);
    if (!insertedItem) {
        return res.status(200).json({ msg: "movie is already in watchlist" });
    }
    return res.status(200).json(insertedItem);
});

app.delete("/api/watchlist/:watchlist_id", async (req, res) => {
    const email = verifyUserToken(req.headers.authorization);
    const watchlistId = req.params.watchlist_id;

    if (email == null) return res.status(401).json({ msg: "invalid token" });

    const user = await getUserFromEmail(email);
    if (user == null) return res.status(401).json({ msg: "invalid token" });
    const succeeded = await deleteWatchlistItem(user, watchlistId);
    if (succeeded) return res.status(204).send();
    return res.status(404).json({ msg: "watchlist item not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
