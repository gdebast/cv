import { ASSERT } from "../../model/utility/assert/assert";

const CLASS_VIEW = "pool-selection-view";
const CLASS_VIEWELT = "pool-selection-view-elt";
const CLASS_SECTION = "graphplayer";
const graphPlayerSection = document.querySelector(`.${CLASS_SECTION}`);
const graphSelectionViewElt = graphPlayerSection.querySelector(
  `.${CLASS_VIEW}`
);

const HTML_DELLETEICON =
  '<svg xmlns="http://www.w3.org/2000/svg" class="app-btn-icon-small" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>';

/**  ui class responsible for coordinating the side view allowing the user
 *   to see and select a DirectedGraphWrapper.
 */
export class GraphSelectionView {
  constructor(directedGraphWrapperPool) {
    this._graphPool = directedGraphWrapperPool;
    this._graphPool.registerObserver(this);
  }

  /** Observer patern with DirectedGraphWrapperPool.
   *  Notification method on creation event.
   */
  notifyRuntimeCreation(graph) {
    this._addGraphElement(graph);
  }
  notifyRuntimeDeletion(graph) {
    this._deleteGraphElement(graph);
  }

  // -------
  // PRIVATE
  // -------
  _addGraphElement(graph) {
    // create the main box
    const graphId = graph.id;
    const newGraphElt = document.createElement("div");
    newGraphElt.classList.add(CLASS_VIEWELT);
    newGraphElt.id = graphId;

    // create the element with the text
    const newGraphTitleElt = document.createElement("p");
    const graphName = graph.name;
    newGraphTitleElt.classList.add("graph-selection-view-elt-title");
    newGraphTitleElt.innerText = graphName;

    // create the delete button
    const newDeleteBtnElt = document.createElement("button");
    newDeleteBtnElt.classList.add("app-btn");
    newDeleteBtnElt.innerHTML = HTML_DELLETEICON;
    const pool = this._graphPool;
    newDeleteBtnElt.addEventListener("click", function () {
      const idToDelete = +newDeleteBtnElt.parentElement.attributes.id.value;
      const storedObjectToDelete = pool.getById(idToDelete);
      pool.deleteGraph(storedObjectToDelete);
    });

    // DOM tree creation
    graphSelectionViewElt.append(newGraphElt);
    newGraphElt.append(newGraphTitleElt);
    newGraphElt.append(newDeleteBtnElt);
  }

  /** remove an html elemnent in the view containing this graph.
   *  @param {Object} graph the DirectedGraphWrapper to remove from the view.
   */
  _deleteGraphElement(graph) {
    const selectorStr = `.${CLASS_VIEWELT}[id="${graph.id}"]`;
    const eltsToRemove = graphPlayerSection.querySelectorAll(selectorStr);
    ASSERT(
      eltsToRemove.length === 1,
      `Impossible to find a unique element "${typeof graph}" with "${selectorStr}"`
    );
    graphSelectionViewElt.removeChild(eltsToRemove[0]);
  }
}
