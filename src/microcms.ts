import { createClient } from "microcms-js-sdk";
import { preloadImage } from "./preload_image";
import { JSDOM } from "jsdom"

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export type NewsResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: NewsPostSummary[];
};

export type NewsPostSummary = {
  id: string;
  publishedAt: string;
  title: string;
  thumbnail: CmsImage;
};

export const getNewsPosts = async (): Promise<NewsResponse> => {
  const res = await client.get<NewsResponse>({ 
    endpoint: "news", 
    queries: {fields: ["id", "publishedAt", "title", "thumbnail"]},
  });
  await Promise.all(res.contents.map(async x => {
    x.thumbnail.url = await preloadImage(x.thumbnail.url)
  }))
  return res
}

export type NewsPostDetailResponse = {
  id: string;
  publishedAt: string;
  title: string;
  thumbnail: CmsImage;
  content: string;
};

export const getNewsPost = async (contentId: string): Promise<NewsPostDetailResponse> => {
  const res = await client.getListDetail<NewsPostDetailResponse>({
    endpoint: "news",
    contentId,
    queries: {fields: ["id", "publishedAt", "title", "thumbnail", "content"]},
  });
  res.thumbnail.url = await preloadImage(res.thumbnail.url)
  const dom = new JSDOM(res.content)
  for (const x of dom.window.document.querySelectorAll("img")) {
     const imgsrc = x.getAttribute("src")
     if (imgsrc) {
       x.setAttribute("src",  await preloadImage(imgsrc))
     }
  }
  res.content = dom.serialize()
  return res
};

export type AboutResponse = {
  about: string;
};

export const getAbout = async (): Promise<AboutResponse> => {
  const res = await client.get<AboutResponse>({ 
    endpoint: "others", 
    queries: {fields: ["about"]},
  });
  const dom = new JSDOM(res.about)
  for (const x of dom.window.document.querySelectorAll("img")) {
     const imgsrc = x.getAttribute("src")
     if (imgsrc) {
       x.setAttribute("src",  await preloadImage(imgsrc))
     }
  }
  res.about = dom.serialize()
  return res
}

export type TopImagesResponse = {
  topImages: CmsImage[];
};

export const getTopImages = async (): Promise<TopImagesResponse> => {
  const res = await client.get<TopImagesResponse>({ 
    endpoint: "others", 
    queries: {fields: ["topImages"]},
  });
  await Promise.all(res.topImages.map(async x => {
    x.url = await preloadImage(x.url)
  }))
  return res
}

export type CmsImage = {
  url: string;
  height: number;
  width: number;
}

