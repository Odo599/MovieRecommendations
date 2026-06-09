import { config } from "./config.js";
import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable, watchlistTable } from "./db/schema.js";
import { hashPassword, verifyPassword } from "./auth.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import morgan from "morgan";
import {
    addUser,
    addWatchlistItem,
    deleteWatchlistItem,
    getUserFromEmail,
    getWatchlist,
} from "./db.js";
import { MovieDb } from "moviedb-promise";
import {
    getMovieInfo,
    getMovieWatchProviders,
    getTvShowInfo,
    getTvWatchProviders,
    searchTmdb,
} from "./tmdb.js";
import { PublicSearchResults, PublicWatchlist } from "./types.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const POSTGRES_URI = `postgres://${config.POSTGRES_USERNAME}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/postgres`;

const app = express();
const db = drizzle(POSTGRES_URI);
await migrate(db, { migrationsFolder: "./drizzle" });
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
    searchResults.forEach((item) => {
        let watchlistId: string | null = null;

        watchlist.forEach((watchlistItem) => {
            if (
                item.id == watchlistItem.tmdbId &&
                (watchlistItem.isMovie ? "movie" : "tv") === item.media_type
            ) {
                watchlistId = watchlistItem.id;
            }
        });

        result.push({
            ...item,
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

    const watchlist = await getWatchlist(email);
    const result: PublicWatchlist = [];
    for (const watchlistItem of watchlist) {
        if (watchlistItem.isMovie) {
            const details = await getMovieInfo(watchlistItem.tmdbId);
            const watchProviders = await getMovieWatchProviders(
                watchlistItem.tmdbId,
                user.countryCode
            );

            result.push({
                ...watchlistItem,
                overview: details.overview,
                releaseDate: details.release_date,
                title: details.title,
                poster_path: details.poster_path,
                watchProviders: watchProviders,
                media_type: "movie",
            });
        } else {
            const details = await getTvShowInfo(watchlistItem.tmdbId);
            const watchProviders = await getTvWatchProviders(
                watchlistItem.tmdbId,
                user.countryCode
            );
            result.push({
                ...watchlistItem,
                overview: details.overview,
                firstAirDate: details.first_air_date,
                name: details.name,
                poster_path: details.poster_path,
                watchProviders: watchProviders,
                media_type: "tv",
            });
        }
    }
    return res.status(200).json(result);
});

app.post("/api/watchlist/:tmdb_id_str", async (req, res) => {
    const email = verifyUserToken(req.headers.authorization);
    const tmdbId = Number(req.params.tmdb_id_str);
    let isMovie: boolean;
    if (req.query.isMovie === "true") isMovie = true;
    else if (req.query.isMovie === "false") isMovie = false;
    else
        return res
            .status(400)
            .json({ msg: "could not parse isMovie as boolean" });

    if (email == null) {
        return res.status(401).json({ msg: "invalid token" });
    }
    if (isNaN(tmdbId)) {
        return res.status(400).json({ msg: "could not parse id as integer" });
    }

    const user = await getUserFromEmail(email);
    if (user == null) {
        return res.status(401).json({ msg: "invalid token" });
    }

    const item: typeof watchlistTable.$inferInsert = {
        tmdbId: tmdbId,
        isMovie: isMovie,
        userId: user.id,
    };

    const insertedItem = await addWatchlistItem(item);
    if (!insertedItem) {
        return res.status(200).json({ msg: "item is already in watchlist" });
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
    console.log(`Using postgres on ${POSTGRES_URI}`);
});
