import { DPLMovieRuntimeEventObjectAttribute } from "./dplmovieruntimeeventobjectattribute";

/** represents an creation/update/deletion event of an object of a certain type.
 */
export class DPLMovieRuntimeEventObject {
  // ------
  // PUBLIC
  // ------
  constructor(objectClass, objectId, eventType, jsonObjectAttributes) {
    this._objectClass = objectClass;
    this._objectId = objectId;
    this._eventType = eventType;
    this._errorMessage =
      null; /*string containing error which indicates if this is valid */
    this._objectAttributes =
      this._convertJsonObjectAttributeToDPLMovieRuntimeEventObjectAttributes(
        jsonObjectAttributes
      );
  }

  // simple getters
  get errorMessage() {
    return this._errorMessage;
  }
  get Type() {
    return this._eventType;
  }
  get ObjectClassId() {
    return this._objectClass;
  }
  get ObjectId() {
    return this._objectId;
  }
  get Attributes() {
    return this._objectAttributes;
  }

  // -------
  // PRIVATE
  // -------

  /** convert an array of json object attributes to a DPLMovieRuntimeEventObjectAttributes
   * @param {Array<Object>} jsonObjectAttributes json objects to convert.
   * @returns {Array<DPLMovieRuntimeEventObjectAttributes>} created DPLMovieRuntimeEventObjectAttributes
   */
  _convertJsonObjectAttributeToDPLMovieRuntimeEventObjectAttributes(
    jsonObjectAttributes
  ) {
    const eventObjectAttributes = [];

    if (jsonObjectAttributes === undefined) return eventObjectAttributes;

    for (const jsonObjectAttribute of jsonObjectAttributes) {
      const isNotValidMessage =
        this._isJsonEventObjectAttributeValid(jsonObjectAttribute);
      if (isNotValidMessage) {
        this._errorMessage = isNotValidMessage;
        return eventObjectAttributes;
      }

      const newAttribute = new DPLMovieRuntimeEventObjectAttribute(
        jsonObjectAttribute.Name,
        jsonObjectAttribute.Type,
        jsonObjectAttribute.Value
      );

      const newAttributeErrorMessage = newAttribute.errorMessage;
      if (newAttributeErrorMessage) {
        this._errorMessage = newAttributeErrorMessage;
        return eventObjectAttributes;
      }

      eventObjectAttributes.push(newAttribute);
    }

    return eventObjectAttributes;
  }

  /** return a message explaining why the json object cannot be converted to DPLMovieRuntimeEventObjectAttribute.
   * @param {Object} jsonObjectAttribute
   * @returns message explaning the object is invalid.
   */
  _isJsonEventObjectAttributeValid(jsonObjectAttribute) {
    // check attribute name
    if (jsonObjectAttribute.Name === undefined)
      return `There is one Event Object Attribute without any 'Name' property.`;
    if (
      typeof jsonObjectAttribute.Name !== "string" &&
      !(jsonObjectAttribute.Name instanceof String)
    )
      return `There is one Event Object Attribute which 'Name' property is not a string but a '${typeof jsonObjectAttribute.Name}'.`;

    // check attribute value
    if (jsonObjectAttribute.Value === undefined)
      return `There is one Event Object Attribute with name '${jsonObjectAttribute.Name}' without any 'Value' property.`;
    if (
      typeof jsonObjectAttribute.Value !== "string" &&
      !(jsonObjectAttribute.Value instanceof String) &&
      typeof jsonObjectAttribute.Value !== "number" &&
      !(jsonObjectAttribute.Value instanceof Number) &&
      typeof jsonObjectAttribute.Value !== "boolean" &&
      !(jsonObjectAttribute.Value instanceof Boolean) &&
      !(jsonObjectAttribute.Value instanceof Array)
    )
      return `There is one Event Object Attribute with name '${
        jsonObjectAttribute.Name
      }' which 'Value' property is not a string, a boolean, an array or a number but a '${typeof jsonObjectAttribute.Value}'.`;

    // check attribute type
    if (jsonObjectAttribute.Type === undefined)
      return `There is one Event Object Attribute with name '${jsonObjectAttribute.Name}' and value '${jsonObjectAttribute.Value}', without any 'Type' property.`;
    if (
      typeof jsonObjectAttribute.Type !== "string" &&
      !(jsonObjectAttribute.Type instanceof String)
    )
      return `There is one Event Object Attribute with name '${
        jsonObjectAttribute.Name
      }' and value '${
        jsonObjectAttribute.Value
      }', which 'Type' property is not a string but a '${typeof jsonObjectAttribute.Value}'.`;

    return null;
  }
}
