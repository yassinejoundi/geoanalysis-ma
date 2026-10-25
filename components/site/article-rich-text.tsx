import type { ReactNode } from "react";
import { normalizeArticleColor, type ArticleBlock, type ArticleDocument, type ArticleTextNode } from "@/lib/content/article-document";

function renderText(nodes: ArticleTextNode[]) {
  return nodes.map((node, nodeIndex) => {
    const lines: ReactNode[] = [];
    node.text.split("\n").forEach((line, lineIndex) => {
      if (lineIndex) lines.push(<br key={`break-${lineIndex}`} />);
      lines.push(line);
    });
    let content: ReactNode = lines;
    if (node.marks?.includes("bold")) content = <strong>{content}</strong>;
    if (node.marks?.includes("italic")) content = <em>{content}</em>;
    if (node.marks?.includes("underline")) content = <u>{content}</u>;
    if (node.marks?.includes("link") && node.href) content = <a href={node.href}>{content}</a>;
    return <span key={nodeIndex} style={{ color: normalizeArticleColor(node.color) }}>{content}</span>;
  });
}

function renderBlock(block: ArticleBlock, index: number) {
  if (block.type === "heading") {
    return block.level === 2
      ? <h2 key={index}>{renderText(block.content)}</h2>
      : <h3 key={index}>{renderText(block.content)}</h3>;
  }
  if (block.type === "quote") return <blockquote key={index}>{renderText(block.content)}</blockquote>;
  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return <List key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderText(item)}</li>)}</List>;
  }
  return <p key={index}>{renderText(block.content)}</p>;
}

export function ArticleRichText({ document }: { document: ArticleDocument }) {
  return <>{document.content.map(renderBlock)}</>;
}
