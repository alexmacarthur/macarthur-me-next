import { SITE_URL } from "./constants";

export const randomInRange = (min, max): number => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const fullUrlFromPath = (path) => {
  return `${SITE_URL}${path}`;
};

export const prefersReducedMotion = () => {
  if (typeof window == undefined) return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)")?.matches;
};

export const generateExcerpt = (content: string, wordCount = 50) => {
  const strippedContent = content
    .replace(/\s\s+/g, " ")
    .replace(/\r?\n|\r/g, "")
    .replace(/\S+\.(gif|png|jpe?g)/g, ""); // Remove images.
  const words = strippedContent.split(" ");

  return words.slice(0, wordCount).join(" ") + "...";
}
