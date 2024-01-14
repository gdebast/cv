import { DirectedGraphLevelClusterCycleComputer } from "./src/directedgraphlevelclustercyclecomputer";
import { ASSERT_TYPE } from "../assert/assert";

class DirectedGraphNode {
  constructor(obj) {
    this._outgoingArcs = [];
    this._ingoingArcs = [];
    this._obj = obj;
    this._initializeMetaStructures();
  }

  // simple getters and setters
  get outgoingArcs() {
    return this._outgoingArcs;
  }
  get ingoingArcs() {
    return this._ingoingArcs;
  }
  get object() {
    return this._obj;
  }
  get level() {
    return this._level;
  }
  get cycle() {
    return this._cycle;
  }
  get cluster() {
    return this._cluster;
  }

  // private but can be used by this module
  _addOutgoingArc(arc) {
    this._outgoingArcs.push(arc);
  }
  _addIngoingArc(arc) {
    this._ingoingArcs.push(arc);
  }
  _initializeMetaStructures() {
    this._level = null;
    this._cluster = null;
    this._cycle = null;
  }
  _setCluster(cluster) {
    this._cluster = cluster;
  }
  _setLevel(level) {
    this._level = level;
  }
  _setCycle(cycle) {
    this._cycle = cycle;
  }
}

class DirectedGraphArc {
  constructor(fromNode, toNode, obj) {
    this._fromNode = fromNode;
    this._toNode = toNode;
    this._obj = obj;
  }
  // simple getters
  get toNode() {
    return this._toNode;
  }
  get fromNode() {
    return this._fromNode;
  }
  get object() {
    return this._obj;
  }
}

export class DirectedGraph {
  constructor() {
    this._nodes = [];
    this._arcs = [];
    this._initializeMetaStructures();
  }

  get arcs() {
    return this._arcs;
  }

  get nodes() {
    return this._nodes;
  }

  /** returns all levels of this graph.
   * @returns {Array<DirectedGraphLevel>} all levels of this graph
   */
  get levels() {
    this.computeLevelsClustersAndCycles();
    const levelsArray = [];
    this._levels.forEach((level) => {
      levelsArray.push(level);
    });
    return levelsArray;
  }

  /** returns all clusters of this graph.
   * @returns {Array<DirectedGraphCluster>} all levels of this graph
   */
  get clusters() {
    this.computeLevelsClustersAndCycles();
    return this._clusters;
  }

  /** returns all cycles of this graph.
   * @returns {Array<DirectedGraphCycle>} all levels of this graph
   */
  get cycles() {
    this.computeLevelsClustersAndCycles();
    return this._cycles;
  }

  /** create a Node in this graph.
   * @param {Object} obj the object contained in this node (optional)
   * @returns the created node.
   */
  createNode(obj = null) {
    this._initializeMetaStructures();
    const node = new DirectedGraphNode(obj);
    this._nodes.push(node);
    return node;
  }

  /** create an Arc in this graph.
   * @param {DirectedGraphNode} fromNode the node from which starts the graph
   * @param {DirectedGraphNode} toNode the node to which the node is going
   * @param {Object} obj object contained in this node.
   * @returns the created arc.
   */
  createArc(fromNode, ToNode, obj = null) {
    ASSERT_TYPE(fromNode, DirectedGraphNode);
    ASSERT_TYPE(ToNode, DirectedGraphNode);

    this._initializeMetaStructures();
    const arc = new DirectedGraphArc(fromNode, ToNode, obj);
    fromNode._addOutgoingArc(arc);
    ToNode._addIngoingArc(arc);
    this._arcs.push(arc);
    return arc;
  }

  computeLevelsClustersAndCycles(debug = false) {
    // the levels are up to date
    if (this._levels.size > 0) return;
    this._initializeMetaStructures();

    const computer = new DirectedGraphLevelClusterCycleComputer(
      [...this._nodes] /*pass a copy */,
      debug
    );
    const result = computer.compute();
    let { levels: levels, clusters: clusters, cycles: cycles } = result;
    this._levels = levels;
    this._clusters = clusters;
    this._cycles = cycles;
  }

  /** initialize/reset the clusters, cycles and levels to empty.
   *  this method can be used before each change on a graph.
   */
  _initializeMetaStructures() {
    this._clusters = [];
    this._cycles = [];
    this._levels = new Map(); /* levelNr-level map */
    this._nodes.forEach(function (node) {
      node._initializeMetaStructures();
    });
  }
}
