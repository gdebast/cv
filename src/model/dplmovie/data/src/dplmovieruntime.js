import { DPLMovieRuntimeEvent } from "./dplmovieruntimeevent";

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
    console.log(this);
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

  installFirstEvent() {
    /*TODO: this object should have a DPLMovieTrackedObjectPool which can create and own DPLMovieTrackedObject
            When we install the first event, we have to clean the Pool and tell it to read the first DPLMovieRuntimeEvent.
      */
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

    if (!jsonEvents) {
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
      createdEvents[newEvent.id] = newEvent;
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
      return `The event '${jsonEvent.EventId}' has a 'EventObjects' property which is an empty array'`;
    return null;
  }
}
