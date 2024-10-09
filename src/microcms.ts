import type { MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import { preloadImage } from "./preload_image";

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

export const getNewsPosts = async (queries?: MicroCMSQueries): Promise<NewsResponse> => {
  const res = await client.get<NewsResponse>({ endpoint: "news", queries });
  await Promise.all(res.contents.map(preloadAndReplaceImageUrl))
  return res
}

export const getNewsPost = async (
  contentId: string,
  queries?: MicroCMSQueries
): Promise<NewsPost> => {
  const res = await client.getListDetail<NewsPost>({
    endpoint: "news",
    contentId,
    queries,
  });
  await preloadAndReplaceImageUrl(res)
  return res
};

const preloadAndReplaceImageUrl = async (post: NewsPost) => {
  post.thumbnail.url = await preloadImage(post.thumbnail.url)
}
