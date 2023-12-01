import { DirectedGraphLevel } from "./directedgraphlevel";
import { DirectedGraphCycle } from "./directedgraphcycle";
import { DirectedGraphCluster } from "./directedgraphcluster";
import { ASSERT, ASSERT_EXIST, ASSERT_TYPE } from "../../assert/assert";

class DirectedGraphPathSegment {
  constructor(node, arc) {
    this._node = node;
    this._arc = arc;
  }

  get arc() {
    return this._arc;
  }

  get node() {
    return this._node;
  }

  /** return true if this path-segment is the same has the given path segment
   * @param {DirectedGraphPathSegment} pathSegment the path-segment to compare with this.
   * @returns true if both path-segment are the same.
   */
  isEqual(pathSegment) {
    ASSERT_TYPE(pathSegment, DirectedGraphPathSegment);
    return this._node === pathSegment._node && this._arc === pathSegment._arc;
  }
}

export class DirectedGraphLevelClusterCycleComputer {
  /** object capable of computing the level, cluster and cycles of the graph from its nodes.
   * @param {Array<DirectedGraphNode>} Nodes nodes from which computing the levels, clusters and cycles
   * @param {boolean} debug should the algorithm print debugging messages.
   */
  constructor(Nodes, debug = false) {
    this._possibleStartNodes = Nodes;
    this._possiblePathSegments = [];
    this._exploredPathSegments = [];
    this._currentPath = [];
    this._topology = [];
    this._levels = new Map();
    this._clusters = [];
    this._cycles = [];
    this._debug = debug;
    this._debugCallNr = 1;
  }

  /** compute the levels, clusters and cycles. */
  compute() {
    this._processIsolatedNodes();

    this._logStatus();

    // exploration
    while (this._isExplorationContinuing()) {
      const pathToExplore = this._findOrCreatePathSegment();

      if (pathToExplore) this._addPathSegmentToCurrentPath(pathToExplore);

      if (pathToExplore) this._discoverCluster(pathToExplore);

      if (pathToExplore) this._discoverCycles();

      if (!pathToExplore || !this._isExplorationContinuing())
        this._addPathToTopology(this._currentPath);

      this._logStatus();
    }
    if (this._currentPath.length) {
      this._addPathToTopology(this._currentPath);
      this._currentPath = [];
      this._logStatus();
    }
    this._discoverLevels();

    //final logging
    this._logResult();

    //return
    return {
      levels: this._levels,
      clusters: this._clusters,
      cycles: this._cycles,
    };
  }

  /** this method will simply find the isolated nodes (no arc connected to it)
   *  and assign them a cluster.
   */
  _processIsolatedNodes() {
    const nodesLength = this._possibleStartNodes.length;
    for (let index = nodesLength - 1; index >= 0; index--) {
      const node = this._possibleStartNodes[index];
      if (node.outgoingArcs.length === 0 && node.ingoingArcs.length === 0) {
        this._possibleStartNodes.splice(index, 1);
        const isolatedCluster = new DirectedGraphCluster();
        isolatedCluster.addNode(node);
        this._clusters.push(isolatedCluster);
        const isolatedLevel = this._findOrCreateLevel(1);
        isolatedLevel.addNode(node);
      }
    }
  }

  /** create or return find the level of this graph with that number.
   * @param {integer} levelNr the level number to find or create
   * @returns {DirectedGraphLevel} the found or created level.
   */
  _findOrCreateLevel(levelNr) {
    let level = this._levels.get(levelNr);
    if (!level) {
      level = new DirectedGraphLevel(levelNr);
      this._levels.set(levelNr, level);
    }
    return level;
  }

  /** find a path-segment or create one starting from the possible start node.
   *  this method is the only one allowed to change _exploredPathSegments
   *  and to use _generatePathSegment.
   * @returns {DirectedGraphPathSegment} found/created path-segment.
   */
  _findOrCreatePathSegment() {
    // generate from the last node of the current path first
    let pathSegmentFromCurrentpath = null;
    if (this._currentPath.length > 0) {
      pathSegmentFromCurrentpath = this._generatePathSegment(
        this._currentPath[0].arc.toNode
      );
    }
    if (pathSegmentFromCurrentpath) {
      this._exploredPathSegments.push(pathSegmentFromCurrentpath);
      return pathSegmentFromCurrentpath;
    }

    // try to find an unexplored path-segment in the possible ones
    while (this._possiblePathSegments.length > 0) {
      let possiblePathSegment = this._possiblePathSegments.shift();
      if (!this._isPathSegmentExplored(possiblePathSegment)) {
        this._exploredPathSegments.push(possiblePathSegment);
        return possiblePathSegment;
      }
    }

    // create from the first possible start node (if possible)
    if (this._possibleStartNodes.length === 0) return null;
    const possibleStartNode = this._possibleStartNodes.shift();
    if (possibleStartNode.outgoingArcs.length === 0) {
      this._topology.push(possibleStartNode);
      return null;
    }
    const returnedPathSegment = this._generatePathSegment(possibleStartNode);
    if (returnedPathSegment) {
      this._exploredPathSegments.push(returnedPathSegment);
      return returnedPathSegment;
    }

    return null;
  }

