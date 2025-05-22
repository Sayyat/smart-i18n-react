import { getPathFromConsumerRoot, getPathFromLibraryRoot } from "./paths.js";
import { copyBaseInitFiles, copyDirectoryRecursive } from "@sayyyat/smart-i18n/lib";

/**
 * Copies essential i18n files from the smart-i18n-react library into the consumer project.
 * - `.demo-env` and `i18next.config.json` (via `copyBaseInitFiles`)
 * - `/src/i18n/` directory structure from smart-i18n-react into the consumer project
 */
export function init() {
    // Copy core config files (.demo-env, i18next.config.json)
    copyBaseInitFiles();

    // Copy the default folder structure from the library to the consumer
    const libraryTemplatePath = getPathFromLibraryRoot("src", "i18n");
    const consumerSrc = getPathFromConsumerRoot("src", "i18n");
    copyDirectoryRecursive(libraryTemplatePath, consumerSrc);
}
