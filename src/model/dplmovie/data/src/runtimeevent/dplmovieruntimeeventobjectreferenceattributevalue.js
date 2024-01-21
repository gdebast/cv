/** represents an reference to a tracked object, stored in another tracked object.
 */
export class DPLMovieRuntimeEventObjectReferenceAttributeValue {
  // ------
  // PUBLIC
  // ------
  constructor(referredObjectClassId, referredObjectId) {
    this._referredObjectClassId = referredObjectClassId;
    this._referredObjectId = referredObjectId;
  }

  // simple getters
  get ReferredObjectClassId() {
    return this._referredObjectClassId;
  }
  get ReferredObjectId() {
    return this._referredObjectId;
  }
}
