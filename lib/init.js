import {getPathFromLibraryRoot} from "./paths.js";
import {copyBaseInitFiles, copyDirectoryRecursive, getPathFromConsumerRoot} from "@sayyyat/smart-i18n/lib";

export function init() {
    copyBaseInitFiles();

    const libraryTemplatePath = getPathFromLibraryRoot("src", "i18n");
    const consumerSrc = getPathFromConsumerRoot("src", "i18n");
    copyDirectoryRecursive(libraryTemplatePath, consumerSrc);
}
