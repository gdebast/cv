import { DirectedGraph } from "./directedgraph";

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
    return `${level.number}->[${level.nodes
      .map((node) => {
        return node.object;
      })
      .join()}]`;
  });
  return levelDescriptionArray;
};

const getClustersDescription = function (graph) {
  const getClusterId = function (cluster) {
    const clusterNodes = cluster.nodes;
    clusterNodes.sort((n1, n2) => {
      return n1.object < n2.object ? -1 : 1;
    });
    return clusterNodes.join("-");
  };
  // sort the clusters
  const graphClusters = graph.clusters;
  graphClusters.sort((c1, c2) => {
    return getClusterId(c1) < getClusterId(c2) ? -1 : 1;
  });
  return graphClusters.map((cluster) => {
    const clusterNodes = cluster.nodes;
    clusterNodes.sort((n1, n2) => {
      return n1.object < n2.object ? -1 : 1;
    });
    return `[${clusterNodes
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
    "4->[n8,n2,n3]",
    "5->[n6]",
    "6->[n7]",
  ]);
});

// CLUSTER
// -------
test("1.3 the graph clusters should be correct", () => {
  const clustersDescription = getClustersDescription(g1);
  expect(clustersDescription).toEqual(["[n1,n2,n3,n4,n5,n6,n7,n8]"]);
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
    "2->[n3,n2]",
    "3->[n7,n6,n5,n4]",
  ]);
});

// CLUSTER
// -------
test("2.3 the graph clusters should be correct", () => {
  const clustersDescription = getClustersDescription(g2);
  expect(clustersDescription).toEqual(["[n1,n2,n3,n4,n5,n6,n7]"]);
});
