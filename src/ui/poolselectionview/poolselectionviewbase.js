import { ASSERT, ASSERT_EXIST } from "../../model/utility/assert/assert";

const CLASS_VIEW = "pool-selection-view";
const CLASS_VIEWELT = "pool-selection-view-elt";
const CLASS_SELECTEDVIEWELT = "selected-pool-selection-view-elt";

const HTML_DELLETEICON =
  '<svg xmlns="http://www.w3.org/2000/svg" class="app-btn-icon-small" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>';

/** base class for any view offer to the user
 *  to select a pool-object, to delete it and to see them all.
 *  Any derived class should implement:
 *   - createInnerText(poolObjectElt, poolObject),
 *        @param poolObjectElt DOM element rendering the object
 *        @param poolObject pool object to render
 *   - onNewClickedSelection(poolObject)
 *        @param poolObject new selected pool object
 *  This class can be observed by implementing by calling registerObserver(observer).
 *  The observer must implement:
 *   - notifyDeletePoolObject(poolObject), which is triggered when a pool object gets deleted.
 *        @param poolObject deleted object
 *   - notifySelectedPoolObject(poolObject), which is triggered when a pool object is selected.
 *        @param poolObject seleted object
 */
export class PoolSelectionViewBase {
  constructor(pool, mainSectionDOMElt) {
    ASSERT_EXIST(pool);
    ASSERT_EXIST(mainSectionDOMElt);
    this._pool = pool;
    /*contain the DOM element rendering the pool objects */
    this._view = mainSectionDOMElt.querySelector(`.${CLASS_VIEW}`);
    ASSERT_EXIST(this._view);
    this._pool.registerObserver(this);
    this._observers = [];
  }

  /** register a new observer.
   * @param observer observer.
   */
  registerObserver(observer) {
    this._observers.push(observer);
  }

  /** Observer patern with the pool:
   *  notification method on creation event.
   */
  notifyRuntimeCreation(poolObject) {
    ASSERT_EXIST(poolObject);
    this._addViewElement(poolObject);
  }
  /** Observer patern with the pool:
   *  notification method on deletion event.
   */
  notifyRuntimeDeletion(poolObject) {
    ASSERT_EXIST(poolObject);
    this._deleteViewElement(poolObject);
    this._observers.forEach(function (observer) {
      observer.notifyDeletePoolObject(poolObject);
    });
  }

  // -------
  // PRIVATE
  // -------

  /** add an html elemnent in the view rendering this pool object.
   *  @param {Object} poolObject the pool object to be rendered in the view.
   */
  _addViewElement(poolObject) {
    // create the main box
    const id = poolObject.id;
    const poolObjectElt = document.createElement("div");
    poolObjectElt.classList.add(CLASS_VIEWELT);
    poolObjectElt.id = id;

    // create the elements with the text
    this.createInnerText(poolObjectElt, poolObject);

    // create the delete button
    const newDeleteBtnElt = document.createElement("button");
    newDeleteBtnElt.classList.add("app-btn");
    newDeleteBtnElt.innerHTML = HTML_DELLETEICON;
    const pool = this._pool;
    newDeleteBtnElt.addEventListener("click", function (event) {
      const idToDelete = +newDeleteBtnElt.parentElement.attributes.id.value;
      const objectPool = pool.getById(idToDelete);
      pool.delete(objectPool);
      event.stopPropagation();
    });

    // define the click event
    const self = this;
    poolObjectElt.addEventListener("click", function () {
      self._unselectAllElementsBut(poolObjectElt);
      self.onNewClickedSelection(poolObject);
      self._observers.forEach(function (observer) {
        observer.notifySelectedPoolObject(poolObject);
      });
    });

    // DOM tree creation
    this._view.append(poolObjectElt);
    poolObjectElt.append(newDeleteBtnElt);
  }

  /** remove an html elemnent in the view containing this object.
   *  @param {Object} poolObject the pool object to remove from the view.
   */
  _deleteViewElement(poolObject) {
    const selectorStr = `.${CLASS_VIEWELT}[id="${poolObject.id}"]`;
    const eltsToRemove = this._view.querySelectorAll(selectorStr);
    ASSERT(
      eltsToRemove.length === 1,
      `Impossible to find a unique DOM element with "${selectorStr}"`
    );
    this._view.removeChild(eltsToRemove[0]);
  }

  /** unselect all element in the view but the given one
   * @param {Object} selectedDOMElt element to show selected.
   */
  _unselectAllElementsBut(selectedDOMElt) {
    this._view.childNodes.forEach((elt) => {
      elt.classList.remove(CLASS_SELECTEDVIEWELT);
    });
    selectedDOMElt.classList.add(CLASS_SELECTEDVIEWELT);
  }
}
