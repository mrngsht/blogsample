import fs from "node:fs";

// microCMSの無料プランではデータ転送量の制限(~20GB)がある
// build時にassetsとしてmicroCMSからダウンロードしておき、
// ユーザーからのアクセス時にはmicroCMSにアクセスされないようにする
export async function preloadImage(url: string) :Promise<string> {
  const name = new URL(url).pathname.split("/").pop()
  if (!url.startsWith("/")) {
      try {
          const preloadDir = "public/assets/preloaded";
          const path = `${preloadDir}/${name}`;

          if (!fs.existsSync(path)) {
              if (!fs.existsSync(preloadDir)){
                  fs.mkdirSync(preloadDir, { recursive: true });
              }
              const response = await fetch(url);
              const blob = await response.blob();

              fs.writeFileSync(
                  path,
                  new Uint8Array(await blob.arrayBuffer())
              );
              console.log(
                  `[astro-preload]: Downloaded image ${name} into ${path}`
              );
          }

          return import.meta.env.BASE_URL + `assets/preloaded/${name}`;
      } catch {
          console.log(
              `[astro-preload]: Failed to load image '${name}', fallback to using '${url}'`
          );
      }
  }
  return url
}
