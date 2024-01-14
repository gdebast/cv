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
}
