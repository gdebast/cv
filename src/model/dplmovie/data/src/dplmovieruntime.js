"use strict";

import { ASSERT_ISSTRING } from "../../../utility/assert/assert";
import { DPLMovieRuntimeEvent } from "./runtimeevent/dplmovieruntimeevent";
import { DPLMovieTrackedObjectPool } from "./trackedobject/dplmovietrackedobjectpool";

/* represent a Deployment solver runtime movie */
export class DPLMovieRuntime {
  // ------
  // PUBLIC
  // ------

  constructor(id, solverType, solverName, runtimeDate, jsonEvents = undefined) {
    this._id = id;
    this._solverType = solverType;
    this._solverName = solverName;
    this._runtimeDate = runtimeDate;
    this._errorMessage =
      null; /*string containing error which indicates if this is valid */
    this._dplMovieRuntimeEvent =
      this._convertJsonEventsToDPLMovieRuntimeEvents(jsonEvents);
    this._dplMovieTrackedObjectPool = new DPLMovieTrackedObjectPool();
    this._currentEvent = null;
    this._firstEvent = this._findFirstOrLastEvent(false);
    this._lastEvent = this._findFirstOrLastEvent(true);
  }

  // simple getters
  get id() {
    return this._id;
  }
  get solverType() {
    return this._solverType;
  }
  get solverName() {
    return this._solverName;
  }
  get date() {
    return this._runtimeDate;
  }
  get errorMessage() {
    return this._errorMessage;
  }

  /** returns the tracked object of a given type.
   * @param {String} type type of the tracked objects.
   * @return {DPLMovieTrackedObject} tracked object in the state of the movie.
   */
  getTrackedObjects(type) {
    ASSERT_ISSTRING(type);
    return this._dplMovieTrackedObjectPool.getTrackedObjects(type);
  }

  /** install the first event such that the object are available.
   */
  installFirstEvent() {
    this._currentEvent = this._firstEvent;
    if (this._currentEvent) {
      this._dplMovieTrackedObjectPool.initialize();
      this._dplMovieTrackedObjectPool.applyEvent(this._currentEvent);
    }
  }

  /** return true if the runtime has a current event.
   *  @returns true if an event is currently installed, false otherwise.
   */
  hasCurrentEvent() {
    return this._currentEvent !== null;
  }

  /** Go to the next event. If there is no next event, install the first event.
   */
  nextEvent() {
    const nextEvent = this._getNextEvent();
    if (nextEvent === null) {
      this.installFirstEvent();
      return;
    }
    this._currentEvent = nextEvent;
    this._dplMovieTrackedObjectPool.applyEvent(this._currentEvent);
  }

  /** Go to the previous event. If there is no previous event, go to the last event.
   */
  previousEvent() {
    if (this._currentEvent === null) {
      this.installFirstEvent();
      return;
    }
    const previousEvent = this._getPreviousEvent();
    if (previousEvent === null) {
      /*we are reverting the first event, so we have to install up to the last...*/
      // TODO
      return;
    }

    this._dplMovieTrackedObjectPool.revertEvent(this._currentEvent);
    this._currentEvent = previousEvent;
  }

  // -------
  // PRIVATE
  // -------
  /** convert a list of Json event into DPLMovieRuntimeEvents.
   * @param {Array} jsonEvents json object of events to convert into DPLMovieRuntimeEvents
   * @returns the map<int,DPLMovieRuntimeEvents>. It may be empty.
   */
  _convertJsonEventsToDPLMovieRuntimeEvents(jsonEvents) {
    const createdEvents = new Map();

    if (jsonEvents === undefined) {
      return createdEvents;
    }

    if (!(jsonEvents instanceof Array)) {
      this._errorMessage = `The Events property is not an Array but a ${typeof jsonEvents}`;
      return createdEvents;
    }

    for (const jsonEvent of jsonEvents) {
      //check that the event can be constructed.
      const errormessage = this._isJsonEventValid(jsonEvent);
      if (errormessage) {
        this._errorMessage = errormessage;
        return createdEvents;
      }

      if (createdEvents.has(jsonEvent.EventId)) {
        this._errorMessage = `Duplicate event id '${jsonEvent.EventId}'`;
        return createdEvents;
      }

      const newEvent = new DPLMovieRuntimeEvent(
        jsonEvent.EventId,
        jsonEvent.EventObjects
      );
      if (newEvent.errorMessage) {
        this._errorMessage = newEvent.errorMessage;
        return createdEvents;
      }
      createdEvents.set(newEvent.id, newEvent);
    }

    // finally, fill the next and previous Event in each Event.
    let highestIdFound = false;
    let highestId = 0;
    createdEvents.forEach(function (_, id) {
      if (!highestIdFound || highestId < id) {
        highestId = id;
        highestIdFound = true;
      }
    });
    createdEvents.forEach(function (event, id) {
      let currentId = id + 1;
      while (currentId <= highestId) {
        if (createdEvents.has(currentId)) {
          event.NextEvent = createdEvents.get(currentId);
          return;
        }
        currentId++;
      }
    });
    createdEvents.forEach(function (event, _) {
      if (event.NextEvent === null) return;
      const nextEvent = event.NextEvent;
      nextEvent.PreviousEvent = event;
    });

    return createdEvents;
  }

  /** check if the json event is valid and thus can be converted into
   * @param {Object} jsonEvent event object to evaluate
   * @returns a message in case of problem or nothing in case of valid event.
   */
  _isJsonEventValid(jsonEvent) {
    if (jsonEvent.EventId === undefined)
      return `An event does not contain any EventId.`;
    if (!Number.isInteger(jsonEvent.EventId))
      return `An EventId is not a Number but a '${typeof jsonEvent.EventId}'.`;
    if (jsonEvent.EventObjects === undefined)
      return `The event '${jsonEvent.EventId}' does not contain any 'EventObjects' property`;
    if (!(jsonEvent.EventObjects instanceof Array))
      return `The event '${
        jsonEvent.EventId
      }' has a 'EventObjects' property which is not an Array but a '${typeof jsonEvent.EventObjects}'`;
    if (jsonEvent.EventObjects.length === 0)
      return `The event '${jsonEvent.EventId}' has a 'EventObjects' property which is an empty array`;
    return null;
  }

  /**
   * @param findLast if true, we are looking for the last. if false, the first.
   * @returns the first or last event in the movie.
   */
  _findFirstOrLastEvent(findLast) {
    let foundId = 0;
    let foundEvent = null;
    this._dplMovieRuntimeEvent.forEach(function (event, eventId) {
      if (findLast === false && (eventId < foundId || foundEvent === null)) {
        foundEvent = event;
        foundId = eventId;
      }
      if (findLast === true && (eventId > foundId || foundEvent === null)) {
        foundEvent = event;
        foundId = eventId;
      }
    });
    return foundEvent;
  }

  /**
   * @returns the next event of the current event.
   */
  _getNextEvent() {
    if (this._currentEvent === null) return null;
    return this._currentEvent.NextEvent;
  }

  /**
   * @returns the previous event of the current event.
   */
  _getPreviousEvent() {
    if (this._currentEvent === null) return null;
    return this._currentEvent.PreviousEvent;
  }
}
