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
  await Promise.all(res.contents.map(preloadAndReplaceImageUrl))
  return res
}

export type NewsPostDetail = {
  id: string;
  publishedAt: string;
  title: string;
  thumbnail: CmsImage;
  content: string;
};

export const getNewsPost = async (contentId: string): Promise<NewsPostDetail> => {
  const res = await client.getListDetail<NewsPostDetail>({
    endpoint: "news",
    contentId,
    queries: {fields: ["id", "publishedAt", "title", "thumbnail", "content"]},
  });
  await preloadAndReplaceImageUrl(res)
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

const preloadAndReplaceImageUrl = async (post: {thumbnail: CmsImage}) => {
  post.thumbnail.url = await preloadImage(post.thumbnail.url)
}

export type CmsImage = {
  url: string;
  height: number;
  width: number;
}

