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
    this._currentEvent = this._getFirstEvent();
    if (this._currentEvent) {
      this._dplMovieTrackedObjectPool.initialize();
      this._dplMovieTrackedObjectPool.applyEvent(this._currentEvent);
    }
  }

  /** return true if the runtime a current event.
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
    //TODO
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
      const newEvent = new DPLMovieRuntimeEvent(
        jsonEvent.EventId,
        jsonEvent.EventObjects,
        jsonEvent.NextEventId !== undefined ? jsonEvent.NextEventId : null
      );
      if (newEvent.errorMessage) {
        this._errorMessage = newEvent.errorMessage;
        return createdEvents;
      }
      createdEvents.set(newEvent.id, newEvent);
    }

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
    if (
      jsonEvent.NextEventId !== undefined &&
      !Number.isInteger(jsonEvent.NextEventId)
    )
      return `The NextEventId of event '${
        jsonEvent.EventId
      }' is not a Number but '${typeof jsonEvent.NextEventId}'.`;
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

  _getFirstEvent() {
    let lowestId = 0;
    let firstEvent = null;
    this._dplMovieRuntimeEvent.forEach(function (event, eventId) {
      if (eventId < lowestId || firstEvent === null) {
        firstEvent = event;
        lowestId = eventId;
      }
    });
    return firstEvent;
  }

  _getNextEvent() {
    if (this._currentEvent === null) return null;
    if (this._currentEvent.nextEventId === null) return null;
    return this._dplMovieRuntimeEvent.get(this._currentEvent.nextEventId);
  }
}
