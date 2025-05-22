import {findRootByMode} from "@sayyyat/smart-i18n/lib/paths.js";
import path from "path";

const LIBRARY_FLAG_KEY = "smart-i18n-react-library"

/**
 * @typedef {"consumer" | "self"} ProjectMode
 *
 * Mode explanation:
 * - "consumer": Refers to the end user's project that installs and uses the smart-i18n package.
 * - "self": Refers to the smart-i18n package itself (the library's own root).
 */

/**
 * Joins a given path from the root of the resolved project mode.
 * @param {ProjectMode} mode - Either "consumer" or "self"
 * @param {string[]} segments - Path segments relative to root
 * @returns {string} - Absolute path
 */
export function joinRootPathByMode(mode, segments) {
    return path.join(findRootByMode(mode, LIBRARY_FLAG_KEY), ...segments);
}

// === Public API === //

/**
 * Returns the root path of the consumer project (i.e., the app using smart-i18n)
 */
export function getConsumerRoot() {
    return findRootByMode("consumer", LIBRARY_FLAG_KEY);
}

/**
 * Returns the root path of the smart-i18n package itself
 */
export function getLibraryRoot() {
    return findRootByMode("self", LIBRARY_FLAG_KEY);
}

/**
 * Resolves an absolute path from the consumer project root
 * @param  {...string} segments - Path segments
 */
export function getPathFromConsumerRoot(...segments) {
    return joinRootPathByMode(getConsumerRoot(), segments);
}

/**
 * Resolves an absolute path from the smart-i18n package root
 * @param  {...string} segments - Path segments
 */
export function getPathFromLibraryRoot(...segments) {
    return joinRootPathByMode(getLibraryRoot(), segments);
}