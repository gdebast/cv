import { setToArray } from "../../toarray/toarray";

export class DirectedGraphLevel {
  /** object representing a level in a directed graph.
   * @param {integer} levelNr level number
   */
  constructor(levelNr) {
    this._levelNr = levelNr;
    this._nodes = new Set();
  }

  get number() {
    return this._levelNr;
  }

  /** add a node this level.
   * @param {DirectedGraphNode} node node belonging to this level.
   */
  addNode(node) {
    if (this._nodes.has(node)) return;
    if (node.level) node.level._nodes.delete(node);
    node._setLevel(this);
    this._nodes.add(node);
  }

  /** return the array of nodes inside the level.
   * @returns {Array<DirectedGraphNode>} nodes in the level.
   */
  get nodes() {
    return setToArray(this._nodes);
  }
}
