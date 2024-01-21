import {
  ASSERT,
  ASSERT_ISSTRING,
  ASSERT_SWITCHDEFAULT,
  ASSERT_TYPE,
} from "../../../../utility/assert/assert";
import { DPLMovieRuntimeEvent } from "../runtimeevent/dplmovieruntimeevent";
import { DPLMovieRuntimeEventObjectReferenceAttributeValue } from "../runtimeevent/dplmovieruntimeeventobjectreferenceattributevalue";
import { DPLMovieTrackedObject } from "./dplmovietrackedobject";

/** responsible for owning the tracked object.
 */
export class DPLMovieTrackedObjectPool {
  // ------
  // PUBLIC
  // ------
  constructor() {
    this.initialize();
  }

  /** apply the event by updating/creating/deleling all the tracked objects of this event.
   * @param {DPLMovieRuntimeEvent} dplMovieRuntimeEvent event to read to update the
   */
  applyEvent(dplMovieRuntimeEvent) {
    ASSERT_TYPE(dplMovieRuntimeEvent, DPLMovieRuntimeEvent);
    for (const eventObject of dplMovieRuntimeEvent.EventObjects) {
      const eventObjectType = eventObject.Type;
      ASSERT_ISSTRING(eventObjectType);
      switch (eventObjectType) {
        case "creation":
          this._createFromEventObject(eventObject);
          break;
        case "update":
          this._updateFromEventObject(eventObject);
          break;
        case "deletion":
          this._deleteFromEventObject(eventObject);
          break;
        default:
          ASSERT_SWITCHDEFAULT(eventObjectType);
      }
    }
    this._fillReferences();
  }

  getAllCurrentTrackedObjects() {
    const trackedObjects = [];
    const sorting = function (trackedObject1, trackedObject2) {
      if (trackedObject1.Type !== trackedObject2.Type)
        return trackedObject1.Id < trackedObject2.Id ? -1 : 1;
      return trackedObject1.Type < trackedObject2.Type ? -1 : 1;
    };
    this._typeId_to_trackedObjects.forEach(function (id_object_map) {
      id_object_map.forEach((object) => trackedObjects.push(object));
    });
    return trackedObjects.sort(sorting);
  }

  /** reset the pool
   */
  initialize() {
    this._typeId_to_trackedObjects = new Map();
    this._trackedObjectForWhichToFindReferences = [];
  }

  // -------
  // PRIVATE
  // -------
  /** apply the event object to the pool by deleting the corresponding tracked object.
   * @param {DPLMovieRuntimeEventObject} eventObject event to apply
   */
  _deleteFromEventObject(eventObject) {
    const id_to_trackedObjects = this._getIdToTrackedObjectMap(
      eventObject.ObjectClassId,
      eventObject.ObjectId,
      "deleted"
    );
    id_to_trackedObjects.delete(eventObject.ObjectId);
    if (
      this._typeId_to_trackedObjects.get(eventObject.ObjectClassId).size === 0
    )
      this._typeId_to_trackedObjects.delete(eventObject.ObjectClassId);
  }

  /** apply the event object to the pool by updating the corresponding tracked object.
   * @param {DPLMovieRuntimeEventObject} eventObject event to apply
   */
  _updateFromEventObject(eventObject) {
    // find the object
    const id_to_trackedObjects = this._getIdToTrackedObjectMap(
      eventObject.ObjectClassId,
      eventObject.ObjectId,
      "updated"
    );
    const trackedObjectToUpdate = id_to_trackedObjects.get(
      eventObject.ObjectId
    );

    // update the object
    for (const attribute of eventObject.Attributes) {
      // if we have to update a reference, do it after.
      if (
        this._postponeReferenceFillingIfNeeded(trackedObjectToUpdate, attribute)
      )
        continue;

      // update simple values
      trackedObjectToUpdate[attribute.Name] = attribute.Value;
    }
  }

