"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignJustify, faBold, faHighlighter, faItalic, faListOl, faListUl, faQuoteLeft, faUnderline } from "@fortawesome/free-solid-svg-icons";
import {
  articleHighlightColorTokens,
  articleDocumentToHtml,
  emptyArticleDocument,
  isSafeArticleHref,
  normalizeArticleColor,
  parseArticleDocument,
  type ArticleBlock,
  type ArticleDocument,
  type ArticleHighlightColor,
  type ArticleMark,
  type ArticleTextNode,
} from "@/lib/content/article-document";
import styles from "./article-rich-text-editor.module.css";

type EditorCommand = "bold" | "italic" | "underline" | "hiliteColor" | "insertUnorderedList" | "insertOrderedList" | "formatBlock" | "removeFormat";
type HighlightPalette = Record<ArticleHighlightColor, string | undefined>;

const highlightOptions: [ArticleHighlightColor, string][] = [
  ["green", "Surligner en vert"],
  ["yellow", "Surligner en jaune"],
  ["blue", "Surligner en bleu"],
  ["pink", "Surligner en rose"],
];

function readHighlightPalette(): HighlightPalette {
  const styles = getComputedStyle(document.documentElement);
  return Object.fromEntries(highlightOptions.map(([color]) => [
    color,
    normalizeArticleColor(styles.getPropertyValue(articleHighlightColorTokens[color])),
  ])) as HighlightPalette;
}

function readHighlightColor(
  node: HTMLElement,
  inherited: ArticleHighlightColor | undefined,
  palette: HighlightPalette,
): ArticleHighlightColor | undefined {
  const background = node.style.backgroundColor;
  const value = normalizeArticleColor(background);
  const paletteColor = highlightOptions.find(([color]) => value && palette[color] === value)?.[0];
  if (paletteColor) return paletteColor;
  const tokenColor = highlightOptions.find(([color]) => background === `var(${articleHighlightColorTokens[color]})`)?.[0];
  if (tokenColor) return tokenColor;
  if (node.tagName === "MARK" && background !== "transparent") return "green";
  return background ? undefined : inherited;
}

function readInline(
  node: Node,
  marks: ArticleMark[] = [],
  href?: string,
  color?: string,
  highlightColor?: ArticleHighlightColor,
  palette: HighlightPalette = readHighlightPalette(),
): ArticleTextNode[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ? [{ type: "text", text: node.textContent, ...(marks.length ? { marks } : {}), ...(href ? { href } : {}), ...(color ? { color } : {}), ...(marks.includes("highlight") ? { highlightColor: highlightColor ?? "green" } : {}) }] : [];
  }
  if (!(node instanceof HTMLElement)) return [];
  const nextMarks = [...marks];
  let nextHref = href;
  const nextColor = normalizeArticleColor(node.getAttribute("color") ?? node.style.color) ?? color;
  const nextHighlight = readHighlightColor(node, highlightColor, palette);
  if (nextHighlight && !nextMarks.includes("highlight")) nextMarks.push("highlight");
  else if (!nextHighlight) {
    const index = nextMarks.indexOf("highlight");
    if (index !== -1) nextMarks.splice(index, 1);
  }
  if (["B", "STRONG"].includes(node.tagName) && !nextMarks.includes("bold")) nextMarks.push("bold");
  if (["I", "EM"].includes(node.tagName) && !nextMarks.includes("italic")) nextMarks.push("italic");
  if (node.tagName === "U" && !nextMarks.includes("underline")) nextMarks.push("underline");
  if (node.tagName === "A" && node.getAttribute("href") && isSafeArticleHref(node.getAttribute("href")!)) {
    nextHref = node.getAttribute("href")!;
    if (!nextMarks.includes("link")) nextMarks.push("link");
  }
  if (node.tagName === "BR") return [{ type: "text", text: "\n", ...(nextMarks.length ? { marks: nextMarks } : {}), ...(nextHref ? { href: nextHref } : {}), ...(nextColor ? { color: nextColor } : {}), ...(nextHighlight ? { highlightColor: nextHighlight } : {}) }];
  return [...node.childNodes].flatMap((child) => readInline(child, nextMarks, nextHref, nextColor, nextHighlight, palette));
}

