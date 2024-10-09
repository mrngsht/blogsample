import type { MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import { preloadImage } from "./preload_image";
import {Mutex} from 'await-semaphore';

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

//型定義
export type NewsPost = {
  id: string;
  publishedAt: string;
  title: string;
  thumbnail: {
    url: string;
    height: number;
    width: number;
  };
  content: string;
};
export type NewsResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: NewsPost[];
};

var mutex = new Mutex();
var newsStore: NewsPost[] = []
var newsStored = false

export const getNewsPosts = async (queries?: MicroCMSQueries): Promise<NewsPost[]> => {
  console.log("getNewsPosts called")
  mutex.use(async () => {
    if (!newsStored) {
      console.log("getNewsPosts filling")
      const news = await client.get<NewsResponse>({ endpoint: "news", queries });
      for (const c of news.contents) {
        c.thumbnail.url = await preloadImage(c.thumbnail.url)
      }
      newsStore = news.contents
      newsStored = true
    }
  })
  return newsStore
}


export const getNewsPost = async (
  contentId: string
): Promise<NewsPost> => {
  const posts = await getNewsPosts()
  return posts.filter(x => x.id == contentId)[0]
};

