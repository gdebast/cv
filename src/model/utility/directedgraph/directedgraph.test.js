"use strict";

import { DirectedGraph } from "./directedgraph";

const sortNode = function (n1, n2) {
  return n1.object < n2.object ? -1 : 1;
};

const getNodeContainerId = function (container) {
  const nodes = container.nodes;
  nodes.sort(sortNode);
  return nodes.join("-");
};

const getGraphDescription = function (graph) {
  const graphArcs = graph.arcs;
  graphArcs.sort((arc1, arc2) => {
    return arc1.object < arc2.object ? -1 : 1;
  });
  const graphDescriptionArray = graphArcs.map((arc) => {
    return `${arc.fromNode.object}->${arc.object}->${arc.toNode.object}`;
  });
  return graphDescriptionArray;
};

const getLevelsDescription = function (graph) {
  const graphlevels = graph.levels;
  graphlevels.sort((level1, level2) => {
    return level1.number < level2.number ? -1 : 1;
  });

  const levelDescriptionArray = graphlevels.map((level) => {
    const levelNodes = level.nodes;
    levelNodes.sort(sortNode);
    return `${level.number}->[${levelNodes
      .map((node) => {
        return node.object;
      })
      .join()}]`;
  });
  return levelDescriptionArray;
};

const getNodeContainersDescription = function (containers) {
  // sort
  containers.sort((c1, c2) => {
    return getNodeContainerId(c1) < getNodeContainerId(c2) ? -1 : 1;
  });
  return containers.map((cluster) => {
    const nodes = cluster.nodes;
    nodes.sort(sortNode);
    return `[${nodes
      .map((n) => {
        return n.object;
      })
      .join()}]`;
  });
};

// ========================================
// 1. test a directed graph without cycles.
// ========================================
const g1 = new DirectedGraph();
const g1n1 = g1.createNode("n1");
const g1n2 = g1.createNode("n2");
const g1n3 = g1.createNode("n3");
const g1n4 = g1.createNode("n4");
const g1n5 = g1.createNode("n5");
const g1n6 = g1.createNode("n6");
const g1n7 = g1.createNode("n7");
const g1n8 = g1.createNode("n8");
g1.createArc(g1n5, g1n4, "a11");
g1.createArc(g1n4, g1n1, "a8");
g1.createArc(g1n5, g1n1, "a9");
g1.createArc(g1n1, g1n3, "a1");
g1.createArc(g1n1, g1n8, "a2");
g1.createArc(g1n1, g1n2, "a3");
g1.createArc(g1n8, g1n6, "a4");
g1.createArc(g1n2, g1n7, "a5");
g1.createArc(g1n6, g1n7, "a7");

// REPRESENTATION
// --------------
test("1.1 the graph should correctly represents the desired structure", () => {
  const graphDescriptionArray = getGraphDescription(g1);
  expect(graphDescriptionArray).toEqual([
    "n1->a1->n3",
    "n5->a11->n4",
    "n1->a2->n8",
    "n1->a3->n2",
    "n8->a4->n6",
    "n2->a5->n7",
    "n6->a7->n7",
    "n4->a8->n1",
    "n5->a9->n1",
  ]);
});

// LEVELS
// ------
test("1.2 the graph levels should be correct", () => {
  const levelDescriptionArray = getLevelsDescription(g1);
  expect(levelDescriptionArray).toEqual([
    "1->[n5]",
    "2->[n4]",
    "3->[n1]",
    "4->[n2,n3,n8]",
    "5->[n6]",
    "6->[n7]",
  ]);
});

// CLUSTER
// -------
test("1.3 the graph clusters should be correct", () => {
  const clustersDescription = getNodeContainersDescription(g1.clusters);
  expect(clustersDescription).toEqual(["[n1,n2,n3,n4,n5,n6,n7,n8]"]);
});

// CYCLES
// -------
test("1.4 the graph cycles should be correct", () => {
  const cyclesDescription = getNodeContainersDescription(g1.cycles);
  expect(cyclesDescription).toEqual([]);
});

// =============================================
// 2. test a directed tree graph without cycles.
// =============================================
const g2 = new DirectedGraph();
const g2n1 = g2.createNode("n1");
const g2n2 = g2.createNode("n2");
const g2n3 = g2.createNode("n3");
const g2n4 = g2.createNode("n4");
const g2n5 = g2.createNode("n5");
const g2n6 = g2.createNode("n6");
const g2n7 = g2.createNode("n7");
g2.createArc(g2n1, g2n2, "a1");
g2.createArc(g2n1, g2n3, "a2");
g2.createArc(g2n2, g2n4, "a3");
g2.createArc(g2n2, g2n5, "a4");
g2.createArc(g2n3, g2n6, "a5");
g2.createArc(g2n3, g2n7, "a6");

// REPRESENTATION
// --------------
test("2.1 the graph should correctly represents the desired structure", () => {
  const graphDescriptionArray = getGraphDescription(g2);
  expect(graphDescriptionArray).toEqual([
    "n1->a1->n2",
    "n1->a2->n3",
    "n2->a3->n4",
    "n2->a4->n5",
    "n3->a5->n6",
    "n3->a6->n7",
  ]);
});

// LEVELS
// ------
test("2.2 the graph levels should be correct", () => {
  const levelDescriptionArray = getLevelsDescription(g2);
  expect(levelDescriptionArray).toEqual([
    "1->[n1]",
    "2->[n2,n3]",
    "3->[n4,n5,n6,n7]",
  ]);
});

