/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";
import i18next, {type i18n} from "i18next";
import {initReactI18next, useTranslation as useI18nTranslation,} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import {NAMESPACES, type TNamespace, type  TNamespaceTranslationKeys} from "../generated";
import {COOKIE_NAME, defaultNS, FALLBACK_LANGUAGE, languages} from "./config";
import {safeT} from "./safety";

// Initialize i18next for client-side
i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
        resourcesToBackend((language: string, namespace: string) => {
            try {
                return import(`@/i18n/locales/${language}/${namespace}.json`);
            } catch (error) {
            }
        }),
    )
    .init({
        fallbackLng: FALLBACK_LANGUAGE,
        supportedLngs: languages,
        ns: NAMESPACES,
        defaultNS,
        fallbackNS: defaultNS,
        nsSeparator: ".",
        keySeparator: ".",
        load: "languageOnly",
        detection: {
            order: ["cookie", "htmlTag", "navigator"],
            caches: ["cookie"],
            lookupCookie: COOKIE_NAME, // optional, defaults to 'i18next'
        },
        react: {
            useSuspense: false,
        },
    });

export default i18next;

/*
 * type-safe wrapper around useTranslation
 */

export function useTranslation<N extends TNamespace>(
    namespace?: N,
): {
    t: <K extends TNamespaceTranslationKeys[N]>(
        key: K,
        options?: Record<string, unknown>,
    ) => string;
    i18n: i18n;
    ready: boolean;
} {
    const {t: rawT, i18n, ready} = useI18nTranslation(namespace);
    const t = safeT(rawT);
    // console.log("after safeT");
    return {t, i18n, ready};
}
