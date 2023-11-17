class DirectedGraphNode {
  constructor() {
    this._outgoingArcs = [];
    this._ingoingArcs = [];
  }

  // simple getters
  get outgoingArcs() {
    return this._outgoingArcs;
  }
  get ingoingArcs() {
    return this._ingoingArcs;
  }

  // private but can be used by this module
  _addOutgoingArc(arc) {
    this._outgoingArcs.push(arc);
  }
  _addIngoingArc(arc) {
    this._ingoingArcs.push(arc);
  }
}

class DirectedGraphArc {
  constructor(fromNode, toNode) {
    this._fromNode = fromNode;
    this._toNode = toNode;
  }
  // simple getters
  get toNode() {
    return this._toNode;
  }
  get fromNode() {
    return this._toNode;
  }
}

export class DirectedGraph {
  constructor() {
    this._nodes = [];
    this._arcs = [];
  }

  /** create a Node in this graph.
   * @return the created node.
   */
  createNode() {
    const node = new DirectedGraphNode();
    this._nodes.push(node);
    return node;
  }

  /** create an Arc in this graph.
   * @param fromNode the node from which starts the graph
   * @param toNode the node to which the node is going
   * @return the created arc.
   */
  createArc(fromNode, ToNode) {
    console.assert(
      fromNode && this._nodes.includes(fromNode),
      "the from-node does not belong to the graph."
    );
    console.assert(
      ToNode && this._nodes.includes(ToNode),
      "the to-node does not belong to the graph."
    );
    const arc = new DirectedGraphArc(fromNode, ToNode);
    fromNode._addOutgoingArc(arc);
    ToNode._addIngoingArc(arc);
    this._arcs.push(arc);
    return arc;
  }
}
