import { createClient } from "microcms-js-sdk";
import { preloadImage } from "./preload_image";
import { JSDOM } from "jsdom"

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export type NewsPostSummary = {
  id: string;
  publishedAt: string;
  title: string;
  thumbnail: CmsImage;
};

export const getNewsPosts = async (limit: number): Promise<NewsPostSummary[]> => {
  const res = await client.getList<NewsPostSummary>({ 
    endpoint: "news", 
    queries: {
      fields: ["id", "publishedAt", "title", "thumbnail"],
      limit: limit,
    },
  });
  await Promise.all(res.contents.map(async x => {
    x.thumbnail.url = await preloadImage(x.thumbnail.url)
  }))
  return res.contents
}

export const getAllNewsPosts = async (): Promise<NewsPostSummary[]> => {
  const res = await client.getAllContents<NewsPostSummary>({ 
    endpoint: "news", 
    queries: {fields: ["id", "publishedAt", "title", "thumbnail"]},
  });
  await Promise.all(res.map(async x => {
    x.thumbnail.url = await preloadImage(x.thumbnail.url)
  }))
  return res
}

export const getNewsPostIds = async (): Promise<string[]> => {
  return await client.getAllContentIds({ 
    endpoint: "news", 
  });
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

export type ProductSummary = {
  id: string;
  publishedAt: string;
  name: string;
  thumbnail: CmsImage;
};

export const getProductsPosts = async (limit: number): Promise<ProductSummary[]> => {
  const res = await client.getList<ProductSummary>({ 
    endpoint: "products", 
    queries: {
      fields: ["id", "publishedAt", "name", "thumbnail"],
      limit: limit,
    },
  });
  await Promise.all(res.contents.map(async x => {
    x.thumbnail.url = await preloadImage(x.thumbnail.url)
  }))
  return res.contents
}

export const getAllProducts = async (): Promise<ProductSummary[]> => {
  const res = await client.getAllContents<ProductSummary>({ 
    endpoint: "products", 
    queries: {fields: ["id", "publishedAt", "name", "thumbnail"]},
  });
  await Promise.all(res.map(async x => {
    x.thumbnail.url = await preloadImage(x.thumbnail.url)
  }))
  return res
}

export const getProductIds = async (): Promise<string[]> => {
  return await client.getAllContentIds({ 
    endpoint: "products", 
  });
}

export type ProductsDetailResponse = {
  id: string;
  publishedAt: string;
  name: string;
  thumbnail: CmsImage;
  content: string;
};

export const getProducts = async (contentId: string): Promise<ProductsDetailResponse> => {
  const res = await client.getListDetail<ProductsDetailResponse>({
    endpoint: "products",
    contentId,
    queries: {fields: ["id", "publishedAt", "name", "thumbnail", "content"]},
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