  /** generate the path-segment from a node if they were not already explored.
   * @param {DirectedGraphNode} possibleStartNode start node for the path-segment
   * @returns {DirectedGraphPathSegment} new path segment to use.
   */
  _generatePathSegment(possibleStartNode) {
    ASSERT_EXIST(possibleStartNode);
    const possibleArcs = possibleStartNode.outgoingArcs;
    const newPossiblePathSegments = possibleArcs.map(function (arc) {
      return new DirectedGraphPathSegment(possibleStartNode, arc);
    });
    let returnedPathSegment = null;
    for (const pathSegment of newPossiblePathSegments) {
      const isExplored = this._isPathSegmentExplored(pathSegment);
      if (returnedPathSegment === null && !isExplored) {
        returnedPathSegment = pathSegment;
        continue;
      }

      if (!isExplored) this._possiblePathSegments.unshift(pathSegment);
    }

    return returnedPathSegment;
  }

  /** return true if the path-segment has already been explored by this algorithm.
   * @param {DirectedGraphPathSegment} pathSegment path-segment to evaluate
   * @returns {boolean} true if the path-segment is already explored by algorithm.
   */
  _isPathSegmentExplored(pathSegment) {
    ASSERT_TYPE(pathSegment, DirectedGraphPathSegment);
    for (const exploredPathSegment of this._exploredPathSegments) {
      if (exploredPathSegment.isEqual(pathSegment)) return true;
    }
    return false;
  }

  /**
   * @returns return true if the exploration should continue
   */
  _isExplorationContinuing() {
    return (
      this._possibleStartNodes.length > 0 ||
      this._possiblePathSegments.length > 0
    );
  }

  /** move the path to the topology. The logic applies these possibilites in this order:
   *  1. if the end of the path (last to-node) is in the topology, we add the path to-nodes before this first occurence in the topology.
   *  2. if the start of the path (first from-node) is in the topology, we add the from-nodes of the path after the last occurence in the topology.
   *  3. otherwise, add at the from-nodes at the end.
   */
  _addPathToTopology(path) {
    const pathLength = path.length;
    if (pathLength === 0) return;
    const topoLength = this._topology.length;

    //1.  add to-nodes if possible
    const lastToNode = path[pathLength - 1].arc.toNode;
    let indexFound = null;
    for (let index = 0; index < topoLength; index++) {
      const node = this._topology[index];
      if (node === lastToNode) {
        indexFound = index;
        break;
      }
    }
    if (indexFound !== null) {
      let newTopology = [];
      for (let index = 0; index < indexFound; index++) {
        newTopology.push(this._topology[index]);
      }
      newTopology.push(path[0].arc.fromNode);
      for (const pathSegment of path) {
        ASSERT_TYPE(pathSegment, DirectedGraphPathSegment);
        newTopology.push(pathSegment.arc.toNode);
      }
      for (let index = indexFound + 1; index < topoLength; index++) {
        newTopology.push(this._topology[index]);
      }
      this._topology = newTopology;
      return;
    }

    //2. add from-nodes if possible.
    const startFromNode = path[0].arc.fromNode;
    indexFound = null;
    for (let index = topoLength - 1; index >= 0; index--) {
      if (startFromNode === this._topology[index]) {
        indexFound = index;
        break;
      }
    }
    if (indexFound !== null) {
      let newTopology = [];
      for (let index = 0; index < indexFound; index++) {
        newTopology.push(this._topology[index]);
      }
      for (const pathSegment of path) {
        ASSERT_TYPE(pathSegment, DirectedGraphPathSegment);
        newTopology.push(pathSegment.arc.fromNode);
      }
      newTopology.push(path[pathLength - 1].arc.toNode);
      for (let index = indexFound + 1; index < topoLength; index++) {
        newTopology.push(this._topology[index]);
      }
      this._topology = newTopology;
      return;
    }

    //3. add all from-nodes.
    const self = this;
    path.forEach(function (pathSegment) {
      ASSERT_TYPE(pathSegment, DirectedGraphPathSegment);
      self._topology.push(pathSegment.arc.fromNode);
    });
    self._topology.push(path[pathLength - 1].arc.toNode);
  }