  /** apply the event object to the pool by creating the corresponding tracked object.
   * @param {DPLMovieRuntimeEventObject} eventObject event to apply
   */
  _createFromEventObject(eventObject) {
    const objectClassId = eventObject.ObjectClassId;
    const objectId = eventObject.ObjectId;
    ASSERT(
      this._typeId_to_trackedObjects.get(objectClassId)?.get(objectId) ===
        undefined,
      `At event tracked object '${objectClassId}' with id '${objectId}' already exists`
    );
    const newTrackedObject = new DPLMovieTrackedObject(objectClassId, objectId);
    for (const attribute of eventObject.Attributes) {
      // if we have to update a reference, do it after.
      if (this._postponeReferenceFillingIfNeeded(newTrackedObject, attribute))
        continue;

      // update simple values
      newTrackedObject[attribute.Name] = attribute.Value;
    }

    // fill the map
    if (!this._typeId_to_trackedObjects.has(objectClassId)) {
      this._typeId_to_trackedObjects.set(objectClassId, new Map());
    }
    this._typeId_to_trackedObjects
      .get(objectClassId)
      .set(objectId, newTrackedObject);
  }

  /** postpone if needed the filling of this tracked object with this attribute name and value.
   * @param {DPLMovieTrackedObject} trackedObjectToUpdate tracked object for which the reference update is postponed.
   * @param {DPLMovieRuntimeEventObjectAttribute} attribute
   * @returns true if the filling of this attribute value should be postponed
   */
  _postponeReferenceFillingIfNeeded(trackedObjectToUpdate, attribute) {
    if (
      attribute.Value instanceof
        DPLMovieRuntimeEventObjectReferenceAttributeValue ||
      attribute.Value instanceof Array
    ) {
      this._trackedObjectForWhichToFindReferences.push({
        trakedObject: trackedObjectToUpdate,
        value: attribute.Value,
        name: attribute.Name,
      });
      return true;
    }
    return false;
  }

  /** fill the tracked object with references to other objects.*/
  _fillReferences() {
    for (const update of this._trackedObjectForWhichToFindReferences) {
      const trackedObjectToFill = update.trakedObject;
      if (
        update.value instanceof
        DPLMovieRuntimeEventObjectReferenceAttributeValue
      ) {
        // find the referred object
        const id_to_trackedObjects = this._getIdToTrackedObjectMap(
          update.value.ReferredObjectClassId,
          update.value.ReferredObjectId,
          "referred to"
        );
        trackedObjectToFill[update.name] = id_to_trackedObjects.get(
          update.value.ReferredObjectId
        );
        continue;
      }
      if (update.value instanceof Array) {
        const newArrayForTrackedObject = [];
        for (const referenceAttributeValue of update.value) {
          // find the referred object
          const id_to_trackedObjects = this._getIdToTrackedObjectMap(
            referenceAttributeValue.ReferredObjectClassId,
            referenceAttributeValue.ReferredObjectId,
            "referred to"
          );
          newArrayForTrackedObject.push(
            id_to_trackedObjects.get(referenceAttributeValue.ReferredObjectId)
          );
        }
        trackedObjectToFill[update.name] = newArrayForTrackedObject;
      }
      ASSERT(
        false,
        `this update of tracked object could not be read: ${update}`
      );
    }
    this._trackedObjectForWhichToFindReferences = [];
  }

  /** return the map of tracked object of this class. check also that this tracked object exists.
   * @param {String} objectClassId class to find
   * @param {String} objectId id of the tracked object to find
   * @param {String} purpose purpose of the search
   * @returns Map of the tracked Object indexed on their id.
   */
  _getIdToTrackedObjectMap(objectClassId, objectId, purpose) {
    ASSERT(
      this._typeId_to_trackedObjects.has(objectClassId),
      `Event Object with ObjectClassId '${objectClassId}' and ObjectId '${objectId}', should be ${purpose} but it is not found.`
    );
    const id_to_trackedObjects =
      this._typeId_to_trackedObjects.get(objectClassId);
    ASSERT(
      id_to_trackedObjects.has(objectId),
      `Event Object with ObjectClassId '${objectClassId}' and ObjectId '${objectId}', should be ${purpose}  but it is not found.`
    );
    return id_to_trackedObjects;
  }
}
