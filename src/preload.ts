import type { AstroIntegration } from "astro";
import fs from "node:fs/promises";

const PKG_NAME = "astro-preload";

export default function preload(): AstroIntegration {
    return {
        name: PKG_NAME,
        hooks: {
            "astro:build:done": async () => {
                await fs.mkdir("dist/assets/preloaded", { recursive: true });
                const files = await fs.readdir("public/assets/preloaded");
                await Promise.all(files.map(async (file:string) => fs.copyFile(`public/assets/preloaded/${file}`, `dist/assets/preloaded/${file}`)));
            }
        }
    };
}

