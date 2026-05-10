import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        proxy: {
            "/api": "http://127.0.0.1:5000"
        }
    }
});
