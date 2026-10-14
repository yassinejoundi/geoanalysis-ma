export type ArticleMark = "bold" | "italic" | "underline" | "link";

export type ArticleTextNode = {
  type: "text";
  text: string;
  marks?: ArticleMark[];
  href?: string;
};

export type ArticleBlock =
  | { type: "paragraph" | "quote"; content: ArticleTextNode[] }
  | { type: "heading"; level: 2 | 3; content: ArticleTextNode[] }
  | { type: "list"; ordered: boolean; items: ArticleTextNode[][] };

export type ArticleDocument = { type: "doc"; content: ArticleBlock[] };
export type ArticleFileAttachment = {
  id: string;
  name: string;
  kind: "PDF" | "DOCX" | "XLSX" | "CSV";
  size: number;
  url: string;
};
export type ArticleResource = { text: string; url: string };
export type EditorialFileCollection = "articles" | "actualites" | "realisations";

export const maxArticleFiles = 20;
export const maxArticleFileBytes = 15 * 1024 * 1024;
export const emptyArticleDocument: ArticleDocument = { type: "doc", content: [] };

export function isSafeArticleHref(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key));
}

function validTextNodes(value: unknown, state: { length: number }): value is ArticleTextNode[] {
  if (!Array.isArray(value) || value.length > 1000) return false;
  for (const node of value) {
    if (!isRecord(node) || node.type !== "text" || !hasOnlyKeys(node, ["type", "text", "marks", "href"]) || typeof node.text !== "string") return false;
    state.length += node.text.length;
    if (state.length > 20_000) return false;
    if (node.marks !== undefined && (!Array.isArray(node.marks) || node.marks.length > 4 ||
      node.marks.some((mark) => !["bold", "italic", "underline", "link"].includes(String(mark))) ||
      new Set(node.marks).size !== node.marks.length)) return false;
    const hasLink = Array.isArray(node.marks) && node.marks.includes("link");
    const href = node.href;
    if (hasLink !== (typeof href === "string") || (href !== undefined && typeof href !== "string") ||
      (typeof href === "string" && (href.length > 2048 || !isSafeArticleHref(href)))) return false;
  }
  return true;
}

export function isArticleDocument(value: unknown): value is ArticleDocument {
  if (!isRecord(value) || value.type !== "doc" || !hasOnlyKeys(value, ["type", "content"]) ||
    !Array.isArray(value.content) || value.content.length > 500) return false;
  const state = { length: 0 };
  for (const block of value.content) {
    if (!isRecord(block)) return false;
    if (block.type === "paragraph" || block.type === "quote") {
      if (!hasOnlyKeys(block, ["type", "content"]) || !validTextNodes(block.content, state)) return false;
    } else if (block.type === "heading") {
      if (!hasOnlyKeys(block, ["type", "level", "content"]) ||
        (block.level !== 2 && block.level !== 3) || !validTextNodes(block.content, state)) return false;
    } else if (block.type === "list") {
      if (!hasOnlyKeys(block, ["type", "ordered", "items"]) || typeof block.ordered !== "boolean" ||
        !Array.isArray(block.items) || block.items.length > 100) return false;
      for (const item of block.items) if (!validTextNodes(item, state)) return false;
    } else return false;
  }
  return true;
}

export function parseArticleDocument(value: string | undefined): ArticleDocument {
  if (!value) return emptyArticleDocument;
  try {
    const parsed: unknown = JSON.parse(value);
    if (isArticleDocument(parsed)) return parsed;
  } catch {
    // Existing article text is converted to plain paragraph blocks below.
  }
  const content = value.split(/\r?\n(?:[ \t]*\r?\n)+/).filter((paragraph) => paragraph.length > 0)
    .map((text): ArticleBlock => ({ type: "paragraph", content: [{ type: "text", text }] }));
  return { type: "doc", content };
}

export function estimateArticleReadingTime(content: { fr: string; en: string }) {
  const wordCount = (value: string) => articleDocumentToText(parseArticleDocument(value))
    .match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  const longestVersion = Math.max(wordCount(content.fr), wordCount(content.en));
  return `${Math.max(1, Math.ceil(longestVersion / 200))} min`;
}

export function articleDocumentToText(document: ArticleDocument) {
  return document.content.map((block) => block.type === "list"
    ? block.items.map((item) => item.map((node) => node.text).join(" ")).join(" ")
    : block.content.map((node) => node.text).join(" ")).join(" ");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[character]!);
}

function renderText(nodes: ArticleTextNode[]) {
  return nodes.map((node) => {
    let content = escapeHtml(node.text).replace(/\n/g, "<br>");
    if (node.marks?.includes("bold")) content = `<strong>${content}</strong>`;
    if (node.marks?.includes("italic")) content = `<em>${content}</em>`;
    if (node.marks?.includes("underline")) content = `<u>${content}</u>`;
    if (node.marks?.includes("link") && node.href && isSafeArticleHref(node.href)) {
      content = `<a href="${escapeHtml(node.href)}">${content}</a>`;
    }
    return content;
  }).join("");
}

export function articleDocumentToHtml(document: ArticleDocument) {
  return document.content.map((block) => {
    if (block.type === "heading") return `<h${block.level}>${renderText(block.content)}</h${block.level}>`;
    if (block.type === "quote") return `<blockquote>${renderText(block.content)}</blockquote>`;
    if (block.type === "list") {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${block.items.map((item) => `<li>${renderText(item)}</li>`).join("")}</${tag}>`;
    }
    return `<p>${renderText(block.content)}</p>`;
  }).join("");
}
