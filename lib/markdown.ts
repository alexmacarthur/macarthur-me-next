import { remark } from "remark";
import strip from "strip-markdown";

export function stripMarkdown(markdown: string) {
  const result = remark().use(strip).processSync(markdown);

  return result.toString().replace(/[\r\n]+/gm, " ");
}

export function extractUrl(markdown: string): string | undefined {
  return markdown.match(/!\[.*?\]\((.*)\)/)?.[1];
}

export function generateExcerptFromMarkdown(content: string, wordCount = 50) {
  const strippedContent = stripMarkdown(content)
    .replace(/\s\s+/g, " ")
    .replace(/\r?\n|\r/g, "")
    .replace(/\S+\.(gif|png|jpe?g)/g, ""); // Remove images.
  const words = strippedContent.split(" ");

  return words.slice(0, wordCount).join(" ") + "...";
}
