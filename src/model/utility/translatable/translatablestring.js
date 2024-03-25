"use strict";

import { ASSERT } from "../assert/assert";

// Possible languages
export const ENG = "ENG";
export const FR = "FR";
const ALLLANGUAGES = [ENG, FR];

export class TranslatableString {
  // ------
  // PUBLIC
  // ------
  /** class representing a translatable string.
   * @param {Object} translationList object with the languages as property values and the corresponding translation for the value.
   */
  constructor(translationList) {
    this._translationList = new Map(Object.entries(translationList));
  }

  /** returns the translation in this language
   * @param {String} language
   * @returns {String} the translation
   */
  getTranslation(language) {
    ASSERT(ALLLANGUAGES.includes(language), `The language '${language}' is not recognized`);
    ASSERT(this._translationList.has(language), `The language '${language}' cannot be used to translate this string.`);
    return this._translationList.get(language);
  }
}
