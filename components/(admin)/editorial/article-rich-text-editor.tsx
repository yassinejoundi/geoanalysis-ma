"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faListOl, faListUl, faQuoteLeft, faUnderline } from "@fortawesome/free-solid-svg-icons";
import {
  articleDocumentToHtml,
  emptyArticleDocument,
  isSafeArticleHref,
  parseArticleDocument,
  type ArticleBlock,
  type ArticleDocument,
  type ArticleMark,
  type ArticleTextNode,
} from "@/lib/content/article-document";
import styles from "./article-rich-text-editor.module.css";

type EditorCommand = "bold" | "italic" | "underline" | "insertUnorderedList" | "insertOrderedList" | "formatBlock" | "removeFormat";

function readInline(node: Node, marks: ArticleMark[] = [], href?: string): ArticleTextNode[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ? [{ type: "text", text: node.textContent, ...(marks.length ? { marks } : {}), ...(href ? { href } : {}) }] : [];
  }
  if (!(node instanceof HTMLElement)) return [];
  const nextMarks = [...marks];
  let nextHref = href;
  if (["B", "STRONG"].includes(node.tagName) && !nextMarks.includes("bold")) nextMarks.push("bold");
  if (["I", "EM"].includes(node.tagName) && !nextMarks.includes("italic")) nextMarks.push("italic");
  if (node.tagName === "U" && !nextMarks.includes("underline")) nextMarks.push("underline");
  if (node.tagName === "A" && node.getAttribute("href") && isSafeArticleHref(node.getAttribute("href")!)) {
    nextHref = node.getAttribute("href")!;
    if (!nextMarks.includes("link")) nextMarks.push("link");
  }
  if (node.tagName === "BR") return [{ type: "text", text: "\n", ...(marks.length ? { marks } : {}), ...(href ? { href } : {}) }];
  return [...node.childNodes].flatMap((child) => readInline(child, nextMarks, nextHref));
}

function readArticleHtml(html: string): ArticleDocument {
  const parsed = new DOMParser().parseFromString(html, "text/html");
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
        .map((item) => readInline(item));
      content.push({ type: "list", ordered: node.tagName === "OL", items });
      continue;
    }
    const inline = readInline(node);
    if (node.tagName === "H2" || node.tagName === "H3") {
      content.push({ type: "heading", level: node.tagName === "H2" ? 2 : 3, content: inline });
    } else if (node.tagName === "BLOCKQUOTE") {
      content.push({ type: "quote", content: inline });
    } else if (inline.length) {
      content.push({ type: "paragraph", content: inline });
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
  const [active, setActive] = useState({ bold: false, italic: false, underline: false, bullet: false, ordered: false });

  const rememberSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedRange.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const refreshActive = useCallback(() => {
    const selection = window.getSelection();
    if (!selection?.anchorNode || !editorRef.current?.contains(selection.anchorNode)) return;
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
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
