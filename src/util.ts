import { JSDOM } from "jsdom"

export const formatDate = (d: Date): string => {
  const year = d.getFullYear()
  const month = d.getMonth()
  const date = d.getDate()
  return `${year}.${month}.${date}`
};

export const getInnerTextWithEllipsis = (html: string): string => {
  const maxLength = 80;
  const jsdom = new JSDOM();
  const parser = new jsdom.window.DOMParser();
  const fullText = parser.parseFromString(html, "text/html").body.textContent?.trim() ?? "";
  return fullText.length <= maxLength ? fullText : `${fullText.substring(0, maxLength)}...`;
}
