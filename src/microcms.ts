import type { MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

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

export const getNewsPosts = async (queries?: MicroCMSQueries) => {
  return await client.get<NewsResponse>({ endpoint: "news", queries });
};

export const getNewsPost = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await client.getListDetail<NewsPost>({
    endpoint: "news",
    contentId,
    queries,
  });
};
