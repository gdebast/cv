import { ASSERT_EXIST } from "../../model/utility/assert/assert";

const CLASS_CREATEGRAPHBTN = "graphplayer-creategraph-btn";
const CLASS_GRAPHNAMEINPUT = "graphplayer-graphnameinput";

export class GraphCreationView {
  constructor(grapPool) {
    ASSERT_EXIST(grapPool);
    this._graphPool = grapPool;
    this._connectCreateButton();
  }

  /** responsible for connecting the creation button to the graph pool.
   */
  _connectCreateButton() {
    const createBtn = document.querySelector(`.${CLASS_CREATEGRAPHBTN}`);
    ASSERT_EXIST(createBtn);
    const graphNameInput = document.querySelector(`.${CLASS_GRAPHNAMEINPUT}`);
    ASSERT_EXIST(graphNameInput);
    const self = this;
    createBtn.addEventListener("click", function (event) {
      if (event.target === graphNameInput) return;
      self._graphPool.addGraph(graphNameInput.value);
      graphNameInput.value = "";
    });
  }
}
