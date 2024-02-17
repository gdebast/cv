"use strict";

import { setToArray } from "../../toarray/toarray";

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

  /** return the array of nodes inside the cycle.
   * @returns {Array<DirectedGraphNode>} nodes in the cluster.
   */
  get nodes() {
    return setToArray(this._nodes);
  }
}
