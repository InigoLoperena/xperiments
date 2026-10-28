"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { englishInterfaceCopy } from "./language-dictionary";
import { englishWorkspaceCopy } from "./workspace-translations";

export type Language = "es" | "en";
const STORAGE_KEY = "xperiments.language";
const translations: Readonly<Record<string, string>> = { ...englishInterfaceCopy, ...englishWorkspaceCopy };
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (value: string) => string } | null>(null);

export function translateUI(value: string, language: Language): string {
  if (language === "es") return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const key = value.trim();
  return translations[key] === undefined ? value : leading + translations[key] + trailing;
}

function browserLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch { /* Private browser mode can restrict storage. */ }
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  // Only two available languages: Spanish for es-* browsers; English otherwise.
  return languages[0]?.toLowerCase().startsWith("es") ? "es" : "en";
}

const translatableAttributes = ["aria-label", "title", "placeholder", "alt"] as const;
const excludedTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"]);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>("es");
  const originalText = useRef(new WeakMap<Text, string>());
  const appliedText = useRef(new WeakMap<Text, string>());
  const originalAttributes = useRef(new WeakMap<Element, Map<string, string>>());
  const appliedAttributes = useRef(new WeakMap<Element, Map<string, string>>());

  useEffect(() => { updateLanguage(browserLanguage()); }, []);

  const setLanguage = (value: Language) => {
    updateLanguage(value);
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* The selector still works. */ }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    const allowed = (element: Element | null): boolean => {
      if (!element) return false;
      return !element.closest('[data-i18n-skip], [translate="no"], [contenteditable="true"]') &&
        !excludedTags.has(element.tagName);
    };

    const applyText = (node: Text) => {
      if (!allowed(node.parentElement)) return;
      const current = node.data;
      if (appliedText.current.get(node) !== current) originalText.current.set(node, current);
      const source = originalText.current.get(node) ?? current;
      const value = translateUI(source, language);
      // <option> without an explicit value uses its text as the submitted value.
      // Preserve that Spanish value before changing the visible option label.
      const option = node.parentElement?.closest("option");
      if (option && !option.hasAttribute("value") && current !== value) {
        option.setAttribute("value", option.value);
      }
      appliedText.current.set(node, value);
      if (current !== value) node.data = value;
    };

    const applyAttributes = (element: Element) => {
      // Textareas contain editable text, but their placeholders still need localization.
      if (element.closest('[data-i18n-skip], [translate="no"], [contenteditable="true"]') ||
          ["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return;
      const originals = originalAttributes.current.get(element) ?? new Map<string, string>();
      const applied = appliedAttributes.current.get(element) ?? new Map<string, string>();
      for (const attr of translatableAttributes) {
        const current = element.getAttribute(attr);
        if (current === null) continue;
        if (applied.get(attr) !== current) originals.set(attr, current);
        const source = originals.get(attr) ?? current;
        const value = translateUI(source, language);
        applied.set(attr, value);
        if (value !== current) element.setAttribute(attr, value);
      }
      originalAttributes.current.set(element, originals);
      appliedAttributes.current.set(element, applied);
    };

    const scan = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) { applyText(node as Text); return; }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const root = node as Element;
      applyAttributes(root);
      if (!allowed(root)) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let next: Node | null;
      while ((next = walker.nextNode())) {
        if (next.nodeType === Node.TEXT_NODE) applyText(next as Text);
        else applyAttributes(next as Element);
      }
    };

    if (document.body) scan(document.body);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") applyText(record.target as Text);
        else if (record.type === "attributes") applyAttributes(record.target as Element);
        else for (const node of Array.from(record.addedNodes)) scan(node);
      }
    });
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true, attributes: true,
      attributeFilter: [...translatableAttributes],
    });
    return () => observer.disconnect();
  }, [language]);

  const context = useMemo(() => ({
    language, setLanguage, t: (value: string) => translateUI(value, language),
  }), [language]);
  return <LanguageContext.Provider value={context}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage requires LanguageProvider");
  return value;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <label className="language-switcher" data-i18n-skip>
    <span className="sr-only">{language === "es" ? "Idioma" : "Language"}</span>
    <select aria-label={language === "es" ? "Seleccionar idioma" : "Choose language"}
      value={language} onChange={event => setLanguage(event.target.value as Language)}>
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  </label>;
}
