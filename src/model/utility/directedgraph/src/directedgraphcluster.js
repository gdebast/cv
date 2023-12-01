import { setToArray } from "../../toarray/toarray";

export class DirectedGraphCluster {
  /** object representing a cluster or independent component of a directed graph.
   */
  constructor() {
    this._nodes = new Set();
  }

  /** consider this node to be in this cluster
   * @param {DirectedGraphNode} node the node belonging to this cluster.
   */
  addNode(node) {
    if (this._nodes.has(node)) return;
    if (node.cluster) node.cluster._nodes.delete(node);
    node._setCluster(this);
    this._nodes.add(node);
  }

  /** return the array of nodes inside the cluster.
   * @returns {Array<DirectedGraphNode>} nodes in the cluster.
   */
  get nodes() {
    return setToArray(this._nodes);
  }
}