function readArticleHtml(html: string): ArticleDocument {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const highlightPalette = readHighlightPalette();
  const content: ArticleBlock[] = [];
  for (const node of [...parsed.body.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text.trim()) content.push({ type: "paragraph", content: [{ type: "text", text }] });
      continue;
    }
    if (!(node instanceof HTMLElement)) continue;
    if (node.tagName === "UL" || node.tagName === "OL") {
      const items = [...node.children].filter((child) => child.tagName === "LI")
        .map((item) => readInline(item, [], undefined, undefined, undefined, highlightPalette));
      content.push({ type: "list", ordered: node.tagName === "OL", items });
      continue;
    }
    const inline = readInline(node, [], undefined, undefined, undefined, highlightPalette);
    const alignment = node.style.textAlign === "justify" || node.getAttribute("align") === "justify" ? { align: "justify" as const } : {};
    if (node.tagName === "H2" || node.tagName === "H3") {
      content.push({ type: "heading", level: node.tagName === "H2" ? 2 : 3, content: inline });
    } else if (node.tagName === "BLOCKQUOTE") {
      content.push({ type: "quote", content: inline });
    } else if (inline.length) {
      content.push({ type: "paragraph", content: inline, ...alignment });
    }
  }
  return { type: "doc", content };
}

export function ArticleRichTextEditor({
  value,
  onChange,
  labelId,
  helpId,
}: {
  value: string;
  onChange: (value: string) => void;
  labelId: string;
  helpId: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [initialHtml] = useState(() => articleDocumentToHtml(parseArticleDocument(value)));
  const [active, setActive] = useState({ bold: false, italic: false, underline: false, highlight: null as ArticleHighlightColor | null, justify: false, paragraph: false, bullet: false, ordered: false });

  const rememberSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedRange.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const refreshActive = useCallback(() => {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!selection?.anchorNode || !editor?.contains(selection.anchorNode)) return;
    let inline = selection.anchorNode instanceof HTMLElement ? selection.anchorNode : selection.anchorNode.parentElement;
    const highlightPalette = readHighlightPalette();
    let highlighted: ArticleHighlightColor | null = null;
    let foundHighlightState = false;
    while (inline && editor.contains(inline)) {
      const background = inline.style.backgroundColor;
      if (background || inline.tagName === "MARK") {
        highlighted = readHighlightColor(inline, undefined, highlightPalette) ?? null;
        foundHighlightState = true;
        break;
      }
      inline = inline.parentElement;
    }
    let block = selection.anchorNode instanceof HTMLElement ? selection.anchorNode : selection.anchorNode.parentElement;
    while (block && block.parentElement !== editor) block = block.parentElement;
    const hasBlockChildren = [...editor.children].some((child) => ["P", "DIV", "H2", "H3", "BLOCKQUOTE", "UL", "OL"].includes(child.tagName));
    const paragraph = block && ["P", "DIV"].includes(block.tagName) ? block : !hasBlockChildren && editor.textContent ? editor : null;
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      highlight: foundHighlightState ? highlighted : document.queryCommandState("hiliteColor") ? "green" : null,
      justify: paragraph?.style.textAlign === "justify" || paragraph?.getAttribute("align") === "justify",
      paragraph: Boolean(paragraph),
      bullet: document.queryCommandState("insertUnorderedList"),
      ordered: document.queryCommandState("insertOrderedList"),
    });
    rememberSelection();
  }, [rememberSelection]);

  useEffect(() => {
    document.addEventListener("selectionchange", refreshActive);
    return () => document.removeEventListener("selectionchange", refreshActive);
  }, [refreshActive]);

  function apply(command: EditorCommand, value?: string) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (savedRange.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);
    }
    document.execCommand(command, false, value);
    onChange(JSON.stringify(readArticleHtml(editor.innerHTML)));
    refreshActive();
  }

  function updateContent() {
    if (!editorRef.current) return;
    const documentValue = readArticleHtml(editorRef.current.innerHTML);
    onChange(JSON.stringify(documentValue.content.length ? documentValue : emptyArticleDocument));
    refreshActive();
  }

  function toggleJustification() {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (!selection) return;
    if (savedRange.current) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const hasBlockChildren = [...editor.children].some((child) => ["P", "DIV", "H2", "H3", "BLOCKQUOTE", "UL", "OL"].includes(child.tagName));
    let paragraphs = [...editor.children].filter((child): child is HTMLElement =>
      child instanceof HTMLElement && ["P", "DIV"].includes(child.tagName) && range.intersectsNode(child));
    if (!paragraphs.length && !hasBlockChildren && editor.textContent) {
      const paragraph = document.createElement("p");
      paragraph.append(...Array.from(editor.childNodes));
      editor.append(paragraph);
      paragraphs = [paragraph];
    }
    if (!paragraphs.length) return;
    const removeJustification = paragraphs.every((paragraph) => paragraph.style.textAlign === "justify" || paragraph.getAttribute("align") === "justify");
    for (const paragraph of paragraphs) {
      if (removeJustification) paragraph.style.removeProperty("text-align");
      else paragraph.style.textAlign = "justify";
      paragraph.removeAttribute("align");
    }
    updateContent();
  }

  return (
    <div className={styles.editorFrame}>
      <div className={styles.controls} aria-label="Mise en forme du texte" role="group">
        <button aria-label="Gras" aria-pressed={active.bold} className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("bold")} type="button" title="Gras">
          <FontAwesomeIcon icon={faBold} aria-hidden="true" />
        </button>
        <button aria-label="Italique" aria-pressed={active.italic} className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("italic")} type="button" title="Italique">
          <FontAwesomeIcon icon={faItalic} aria-hidden="true" />
        </button>
        <button aria-label="Souligné" aria-pressed={active.underline} className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("underline")} type="button" title="Souligné">
          <FontAwesomeIcon icon={faUnderline} aria-hidden="true" />
        </button>
        {highlightOptions.map(([color, label]) => (
          <button aria-label={label} aria-pressed={active.highlight === color} className={`${styles.toolButton} ${styles.highlightButton}`} key={color} onMouseDown={rememberSelection}
            onClick={() => apply("hiliteColor", active.highlight === color ? "transparent" : getComputedStyle(document.documentElement).getPropertyValue(articleHighlightColorTokens[color]).trim())}
            style={{ backgroundColor: `var(${articleHighlightColorTokens[color]})` }} type="button" title={label}>
            <FontAwesomeIcon icon={faHighlighter} aria-hidden="true" />
          </button>
        ))}
        <button aria-label="Justifier le paragraphe" aria-pressed={active.justify} className={styles.toolButton} disabled={!active.paragraph} onMouseDown={rememberSelection} onClick={toggleJustification} type="button" title="Justifier le paragraphe">
          <FontAwesomeIcon icon={faAlignJustify} aria-hidden="true" />
        </button>
        <span className={styles.separator} aria-hidden="true" />
        <button aria-label="Titre de niveau 2" className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("formatBlock", "<h2>")} type="button" title="Titre">
          H2
        </button>
        <button aria-label="Titre de niveau 3" className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("formatBlock", "<h3>")} type="button" title="Sous-titre">
          H3
        </button>
        <span className={styles.separator} aria-hidden="true" />
        <button aria-label="Liste à puces" aria-pressed={active.bullet} className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("insertUnorderedList")} type="button" title="Liste à puces">
          <FontAwesomeIcon icon={faListUl} aria-hidden="true" />
        </button>
        <button aria-label="Liste numérotée" aria-pressed={active.ordered} className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("insertOrderedList")} type="button" title="Liste numérotée">
          <FontAwesomeIcon icon={faListOl} aria-hidden="true" />
        </button>
        <button aria-label="Citation" className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("formatBlock", "<blockquote>")} type="button" title="Citation">
          <FontAwesomeIcon icon={faQuoteLeft} aria-hidden="true" />
        </button>
        <button aria-label="Effacer la mise en forme" className={styles.clearButton} onMouseDown={rememberSelection} onClick={() => apply("removeFormat")} type="button">
          Effacer le style
        </button>
      </div>
      <div
        ref={editorRef}
        aria-labelledby={labelId}
        aria-describedby={helpId}
        aria-multiline="true"
        className={styles.editable}
        contentEditable
        data-placeholder="Rédigez votre texte…"
        onInput={updateContent}
        onKeyUp={refreshActive}
        onMouseUp={refreshActive}
        role="textbox"
        spellCheck
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: initialHtml }}
      />
    </div>
  );
}