  /** add the path-segment to the most appropriate part of the current path.
   * The new path segment is added after the first segment (starting from the last segment) which to-node is the from-node of the new segment.
   * if some path-segment were after this instance, the entire old path is moved to topology.
   * @param {DirectedGraphPathSegment} pathSegmentToAdd path-segment to place
   */
  _addPathSegmentToCurrentPath(pathSegmentToAdd) {
    ASSERT_TYPE(pathSegmentToAdd, DirectedGraphPathSegment);

    // empty current path -> simply add
    const currentPathLength = this._currentPath.length;
    if (currentPathLength === 0) {
      this._currentPath.push(pathSegmentToAdd);
      return;
    }

    // last to-node of the path is the from-node of the segment -> simply add
    const pathSegmentToAddFromNode = pathSegmentToAdd.arc.fromNode;
    if (
      this._currentPath[currentPathLength - 1].arc.toNode ===
      pathSegmentToAddFromNode
    ) {
      this._currentPath.push(pathSegmentToAdd);
      return;
    }

    /* The current is not empty and the last to-node is not the segment from-node 
    -> add the current path to the topology + seach for the last occurence of the from-node*/
    this._addPathToTopology(this._currentPath);
    for (let index = currentPathLength - 1; index >= 0; index--) {
      if (this._currentPath[index].arc.toNode === pathSegmentToAddFromNode) {
        break;
      } else {
        this._currentPath.pop();
      }
    }
    this._currentPath.push(pathSegmentToAdd);
  }

  /** log the status of the algorythm.
   */
  _logStatus() {
    if (!this._debug) return;

    console.log(`Status: ${this._debugCallNr}`);
    const indentation = "  ";
    this._logArrayOfNodes(
      indentation,
      "possibleStartNodes",
      this._possibleStartNodes
    );
    this._logArrayOfpathSegment(
      indentation,
      "possiblePathSegments",
      this._possiblePathSegments
    );
    this._logArrayOfpathSegment(
      indentation,
      "exploredPathSegments",
      this._exploredPathSegments
    );
    this._logArrayOfpathSegment(indentation, "currentPath", this._currentPath);
    this._logArrayOfNodes(indentation, "topology", this._topology);
    this._debugCallNr++;
  }

  /** log an array of nodes.
   * @param {String} indentation indentation in front of the log
   * @param {String} arrayName name of the array
   * @param {Array<DirectedGraphNode>} nodes nodes in the array
   */
  _logArrayOfNodes(indentation, arrayName, nodes) {
    const NodeStrs = nodes
      .map(function (n) {
        return n.object;
      })
      .join();
    console.log(`${indentation}${arrayName} = [${NodeStrs}]`);
  }

  /** log an array of path-segments.
   * @param {String} indentation indentation in front of the log
   * @param {String} arrayName name of the array
   * @param {Array<DirectedGraphPathSegment>} pathSegments path-segments in the array
   */
  _logArrayOfpathSegment(indentation, arrayName, pathSegments) {
    const psStrs = pathSegments
      .map(function (ps) {
        ASSERT_TYPE(ps, DirectedGraphPathSegment);
        return `${ps.node.object}->${ps.arc.object}->${ps.arc.toNode.object}`;
      })
      .join();
    console.log(`${indentation}${arrayName} = [${psStrs}]`);
  }

  _getLevelArray() {
    const discoveredLevels = [];
    this._levels.forEach((node) => {
      discoveredLevels.push(node);
    });
    return discoveredLevels;
  }

  /** log the clusters, levels and cycles */
  _logResult() {
    if (!this._debug) return;
    console.log(`Result:`);
    this._logNodeContainer(this._getLevelArray(), "Levels", "  ", true);
    this._logNodeContainer(this._clusters, "Clusters", "  ", false);
    this._logNodeContainer(this._cycles, "Cycles", "  ", false);
  }

  /** log an object containing a list of nodes.
   */
  _logNodeContainer(containers, containerName, indentation, addCounter) {
    const self = this;
    let counter = 1;
    console.log(`${indentation}${containerName}:`);
    containers.forEach(function (container) {
      self._logArrayOfNodes(
        "  " + indentation,
        (addCounter ? counter + " -> " : "") + "nodes",
        container.nodes
      );
      counter++;
    });
  }

