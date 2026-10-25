import Path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            "@": Path.resolve(import.meta.dirname, "src"),
        },
    },
    test: {
        root: "./src",
        include: ["**/__tests__/**/*.{ts,tsx,js}", "**/*.{spec,test}.{ts,tsx,js}"],
        environment: "node",
        globals: true,
        passWithNoTests: true,
    },
})
