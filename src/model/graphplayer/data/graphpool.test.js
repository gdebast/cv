import { DirectedGraphWrapperPool } from "./directedgraphwrapperpool";
import { PoolObserverMock } from "../../utility/poolbase/poolobservermock";

const describeGraphWrappers = function (graphWrappers) {
  return graphWrappers.map((g) => {
    return `${g.id}-${g.name}`;
  });
};

const graphPool = new DirectedGraphWrapperPool();
const observer = new PoolObserverMock(graphPool);

graphPool.addGraph("my first");
graphPool.addGraph("my second");

const graphs = graphPool.graphs;

// ==============================================
// 1. test that the graphs are correctly created.
// ==============================================
test("1. the pool should be able to create graphs", () => {
  const desc = describeGraphWrappers(graphs);
  expect(desc).toEqual(["0-my first", "1-my second"]);
});

// =============================================
// 2. test that the graphs can be located by id.
// =============================================
test("2. the pool should be able to locate graphs", () => {
  const firstgraph = graphs[0];
  const firstruntimeDesc = describeGraphWrappers([firstgraph]);
  const locatedGraphdesc = describeGraphWrappers([
    graphPool.getById(firstgraph.id),
  ]);
  expect(firstruntimeDesc).toEqual(locatedGraphdesc);
});

// =======================================
// 3. test that the Graphs can be deleted.
// =======================================
test("3. the pool should be able to delete graphs", () => {
  const firstgraph = graphs[0];
  graphPool.delete(firstgraph);
  const desc = describeGraphWrappers(graphPool.graphs);
  expect(desc).toEqual(["1-my second"]);
});

// =======================================
// 4. test the observability.
// =======================================
test("4. the pool should be oberservable", () => {
  expect(observer.observedCreateCount).toEqual(2);
  expect(observer.observedDeleteCount).toEqual(1);
});
