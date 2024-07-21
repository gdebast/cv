"use strict";

/**
 * Holds and distributes the local configuration.
 */
export class LocalConfigGetter {
  constructor() {
    var localconfig = require("../../../localconfig.json");
    this._hidePhotoAndMainDescriptionAtStart =
      localconfig.hidePhotoAndMainDescriptionAtStart !== undefined ? localconfig.hidePhotoAndMainDescriptionAtStart : false;
  }

  /** tell if the photo and the title should be hidden at start up. */
  get hidePhotoAndMainDescriptionAtStart() {
    return this._hidePhotoAndMainDescriptionAtStart;
  }
}
