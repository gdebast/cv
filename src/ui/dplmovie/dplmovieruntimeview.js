import { PoolSelectionViewBase } from "../poolselectionview/poolselectionviewbase";

const CLASS_DPLMOVIESECTION = "dplmovie";

export class DPLMovieRuntimeView extends PoolSelectionViewBase {
  constructor(dplMovieRuntimePool) {
    super(
      dplMovieRuntimePool,
      document.querySelector(`.${CLASS_DPLMOVIESECTION}`)
    );
    this._dateFormatter = new Intl.DateTimeFormat("en-UK");
  }

  // -- PoolSelectionViewBase --
  /** create the text on the left of the delete button.
   * @param newObjectPoolElt DOM element rendering the object
   * @param poolObject pool object to render.
   */
  createInnerText(newObjectPoolElt, poolObject) {
    // create the elements with the text
    const newRuntimeTitleElt = document.createElement("p");
    const newRuntimeDateElt = document.createElement("p");
    const type = poolObject.solverType;
    const name = poolObject.solverName;
    const dateStr = this._dateFormatter.format(poolObject.date);
    const runtimeTxt = `${type} : ${name}`;
    const newRuntimeTitleDateElt = document.createElement("div");
    newRuntimeTitleElt.classList.add("dplmovie-runtime-view-elt-title");
    newRuntimeDateElt.classList.add("dplmovie-runtime-view-elt-date");
    newRuntimeTitleElt.innerText = runtimeTxt;
    newRuntimeDateElt.innerText = dateStr;

    // DOM tree creation
    newObjectPoolElt.append(newRuntimeTitleDateElt);
    newRuntimeTitleDateElt.append(newRuntimeTitleElt);
    newRuntimeTitleDateElt.append(newRuntimeDateElt);
  }
}
