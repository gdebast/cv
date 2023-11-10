const CLASS_DPLMOVIERUNTIMEVIEW = "dplmovie-runtime-view";
const dplMovieRuntimeViewElt = document.querySelector(
  `.${CLASS_DPLMOVIERUNTIMEVIEW}`
);

export class DPLMovieRuntimeView {
  constructor(dplMovieRuntimePool) {
    this._dateFormatter = new Intl.DateTimeFormat("en-UK");
    dplMovieRuntimePool.registerObserver(this);
  }

  /** Observer patern with DPLMovieRuntimePool.
   *  Notification method on creation event.
   */
  notifyRuntimeCreation(runtime) {
    this._addRuntimeViewElement(runtime);
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
    const type = runtime.solverType;
    const name = runtime.solverName;
    const dateStr = this._dateFormatter.format(runtime.date);
    const runtimeTxt = `${type} : ${name}`;
    const newRuntimeElt = document.createElement("div");
    const newRuntimeTitleElt = document.createElement("p");
    const newRuntimeDateElt = document.createElement("p");
    newRuntimeElt.classList.add("dplmovie-runtime-view-elt");
    newRuntimeTitleElt.classList.add("dplmovie-runtime-view-elt-title");
    newRuntimeDateElt.classList.add("dplmovie-runtime-view-elt-date");
    newRuntimeTitleElt.innerText = runtimeTxt;
    newRuntimeDateElt.innerText = dateStr;
    dplMovieRuntimeViewElt.append(newRuntimeElt);
    newRuntimeElt.append(newRuntimeTitleElt);
    newRuntimeElt.append(newRuntimeDateElt);
  }
}
