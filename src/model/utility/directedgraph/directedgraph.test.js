import { DirectedGraph } from "./directedgraph";

// ========================================
// 1. test a directed graph without cycles.
// ========================================
const g1 = new DirectedGraph();
const n1 = g1.createNode("n1");
const n2 = g1.createNode("n2");
const n3 = g1.createNode("n3");
const n4 = g1.createNode("n4");
const n5 = g1.createNode("n5");
const n6 = g1.createNode("n6");
const n7 = g1.createNode("n7");
const n8 = g1.createNode("n8");
g1.createArc(n5, n4, "a11");
g1.createArc(n4, n1, "a8");
g1.createArc(n5, n1, "a9");
g1.createArc(n1, n3, "a1");
g1.createArc(n1, n8, "a2");
g1.createArc(n1, n2, "a3");
g1.createArc(n8, n6, "a4");
g1.createArc(n2, n7, "a5");
g1.createArc(n6, n7, "a7");
g1.computeLevelsClustersAndCycles();

// REPRESENTATION
// --------------
test("1.1 the graph should correctly represents the desired structure", () => {
  const graphArcs = g1.arcs;
  graphArcs.sort((arc1, arc2) => {
    return arc1.object < arc2.object ? -1 : 1;
  });
  const graphDescriptionArray = graphArcs.map((arc) => {
    return `${arc.fromNode.object}->${arc.object}->${arc.toNode.object}`;
  });

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
test("1.2 the graph levels should be correct", () => {
  const graphlevels = g1.levels;
  console.log(graphlevels.length);
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

  expect(levelDescriptionArray).toEqual([
    "1->[n5]",
    "2->[n4]",
    "3->[n1]",
    "4->[n8,n2,n3]",
    "5->[n6]",
    "6->[n7]",
  ]);
});
