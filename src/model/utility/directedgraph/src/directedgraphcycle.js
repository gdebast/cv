export class DirectedGraphCycle {
  /** object representing a cycle in a directed graph.
   */
  constructor() {
    this._nodes = new Set();
  }

  /** add a node to this cycle.
   * @param {DirectedGraphNode} node node belonging to this cycle.
   */
  addNode(node) {
    if (this._nodes.has(node)) return;
    if (node.cycle) node.cycle._nodes.delete(node);
    node._setCycle(this);
    this._nodes.add(node);
  }
}
