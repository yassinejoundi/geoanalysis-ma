"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignJustify, faBold, faHighlighter, faItalic, faListOl, faListUl, faQuoteLeft, faUnderline } from "@fortawesome/free-solid-svg-icons";
import {
  articleDocumentToHtml,
  emptyArticleDocument,
  isSafeArticleHref,
  normalizeArticleColor,
  parseArticleDocument,
  type ArticleBlock,
  type ArticleDocument,
  type ArticleMark,
  type ArticleTextNode,
} from "@/lib/content/article-document";
import styles from "./article-rich-text-editor.module.css";

type EditorCommand = "bold" | "italic" | "underline" | "foreColor" | "hiliteColor" | "justifyFull" | "insertUnorderedList" | "insertOrderedList" | "formatBlock" | "removeFormat";

function readInline(node: Node, marks: ArticleMark[] = [], href?: string, color?: string, highlightColor?: string): ArticleTextNode[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ? [{ type: "text", text: node.textContent, ...(marks.length ? { marks } : {}), ...(href ? { href } : {}), ...(color ? { color } : {}) }] : [];
  }
  if (!(node instanceof HTMLElement)) return [];
  const nextMarks = [...marks];
  let nextHref = href;
  const nextColor = normalizeArticleColor(node.getAttribute("color") ?? node.style.color) ?? color;
  const background = node.style.backgroundColor;
  const isHighlight = (Boolean(highlightColor) && normalizeArticleColor(background) === highlightColor) || (node.tagName === "MARK" && background !== "transparent");
  if (isHighlight && !nextMarks.includes("highlight")) {
    nextMarks.push("highlight");
  } else if (background && !isHighlight) {
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
  if (node.tagName === "BR") return [{ type: "text", text: "\n", ...(marks.length ? { marks } : {}), ...(href ? { href } : {}), ...(nextColor ? { color: nextColor } : {}) }];
  return [...node.childNodes].flatMap((child) => readInline(child, nextMarks, nextHref, nextColor, highlightColor));
}

function readArticleHtml(html: string): ArticleDocument {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const highlightColor = normalizeArticleColor(getComputedStyle(document.documentElement).getPropertyValue("--brand-pale"));
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
        .map((item) => readInline(item, [], undefined, undefined, highlightColor));
      content.push({ type: "list", ordered: node.tagName === "OL", items });
      continue;
    }
    const inline = readInline(node, [], undefined, undefined, highlightColor);
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
  const [textColor, setTextColor] = useState("#0e8c3f");
  const [active, setActive] = useState({ bold: false, italic: false, underline: false, highlight: false, justify: false, paragraph: false, bullet: false, ordered: false });

  const rememberSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedRange.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const refreshActive = useCallback(() => {
    const selection = window.getSelection();
    if (!selection?.anchorNode || !editorRef.current?.contains(selection.anchorNode)) return;
    let inline = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode.parentElement;
    const highlightColor = normalizeArticleColor(getComputedStyle(editorRef.current).getPropertyValue("--brand-pale"));
    let highlighted: boolean | undefined;
    while (inline && editorRef.current.contains(inline)) {
      const background = inline.style.backgroundColor;
      if (background) {
        highlighted = (Boolean(highlightColor) && normalizeArticleColor(background) === highlightColor) ||
          (inline.tagName === "MARK" && background === "var(--brand-pale)");
        break;
      }
      if (inline.tagName === "MARK") {
        highlighted = true;
        break;
      }
      inline = inline.parentElement;
    }
    let block = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode.parentElement;
    while (block && block.parentElement !== editorRef.current) block = block.parentElement;
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      highlight: highlighted ?? document.queryCommandState("hiliteColor"),
      justify: document.queryCommandState("justifyFull"),
      paragraph: Boolean(block && block !== editorRef.current && ["P", "DIV"].includes(block.tagName)),
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
        <button aria-label="Surligner en vert" aria-pressed={active.highlight} className={styles.toolButton} onMouseDown={rememberSelection} onClick={() => apply("hiliteColor", active.highlight ? "transparent" : getComputedStyle(document.documentElement).getPropertyValue("--brand-pale").trim())} type="button" title="Surligner en vert">
          <FontAwesomeIcon icon={faHighlighter} aria-hidden="true" />
        </button>
        <button aria-label="Justifier le paragraphe" aria-pressed={active.justify} className={styles.toolButton} disabled={!active.paragraph} onMouseDown={rememberSelection} onClick={() => apply("justifyFull")} type="button" title="Justifier le paragraphe">
          <FontAwesomeIcon icon={faAlignJustify} aria-hidden="true" />
        </button>
        <input aria-label="Couleur du texte" className={styles.colorInput} onMouseDown={rememberSelection} onChange={(event) => {
          setTextColor(event.currentTarget.value);
          apply("foreColor", event.currentTarget.value);
        }} title="Couleur du texte" type="color" value={textColor} />
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
