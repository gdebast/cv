import { ASSERT_EXIST, ASSERT_TYPE } from "../../utility/assert/assert";
import { DirectedGraph } from "../../utility/directedgraph/directedgraph";
import { mapToArray } from "../../utility/toarray/toarray";

/** wrapper class to add attributes to a DirectedGraph
 */
class DirectedGraphWrapper {
  constructor(name, id) {
    this._graph = new DirectedGraph();
    this._name = name;
    this._id = id;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
}
/** responsible for keeping all the graph made by the user
 */
export class GraphPool {
  constructor() {
    this._graph = new Map();
    this._onCreateAndDeleteObservers = [];
  }

  // returns all the graphs
  get graphs() {
    const sorting = function (g1, g2) {
      return g1.id < g2.id ? -1 : 1;
    };
    return mapToArray(this._graph, sorting);
  }

  /** add a graph with this name
   * @param {String} name name of the new graph
   */
  addGraph(name) {
    ASSERT_EXIST(undefined);
    const newId = this._graph.size;
    const newGraph = new DirectedGraphWrapper(name, newId);
    this._graph.set(newId, newGraph);
    this._onCreateAndDeleteObservers.forEach(function (obs) {
      obs.notifyGraphCreation(newGraph);
    });
  }

  /** delete a graph from the pool
   * @param {DirectedGraphWrapper} graph to delete
   */
  deleteGraph(graph) {
    ASSERT_TYPE(graph, DirectedGraphWrapper);
    this._onCreateAndDeleteObservers.forEach(function (obs) {
      obs.notifyGraphDeletion(graph);
    });
    this._graph.delete(graph.id);
  }

  /**
  /** return a graph from an Id
   *  @param {integer} id id of the graph
   */
  getById(id) {
    const graphWrapper = this._graph.get(id);
    return graphWrapper;
  }

  /** register a pool observer which will be notified on creation and deletion of Graph.
   *  This observer must implement the notifyGraphDeletion(DirectedGraphWrapper) and notifyGraphCreation(DirectedGraphWrapper).
   *  @param {Object} observer  observer to be notified later
   */
  registerObserver(observer) {
    this._onCreateAndDeleteObservers.push(observer);
  }
}
