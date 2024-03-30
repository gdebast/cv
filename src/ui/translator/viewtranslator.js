"use strict";

import { ASSERT, ASSERT_EXIST, ASSERT_ISSTRING } from "../../model/utility/assert/assert";
import { ENG, FR, TranslatableString } from "../../model/utility/translatable/translatablestring";

export class ViewTranslator {
  constructor() {
    this._id_to_translatableString_map = new Map();
    this._currentLanguage = ENG;

    // register the predefined languages
    this.registerTranslatable(ENG, {
      ENG: "English",
      FR: "Anglais",
    });
    this.registerTranslatable(FR, {
      ENG: "French",
      FR: "Français",
    });
  }

  getTranslatedString(id) {
    ASSERT_ISSTRING(id);
    ASSERT(this._id_to_translatableString_map.has(id), `id '${id}' does not refer to any translatable string.`);
    const translatableString = this._id_to_translatableString_map.get(id);
    ASSERT_EXIST(translatableString);
    return translatableString.getTranslation(this._currentLanguage);
  }

  registerTranslatable(id, translationList) {
    ASSERT_ISSTRING(id);
    ASSERT(!this._id_to_translatableString_map.has(id), `id '${id}' is already used.`);
    this._id_to_translatableString_map.set(id, new TranslatableString(translationList));
  }

  /** translate the elements under the main html element given
   * @param {HTMLElement} htmlElement
   */
  translate(htmlElement) {
    ASSERT_EXIST(htmlElement);
    const self = this;
    this._id_to_translatableString_map.forEach(function (translatableString, id) {
      const elementTotranslate = htmlElement.querySelector(`#${id}`);
      if (elementTotranslate === null) return; /*there is no displayed element needing this translation*/
      elementTotranslate.textContent = translatableString.getTranslation(self._currentLanguage);
    });
  }

  setLanguage(newLanguage) {
    if (newLanguage === this._currentLanguage) return;
    this._currentLanguage = newLanguage;
    this.translate(document);
  }
}
