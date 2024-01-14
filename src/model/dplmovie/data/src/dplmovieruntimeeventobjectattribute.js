import { DPLMovieRuntimeEventObjectReferenceAttributeValue } from "./dplmovieruntimeeventobjectreferenceattributevalue";

const ARRAY_START = "Array<";
const ARRAY_END = ">";

/** represents an attribute update/creation of a tracked object during DPL solver runtime.
 */
export class DPLMovieRuntimeEventObjectAttribute {
  // ------
  // PUBLIC
  // ------
  constructor(name, type, jsonValue) {
    this._name = name;
    this._errorMessage = null;
    this._value = this._convertJsonValueToJsValue(type, jsonValue);
  }

  // simple getter
  get errorMessage() {
    return this._errorMessage;
  }

  // -------
  // PRIVATE
  // -------
  /** converts a json value into its js type
   * @param {String} type type to convert to.
   * @param jsonValue Date, Number, String, Boolean or Array of ObjectClassId to convert to a value.
   * @returns
   */
  _convertJsonValueToJsValue(type, jsonValue) {
    // simple attribute value
    if (type === "Boolean") return new Boolean(jsonValue);
    if (type === "String") return new String(jsonValue);
    if (type === "Number") return new Number(jsonValue);
    if (type === "Date") return new Date(jsonValue);

    // attribute value refering to other objects
    if (
      type.startsWith(ARRAY_START) &&
      type.startsWith(ARRAY_END) &&
      _isString(jsonValue)
    ) {
      const referredObjectClassId = type.substring(
        ARRAY_START.length,
        type.length - 1
      );
      return jsonValue.split(",").map(function (referredObjectId) {
        return new DPLMovieRuntimeEventObjectReferenceAttributeValue(
          referredObjectClassId,
          referredObjectId
        );
      });
    }
    if (this._isString(jsonValue))
      return new DPLMovieRuntimeEventObjectReferenceAttributeValue(
        type,
        jsonValue
      );

    this._errorMessage = `Impossible to parse the value '${jsonValue}' of type '${type}' in attribute '${this._name}'`;
    return null;
  }

  _isString(value) {
    return typeof value === "string" || value instanceof String;
  }
}