  /** use the arc in the path segment to discover clusters.
   *  1. if both connected nodes do not have a cluster -> create one and set it on the nodes.
   *  2. if both are in the same cluster -> do nothing
   *  3. if one of the connected nodes have a cluster, but not the other -> set the cluster to node without cluster.
   *  4. if both have a cluster -> move all nodes of a cluster to the other cluster and delete the old cluster.
   * @param {DirectedGraphPathSegment} pathSegment path-segment to use
   */
  _discoverCluster(pathSegment) {
    ASSERT_TYPE(pathSegment, DirectedGraphPathSegment);

    const fromNode = pathSegment.arc.fromNode;
    const toNode = pathSegment.arc.toNode;

    // 1. both do not have a cluster
    if (fromNode.cluster === null && toNode.cluster === null) {
      const newCluster = new DirectedGraphCluster();
      this._clusters.push(newCluster);
      newCluster.addNode(fromNode);
      newCluster.addNode(toNode);
    }

    // 2. both in same cluster
    if (fromNode.cluster === toNode.cluster) return;

    // 3. one has a cluster and the other no
    if (
      (fromNode.cluster && toNode.cluster === null) ||
      (toNode.cluster && fromNode.cluster === null)
    ) {
      if (fromNode.cluster) fromNode.cluster.addNode(toNode);
      else toNode.cluster.addNode(fromNode);
      return;
    }

    //4. different cluster
    ASSERT_EXIST(fromNode.cluster);
    ASSERT_EXIST(toNode.cluster);
    const deletedCluster = fromNode.cluster;
    const keptCluster = toNode.cluster;
    const deletedClusterIndex = this._clusters.indexOf(deletedCluster);
    ASSERT(deletedClusterIndex >= 0, "Impossible to find deleted cluster.");
    this._clusters.splice(deletedClusterIndex, 1);
    deletedCluster.nodes.forEach(function (node) {
      keptCluster.addNode(node);
    });
  }

  /** this method will use the topology to set a level to each node.
   * a level of a node is max(1, max(node.ingoingArcs.fromNode.level))
   */
  _discoverLevels() {
    const self = this;
    this._topology.forEach(function (node) {
      const nodeInSameCycle = node.cycle ? node.cycle.nodes : [];

      // find all nodes below this one
      const allLowerLevelNode = [];
      node.ingoingArcs.forEach((arc) => {
        const potentielNode = arc.fromNode;
        if (potentielNode === node) return;
        if (nodeInSameCycle.includes(potentielNode)) return;
        allLowerLevelNode.push(arc.fromNode);
      });

      // find the maximum level of all node below and set the node this level+1
      let maxLowerLevel = null;
      for (const lowerNode of allLowerLevelNode) {
        if (
          !maxLowerLevel ||
          (lowerNode.level && lowerNode.level.number > maxLowerLevel.number)
        )
          maxLowerLevel = lowerNode.level;
      }
      if (maxLowerLevel)
        self._findOrCreateLevel(maxLowerLevel.number + 1).addNode(node);
      else self._findOrCreateLevel(1).addNode(node);

      // propagate to the cycle, if needed
      if (nodeInSameCycle.length > 0) {
        nodeInSameCycle.forEach((n) => {
          node.level.addNode(n);
        });
      }
    });
  }

  /** this method aims to detect cycle with the current path:
   *  1. if the current path hit itself (last to-node is one of the from-node), a cycle is detected. if a cycle is not detected, we stop.
   *  2. all nodes involves will get a new cycle. If the involved nodes are in a cycle, those cycles merge with the new.
   *  3. the last segment of the current path is removed. The next loop should back-track it.
   */
  _discoverCycles() {
    const currentPathLength = this._currentPath.length;
    if (currentPathLength === 0) return;

    // 1. cycle detection
    const lastToNode = this._currentPath[currentPathLength - 1].arc.toNode;
    let cycleDetectionIndex = currentPathLength - 1;
    let cycleDetected = false;
    while (!cycleDetected && cycleDetectionIndex >= 0) {
      cycleDetected =
        this._currentPath[cycleDetectionIndex].arc.fromNode === lastToNode;
      if (!cycleDetected) cycleDetectionIndex--;
    }

    if (!cycleDetected) return;

    // 2. assign a cycle
    ASSERT(
      cycleDetectionIndex >= 0 && currentPathLength > cycleDetectionIndex,
      `cycle detection index is wrong : currentPathLength=${currentPathLength} and cycleDetectionIndex=${cycleDetectionIndex}`
    );
    const oldCycles = [];
    const involvedNodes = [];
    for (let index = cycleDetectionIndex; index < currentPathLength; index++) {
      const involvedNode = this._currentPath[index].arc.fromNode;
      involvedNodes.push(involvedNode);
      const oldCycle = involvedNode.cycle;
      if (oldCycle) {
        oldCycles.push(oldCycle);
        const oldCycleNodes = oldCycle.nodes;
        involvedNodes.push(...oldCycleNodes);
      }
    }
    const newCycle = new DirectedGraphCycle();
    involvedNodes.forEach((n) => {
      newCycle.addNode(n);
    });
    this._cycles.push(newCycle);

    //3. remove the last segment
    this._currentPath.pop();

    //4. remove the old cycles
    oldCycles.forEach(function (cycle) {
      ASSERT(cycle.nodes.length === 0, "an old cycle has not been emptied.");
      this._cycles.splice(this._cycles.indexOf(cycle), 1);
    });
  }
}
