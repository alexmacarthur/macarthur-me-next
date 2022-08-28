import { remark } from "remark";
import strip from "strip-markdown";

export function stripMarkdown(markdown: string) {
  const result = remark().use(strip).processSync(markdown);

  return result.toString().replace(/[\r\n]+/gm, " ");
}

export function extractUrl(markdown: string): string | undefined {
  return markdown.match(/!\[.*?\]\((.*)\)/)?.[1];
}
