# i18n Architecture and Implementation

## Overview

The **i18n** system in projects powered by `smart-i18n-react` is designed to enable **type-safe**, scalable, and automated internationalization. It works seamlessly with **React**, **Next.js**, and other TypeScript environments. While translations are handled via `i18next`, the automation of keys, types, and templates is handled by `smart-i18n` scripts.

> This system promotes a static, type-enforced key structure and simplifies translation workflows through CLI tools.

---

## **File Structure**

Here is the layout of the **i18n** system files:

```plaintext
src/
├── i18n/
│   ├── generated/          // Generated files for namespaces and translation types
│   │   ├── namespaces.     // Client-side i18next initialization
│   │   └── types.d.ts      // Type-safe wrapper for translation functions
│   ├── lib/
│   │   ├── client.ts       // Client-side i18next initialization
│   │   ├── config.ts       // Configuration file for languages and fallback
│   │   ├── createTypedT.ts // Type-safe wrapper for translation functions
│   │   ├── server.ts       // Server-side i18next initialization
│   │   ├── settings.ts     // i18next initialization options
│   │   └── utils.ts        // Utility functions for locale handling
│   ├── locales/            // Translation files per language (JSON)
│   ├── types/
│   │   └── i18n.d.ts       // Type definitions for translation functions
│   └── index.ts            // Exports i18n utilities for the project
```

---

## **Key Components**

### **1. `/src/i18n/index.ts`**

This file serves as the **centralized entry point** for accessing translation functionality throughout the project. It exports the following:

* **`useTranslation`**: Custom hook for client-side translation, providing strict typing for namespaces and keys.
* **`getTranslation`**: Server-side translation utility for fetching translations in a type-safe manner.
* **Types and Constants**: Exports types like `TFunction` and constants like `languages` and `FALLBACK_LANGUAGE` for consistent usage across the app.
* **`NAMESPACES`**: A constant that holds the namespaces used in the translation files.

```ts
export { useTranslation, default as i18n } from "./lib/client";
export { getTranslation } from "./lib/server";
export { languages, FALLBACK_LANGUAGE, type TLanguage } from "./lib/config";
export { NAMESPACES } from "./generated/namespaces";
```

---

### **2. Client-Side: `/src/i18n/lib/client.ts`**

This file is responsible for initializing **i18next** on the **client-side**. It:

* Uses the **`initReactI18next`** plugin to hook into **React**.
* Loads translation files dynamically using **`resourcesToBackend`**.
* Includes a custom **type-safe wrapper** (`createStrictT`) around `useTranslation` for strict typing of namespaces and keys.

**Key Code Example**:

```ts
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      return import(`@/i18n/locales/${language}/${namespace}.json`);
    })
  )
  .init(baseInitOptions);
```

The **`useTranslation`** function is typed to ensure that developers can only access the correct translation keys for the given namespace, avoiding errors from invalid keys.

---

### **3. Server-Side: `/src/i18n/lib/server.ts`**

This file is responsible for initializing **i18next** on the **server-side**. It:

* Initializes **i18next** on the server using the `createInstance` method.
* Uses the **`getTranslation`** function to fetch translations based on the user locale, which is detected via cookies.

**Key Code Example**:

```ts
const i18nextInstance = await initI18next();
const language = await getUserLocale();
const rawT = i18nextInstance.getFixedT(language, ns);
```

This ensures that the server-side code can retrieve translations in a type-safe manner, using the `TNamespace` types to guarantee the correctness of the keys.

---

### **4. Translation Function Wrapping (`createStrictT`)**

The **`createStrictT`** function is used to create a **type-safe translation function**. It ensures that when calling `t()` inside components or server-side code, the translation keys are validated and suggestions are available in your IDE.

**Key Code Example**:

```ts
export function createStrictT<T extends TNamespace>(rawT: any, namespace: T) {
  return (key: TNamespaceTranslationKeys[T], options?: Record<string, unknown>) => {
    return rawT(key, options); // Ensure strict typing on key
  };
}
```

This adds strict typing for the translation function, improving developer experience by providing autocompletion for translation keys and namespaces in the IDE.

---

### **5. `i18n/lib/config.ts`**

This file contains basic configuration related to **languages** and **fallback language**. It defines:

* **`languages`**: A constant array of supported languages (e.g., `en`, `kk`, `ru`).
* **`FALLBACK_LANGUAGE`**: The default language used when a translation is unavailable for the selected language.
* **`COOKIE_NAME`**: The name of the cookie used for storing the user's language preference.

```ts
export const languages = ["kk", "ru", "en"] as const;
export const FALLBACK_LANGUAGE: TLanguage = "en";
export const COOKIE_NAME = "NEXT_LANGUAGE";
```

---

### **6. `i18n/lib/utils.ts`**

This file contains utility functions used for handling **user locale** detection and setting:

* **`getUserLocale`**: Retrieves the user's preferred language from cookies.
* **`setUserLocale`**: Sets the user's language preference in cookies.

```ts
export async function getUserLocale(): Promise<TLanguage> {
  return (
    ((await cookies()).get(COOKIE_NAME)?.value as TLanguage) ||
    FALLBACK_LANGUAGE
  );
}
```

These utilities are crucial for ensuring that the correct language is used across both client and server environments.

---

## **Translation Key Management**

### **Static Keys with Placeholders**

As part of the i18n system design, we follow a philosophy inspired by **Django gettext**, where translation keys are **static** and **placeholders** are used for variables (e.g., `{{username}}`).

**Example**:

```js
{t("Welcome, {{username}}", { username: data?.firstname ?? "" })}
```

This approach ensures that:

* Translation keys are static and reusable across languages.
* The translation system can handle dynamic content (e.g., user names, dates) using placeholders.
* Translations are easily processed and auto-generated, even with placeholders.

---

### **Generated Types for Translation Keys**

The translation keys and namespaces are generated using **Gulp** scripts. The **`types.d.ts`** file ensures that the translation keys are strictly typed and prevents errors in accessing the wrong keys.

```ts
export type TFunction<N extends TNamespace> = <
  K extends TNamespaceTranslationKeys[N]
>(key: K, options?: Record<string, unknown>) => string;
```

This ensures that developers only use valid translation keys and namespaces, further improving the development experience and reducing potential bugs.

---

## Summary

This i18n architecture ensures:

* 🔒 Type safety for translations
* ⚡ Fast iteration via Gulp CLI automation
* 🧩 Modular code for React/Next.js apps

To explore automated scripts powering this system, see [docs/gulp.md](./gulp.md).

---

## 📚 Related Projects

* [`@sayyyat/smart-i18n`](https://www.npmjs.com/package/@sayyyat/smart-i18n) — The core CLI engine that provides scanning, merging, and type generation.
* [`next-i18n-auth`](https://github.com/Sayyat/next-i18n-auth) — Real-world example integrating both smart-i18n and smart-i18n-react with feature-sliced architecture and multilingual auth flows.