// CLUSTER
// -------
test("2.3 the graph clusters should be correct", () => {
  const clustersDescription = getNodeContainersDescription(g2.clusters);
  expect(clustersDescription).toEqual(["[n1,n2,n3,n4,n5,n6,n7]"]);
});

// CYCLES
// -------
test("2.4 the graph cycles should be correct", () => {
  const cyclesDescription = getNodeContainersDescription(g2.cycles);
  expect(cyclesDescription).toEqual([]);
});

// =============================================
// 3. test a diamond graph without isolate node.
// =============================================
const g3 = new DirectedGraph();
const g3n1 = g3.createNode("n1");
const g3n2 = g3.createNode("n2");
const g3n3 = g3.createNode("n3");
const g3n4 = g3.createNode("n4");
g3.createNode("n5");
g3.createArc(g3n1, g3n2, "a1");
g3.createArc(g3n1, g3n3, "a2");
g3.createArc(g3n2, g3n4, "a3");
g3.createArc(g3n3, g3n4, "a4");

// REPRESENTATION
// --------------
test("3.1 the graph should correctly represents the desired structure", () => {
  const graphDescriptionArray = getGraphDescription(g3);
  expect(graphDescriptionArray).toEqual([
    "n1->a1->n2",
    "n1->a2->n3",
    "n2->a3->n4",
    "n3->a4->n4",
  ]);
});

// LEVELS
// ------
test("3.2 the graph levels should be correct", () => {
  const levelDescriptionArray = getLevelsDescription(g3);
  expect(levelDescriptionArray).toEqual([
    "1->[n1,n5]",
    "2->[n2,n3]",
    "3->[n4]",
  ]);
});

// CLUSTER
// -------
test("3.3 the graph clusters should be correct", () => {
  const clustersDescription = getNodeContainersDescription(g3.clusters);
  expect(clustersDescription).toEqual(["[n5]", "[n1,n2,n3,n4]"]);
});

// CYCLES
// -------
test("3.4 the graph cycles should be correct", () => {
  const cyclesDescription = getNodeContainersDescription(g3.cycles);
  expect(cyclesDescription).toEqual([]);
});

// =================================
// 4. test a graph with a big cycle.
// =================================
const g4 = new DirectedGraph();
const g4n1 = g4.createNode("n1");
const g4n2 = g4.createNode("n2");
const g4n3 = g4.createNode("n3");
const g4n4 = g4.createNode("n4");
g4.createArc(g4n1, g4n2, "a1");
g4.createArc(g4n2, g4n3, "a2");
g4.createArc(g4n3, g4n4, "a3");
g4.createArc(g4n4, g4n1, "a4");

// REPRESENTATION
// --------------
test("4.1 the graph should correctly represents the desired structure", () => {
  const graphDescriptionArray = getGraphDescription(g4);
  expect(graphDescriptionArray).toEqual([
    "n1->a1->n2",
    "n2->a2->n3",
    "n3->a3->n4",
    "n4->a4->n1",
  ]);
});

// LEVELS
// ------
test("4.2 the graph levels should be correct", () => {
  const levelDescriptionArray = getLevelsDescription(g4);
  expect(levelDescriptionArray).toEqual(["1->[n1,n2,n3,n4]"]);
});

// CLUSTER
// -------
test("4.3 the graph clusters should be correct", () => {
  const clustersDescription = getNodeContainersDescription(g4.clusters);
  expect(clustersDescription).toEqual(["[n1,n2,n3,n4]"]);
});

// CYCLES
// -------
test("4.4 the graph cycles should be correct", () => {
  const cyclesDescription = getNodeContainersDescription(g4.cycles);
  expect(cyclesDescription).toEqual(["[n1,n2,n3,n4]"]);
});

// ======================================
// 5. test a graph with two small cycles.
// ======================================
const g5 = new DirectedGraph();
const g5n1 = g5.createNode("n1");
const g5n2 = g5.createNode("n2");
const g5n3 = g5.createNode("n3");
const g5n4 = g5.createNode("n4");
g5.createArc(g5n1, g5n2, "a1");
g5.createArc(g5n2, g5n1, "a2");
g5.createArc(g5n2, g5n3, "a3");
g5.createArc(g5n2, g5n4, "a4");
g5.createArc(g5n3, g5n4, "a5");
g5.createArc(g5n4, g5n3, "a6");

// REPRESENTATION
// --------------
test("5.1 the graph should correctly represents the desired structure", () => {
  const graphDescriptionArray = getGraphDescription(g5);
  expect(graphDescriptionArray).toEqual([
    "n1->a1->n2",
    "n2->a2->n1",
    "n2->a3->n3",
    "n2->a4->n4",
    "n3->a5->n4",
    "n4->a6->n3",
  ]);
});

// LEVELS
// ------
test("5.2 the graph levels should be correct", () => {
  const levelDescriptionArray = getLevelsDescription(g5);
  expect(levelDescriptionArray).toEqual(["1->[n1,n2]", "2->[n3,n4]"]);
});

// CLUSTER
// -------
test("5.3 the graph clusters should be correct", () => {
  const clustersDescription = getNodeContainersDescription(g5.clusters);
  expect(clustersDescription).toEqual(["[n1,n2,n3,n4]"]);
});

// CYCLES
// -------
test("5.4 the graph cycles should be correct", () => {
  const cyclesDescription = getNodeContainersDescription(g5.cycles);
  expect(cyclesDescription).toEqual(["[n1,n2]", "[n3,n4]"]);
});
