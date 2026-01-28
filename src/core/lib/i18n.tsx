'use client';

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Lang = "en" | "my";

type TranslationKey =
  | "brand"
  | "goToCourse"
  | "startLearning"
  | "heroTitle"
  | "heroSubtitle"
  | "learningPath";

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en: {
    brand: "NestJS Learning Platform",
    goToCourse: "Go to course",
    startLearning: "Start learning",
    heroTitle: "Learn NestJS, step by step.",
    heroSubtitle: "Follow the guided lessons and track your progress as you build production-ready skills.",
    learningPath: "Learning Path",
  },
  my: {
    brand: "NestJS သင်ကြားရေး ပလက်ဖောင်း",
    goToCourse: "သင်ခန်းစာများ သို့",
    startLearning: "စတင်လေ့လာမယ်",
    heroTitle: "NestJS ကို အဆင့်လိုက် လေ့လာပါ",
    heroSubtitle: "လမ်းညွှန်သင်ခန်းစာများဖြင့် လေ့လာပြီး စွမ်းဆောင်ရည်ကို အဆင့်ဆင့် တိုးတက်သွားပါ။",
    learningPath: "သင်ကြားရေး လမ်းကြောင်း",
  },
};

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "kawii-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && (saved === "en" || saved === "my")) {
      return saved;
    }
    return "en";
  });

  const setLang = useCallback((value: Lang) => {
    setLangState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang]?.[key] ?? translations.en[key],
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return ctx;
}
