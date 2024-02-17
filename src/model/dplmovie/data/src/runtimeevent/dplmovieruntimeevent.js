"use strict";

import { ASSERT_TYPE } from "../../../../utility/assert/assert";
import { POSSIBLE_EVENT_TYPES } from "./dplmovieruntimeenventtype";
import { DPLMovieRuntimeEventObject } from "./dplmovieruntimeeventobject";

/** It is a frame of the DPL movie, which contains what has changed on objects */
export class DPLMovieRuntimeEvent {
  // ------
  // PUBLIC
  // ------
  constructor(id, jsonEventObjects) {
    this._id = id;
    this._errorMessage =
      null; /*string containing error which indicates if this is valid */
    this._eventObjects =
      this._convertJsonEventObjectsToDPLMovieRuntimeEventObject(
        jsonEventObjects
      );
    this._nextEvent = null;
    this._previousEvent = null;
  }

  // simple getter
  get id() {
    return this._id;
  }
  get EventObjects() {
    return this._eventObjects;
  }
  get errorMessage() {
    return this._errorMessage;
  }
  get NextEvent() {
    return this._nextEvent;
  }
  get PreviousEvent() {
    return this._previousEvent;
  }

  set NextEvent(nextEvent) {
    ASSERT_TYPE(nextEvent, DPLMovieRuntimeEvent);
    this._nextEvent = nextEvent;
  }
  set PreviousEvent(nextEvent) {
    ASSERT_TYPE(nextEvent, DPLMovieRuntimeEvent);
    this._previousEvent = nextEvent;
  }

  // -------
  // PRIVATE
  // -------
  /** convert the array of json into DPLMovieRuntimeEventObject.
   * @param {Array<Object>} jsonEventObjects json Event objects to convert to DPLMovieRuntimeEventObject.
   * @returns {Array<DPLMovieRuntimeEventObject>} created DPLMovieRuntimeEventObjects
   */
  _convertJsonEventObjectsToDPLMovieRuntimeEventObject(jsonEventObjects) {
    const dplMovieRuntimeEventObjects = [];
    for (const jsonEventObject of jsonEventObjects) {
      const isValidMessage = this._isJsonEventObjectValid(jsonEventObject);
      if (isValidMessage) {
        this._errorMessage = isValidMessage;
        return dplMovieRuntimeEventObjects;
      }

      const newEventObject = new DPLMovieRuntimeEventObject(
        jsonEventObject.ObjectClassId,
        jsonEventObject.ObjectId,
        jsonEventObject.EventType,
        jsonEventObject.AttributeEvents
      );

      const newEventObjectErrorMessage = newEventObject.errorMessage;
      if (newEventObjectErrorMessage) {
        this._errorMessage = newEventObjectErrorMessage;
        return dplMovieRuntimeEventObjects;
      }

      dplMovieRuntimeEventObjects.push(newEventObject);
    }

    return dplMovieRuntimeEventObjects;
  }

  /** return an error message if this json object cannot be converted into a DPLMovieRuntimeEventObject.
   * @param {Object} jsonEventObject
   * @returns error message telling why the json object is not valid, or null if valid.
   */
  _isJsonEventObjectValid(jsonEventObject) {
    // check event type
    if (jsonEventObject.EventType === undefined)
      return `There is one Event Object without any 'EventType' property.`;
    if (!POSSIBLE_EVENT_TYPES.includes(jsonEventObject.EventType))
      return `The event type '${
        jsonEventObject.EventType
      }' is not recognized. it should be one of the following: ${POSSIBLE_EVENT_TYPES.join(
        ","
      )}`;

    // check object class
    if (jsonEventObject.ObjectClassId === undefined)
      return `There is one Event Object with type '${jsonEventObject.EventType}' which does not have a 'ObjectClassId' property.`;
    if (
      typeof jsonEventObject.ObjectClassId !== "string" &&
      !(jsonEventObject.ObjectClassId instanceof String)
    )
      return `There is one Event Object with type '${
        jsonEventObject.EventType
      }' which 'ObjectClassId' property is not a string but a '${typeof jsonEventObject.ObjectClassId}' `;

    // check object id
    if (jsonEventObject.ObjectId === undefined)
      return `There is one Event Object with type '${jsonEventObject.EventType}' and class '${jsonEventObject.ObjectClassId}', which does not have a 'ObjectId' property.`;
    if (
      typeof jsonEventObject.ObjectId !== "string" &&
      !(jsonEventObject.ObjectId instanceof String)
    )
      return `There is one Event Object with type '${
        jsonEventObject.EventType
      }' and class '${
        jsonEventObject.ObjectClassId
      }', which 'ObjectClassId' property is not a string but a '${typeof jsonEventObject.ObjectClassId}' `;

    // check the attribute events
    if (
      jsonEventObject.AttributeEvents != undefined &&
      !(jsonEventObject.AttributeEvents instanceof Array)
    )
      return `There is one Event Object with type '${jsonEventObject.EventType}', class '${jsonEventObject.ObjectClassId}' and id '${jsonEventObject.ObjectClassId}', which 'AttributeEvents' property is not an Array.`;

    return null;
  }
}
