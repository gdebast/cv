import { ASSERT, ASSERT_EXIST } from "../assert/assert";
import { mapToArray } from "../toarray/toarray";

/** A pool base contains the base implementation of the pool including:
 *   - storing, adding, deleting, getting the stored objects
 *   - registering and notifying observer of the pool.
 */
export class PoolBase {
  // ------
  // PUBLIC
  // ------

  /** return a stored object from an Id
   *  @param {integer} id id of the stored object. It can be null.
   */
  getById(id) {
    return this._storedObjects.get(id);
  }

  /** register a pool observer which will be notified on creation and deletion of a stored object.
   *  This observer must implement the notifyRuntimeDeletion(object) and notifyRuntimeCreation(object).
   *  @param {Object} observer  observer to be notified later
   */
  registerObserver(observer) {
    this._onAddDeleteObservers.push(observer);
  }

  /** delete the given object.
   * @param {Object} object object to delete.
   */
  delete(object) {
    ASSERT_EXIST(object);
    this._onAddDeleteObservers.forEach(function (obs) {
      obs.notifyRuntimeDeletion(object);
    });
    this._storedObjects.delete(object.id);
  }

  // ---------
  // PROTECTED
  // ---------

  constructor() {
    this._storedObjects = new Map();
    this._onAddDeleteObservers = [];
    this._idCount = 0;
  }

  /** return the stored object, sorted according to the predicate.
   * @param {function} sortingFunction
   * @returns {Array} sorted stored objects
   */
  protected_getSortedObjectsAsArray(sortingFunction) {
    return mapToArray(this._storedObjects, sortingFunction);
  }

  /** make a new id for the stored objects
   * @returns {integer} new id.
   */
  protected_makeNewId() {
    return this._idCount++;
  }

  /** add a new object.
   * @param {Object} object object to add
   * @param {Integer} id id of the object
   */
  protected_addStoredObject(object, id) {
    ASSERT_EXIST(object);
    ASSERT(this._storedObjects.get(id) == null, `The ${id} is already taken.`);
    this._storedObjects.set(id, object);
    this._onAddDeleteObservers.forEach(function (obs) {
      obs.notifyRuntimeCreation(object);
    });
  }
}
