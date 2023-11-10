const CLASS_DPLMOVIERUNTIMEVIEW = "dplmovie-runtime-view";
const CLASS_DPLMOVIERUNTIMEVIEWELT = "dplmovie-runtime-view-elt";
const dplMovieRuntimeViewElt = document.querySelector(
  `.${CLASS_DPLMOVIERUNTIMEVIEW}`
);

const HTML_DELLETEICON =
  '<svg xmlns="http://www.w3.org/2000/svg" class="app-btn-icon-small" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>';

export class DPLMovieRuntimeView {
  constructor(dplMovieRuntimePool) {
    this._dateFormatter = new Intl.DateTimeFormat("en-UK");
    this._dplMovieRuntimePool = dplMovieRuntimePool;
    this._dplMovieRuntimePool.registerObserver(this);
  }

  /** Observer patern with DPLMovieRuntimePool.
   *  Notification method on creation event.
   */
  notifyRuntimeCreation(runtime) {
    this._addRuntimeViewElement(runtime);
  }
  notifyRuntimeDeletion(runtime) {
    this._deleteRuntimeViewElement(runtime);
  }

  /** remove all elements in the view
   */
  _clear() {
    while (dplMovieRuntimeViewElt.firstChild) {
      dplMovieRuntimeViewElt.removeChild(dplMovieRuntimeViewElt.firstChild);
    }
  }

  /** add an html elemnent in the view.
   *  @param {Object} runtime the DPLMovieRuntime to be rendered in the view.
   */
  _addRuntimeViewElement(runtime) {
    // create the main box
    const runtimeId = runtime.id;
    const newRuntimeElt = document.createElement("div");
    newRuntimeElt.id = runtimeId;
    const newRuntimeTitleElt = document.createElement("p");
    const newRuntimeDateElt = document.createElement("p");

    // create the element with the text
    const type = runtime.solverType;
    const name = runtime.solverName;
    const dateStr = this._dateFormatter.format(runtime.date);
    const runtimeTxt = `${type} : ${name}`;
    const newRuntimeTitleDateElt = document.createElement("div");
    newRuntimeElt.classList.add(CLASS_DPLMOVIERUNTIMEVIEWELT);
    newRuntimeTitleElt.classList.add("dplmovie-runtime-view-elt-title");
    newRuntimeDateElt.classList.add("dplmovie-runtime-view-elt-date");
    newRuntimeTitleElt.innerText = runtimeTxt;
    newRuntimeDateElt.innerText = dateStr;

    // create the delete button
    const newRuntimeDeleteBtnElt = document.createElement("button");
    newRuntimeDeleteBtnElt.classList.add("app-btn");
    newRuntimeDeleteBtnElt.innerHTML = HTML_DELLETEICON;
    const runtimePool = this._dplMovieRuntimePool;
    newRuntimeDeleteBtnElt.addEventListener("click", function () {
      const idToDelete =
        +newRuntimeDeleteBtnElt.parentElement.attributes.id.value;
      const runtimeToDelete = runtimePool.getById(idToDelete);
      runtimePool.deleteRuntime(runtimeToDelete);
    });

    // DOM tree creation
    dplMovieRuntimeViewElt.append(newRuntimeElt);
    newRuntimeElt.append(newRuntimeTitleDateElt);
    newRuntimeElt.append(newRuntimeDeleteBtnElt);
    newRuntimeTitleDateElt.append(newRuntimeTitleElt);
    newRuntimeTitleDateElt.append(newRuntimeDateElt);
  }

  /** remove an html elemnent in the view containing this runtime.
   *  @param {Object} runtime the DPLMovieRuntime to remove from the view.
   */
  _deleteRuntimeViewElement(runtime) {
    const selectorStr = `.${CLASS_DPLMOVIERUNTIMEVIEWELT}[id="${runtime.id}"]`;
    const eltsToRemove = document.querySelectorAll(selectorStr);
    if (eltsToRemove.length !== 1)
      console.error(
        `Impossible to find a unique element with "${selectorStr}"`
      );
    dplMovieRuntimeViewElt.removeChild(eltsToRemove[0]);
  }
}
