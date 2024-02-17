"use strict";

import { ASSERT_ISSTRING } from "../../../../utility/assert/assert";

export class DPLMovieTrackedObject {
  // ------
  // PUBLIC
  // ------
  constructor(type, id) {
    ASSERT_ISSTRING(type, String);
    ASSERT_ISSTRING(type, id);
    this._id = id;
    this._type = type;
  }

  get Id() {
    return this._id;
  }
  get Type() {
    return this._type;
  }

  /** gives all public member names.
   * @returns {Array<String>} array of public member names.
   */
  getAllPublicMemberNames() {
    const result = [];
    for (let member in this) {
      if (member.substring(0, 1) !== "_") result.push(member);
    }
    return result;
  }
}
