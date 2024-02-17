"use strict";

import { ASSERT_EXIST, ASSERT_TYPE } from "../../utility/assert/assert";
import { DirectedGraph } from "../../utility/directedgraph/directedgraph";
import { PoolBase } from "../../utility/poolbase/poolbase";

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

  get graph() {
    return this._graph;
  }
}
/** responsible for keeping all the graph made by the user
 */
export class DirectedGraphWrapperPool extends PoolBase {
  // returns all the graphs
  get graphs() {
    const sorting = function (g1, g2) {
      return g1.id < g2.id ? -1 : 1;
    };
    return this.protected_getSortedObjectsAsArray(sorting);
  }

  /** add a graph with this name
   * @param {String} name name of the new graph
   */
  addGraph(name) {
    ASSERT_EXIST(name);
    const newId = this.protected_makeNewId();
    const newGraph = new DirectedGraphWrapper(name, newId);
    this.protected_addStoredObject(newGraph, newId);
  }
}
