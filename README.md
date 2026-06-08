# Movies

## Development
1. Ensure docker is installed on your system.
2. Add the dotenvx key (DOTENV_PRIVATE_KEY) to `.env.keys`.
3. Run `npm install`.
4. Run `npm run dc-dev:up`
5. Logs can be checked with `npm run dc-dev:logs` if necessary.
6. From another 2 terminals run `npm run fronted` and `npm run backend`.
7. The frontend will be accessible at http://localhost:5173

## Hosting
1. Ensure docker is installed on your system.
2. Add the dotenvx key (DOTENV_PRIVATE_KEY) to `.env.keys`.
3. Run `npm install`.
4. Run `npm run dc:up`
5. The frontend container will be on a network called public_net.
6. Use nginx or similar to expose it, using the url `http://movierecommendations-frontend-1:3000`.

