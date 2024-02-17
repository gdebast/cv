"use strict";

import { ASSERT_TYPE } from "../assert/assert";
import { DirectedGraph } from "./directedgraph";

const INDENTATION_INCREMENT = "  ";

/** algorithm able to give to a directed graph nodes, a place in a 2D space.
 */
export class DirectedGraphVisualizer {
  constructor(debug) {
    this._debug = debug;
  }

  /** the algorithm. It will give a x and y property to every node in the DirectedGraph.
   * @param {DirectedGraph} directedGraph directed graph to which assigning a x-y position.
   */
  positionGraphNode(directedGraph) {
    ASSERT_TYPE(directedGraph, DirectedGraph);
    this._assignPositionBasedOnNodeLevel(directedGraph);
  }

  /** simple algorithm give a x-y base on the level.
   *  These position is a good starting point
   * @param {DirectedGraph} directedGraph directed graph to which assigning a x-y position.
   */
  _assignPositionBasedOnNodeLevel(directedGraph) {
    directedGraph.computeLevelsClustersAndCycles(this._debug);
    if (this._debug) console.log(`Start basic positionning`);

    let columnOffset = 0;
    for (const cluster of directedGraph.clusters) {
      // find all levels in the cluster
      const levelsInCluster = [];
      for (const clusterNode of cluster.nodes) {
        if (!levelsInCluster.includes(clusterNode.level))
          levelsInCluster.push(clusterNode.level);
      }

      /* for each node in the levels, the position is: 
         y=node.level.number -1
         x=columnOffset+ (node position in level) */
      let maxNumberOfNodePerLevel = 1;
      for (const clusterLevel of levelsInCluster) {
        const nodesInLevel = clusterLevel.nodes;
        maxNumberOfNodePerLevel = Math.max(
          maxNumberOfNodePerLevel,
          nodesInLevel.length
        );
        let NodePositioninLevel = 0;
        for (const node of nodesInLevel) {
          node.x = NodePositioninLevel + columnOffset;
          node.y = clusterLevel.number - 1;
          NodePositioninLevel++;
        }
      }

      columnOffset += maxNumberOfNodePerLevel;
    }

    this._logPositions(directedGraph, INDENTATION_INCREMENT);
  }

  /** log the positions of the node.
   * @param {DirectedGraph} directedGraph directed graph to log.
   * @param {String} indentation indentation of the log
   */
  _logPositions(directedGraph, indentation) {
    if (!this._debug) return;

    console.log(`${indentation}current positions (X-Y):`);
    directedGraph.nodes.forEach((node) => {
      console.log(
        `${indentation + INDENTATION_INCREMENT}'${
          node.object ? node.object : ""
        }' => (${node.x}-${node.y})`
      );
    });
  }
}
