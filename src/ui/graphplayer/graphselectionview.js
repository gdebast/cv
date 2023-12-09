import { PoolSelectionViewBase } from "../poolselectionview/poolselectionviewbase";

const CLASS_SECTION = "graphplayer";

/**  ui class responsible for coordinating the side view allowing the user
 *   to see and select a DirectedGraphWrapper.
 */
export class GraphSelectionView extends PoolSelectionViewBase {
  constructor(directedGraphWrapperPool) {
    super(
      directedGraphWrapperPool,
      document.querySelector(`.${CLASS_SECTION}`)
    );
  }

  // -- PoolSelectionViewBase --
  /** create the text on the left of the delete button.
   * @param newObjectPoolElt DOM element rendering the object
   * @param poolObject pool object to render.
   */
  createInnerText(newObjectPoolElt, poolObject) {
    // create the element with the text
    const newGraphTitleElt = document.createElement("p");
    const graphName = poolObject.name;
    newGraphTitleElt.classList.add("graph-selection-view-elt-title");
    newGraphTitleElt.innerText = graphName;

    // DOM tree creation
    newObjectPoolElt.append(newGraphTitleElt);
  }
}
