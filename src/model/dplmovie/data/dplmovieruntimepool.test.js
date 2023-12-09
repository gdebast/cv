import { DPLMovieRuntimePool } from "./dplmovieruntimepool";
import { PoolObserverMock } from "../../utility/poolbase/poolobservermock";

// utility functions
const describeRuntimes = function (runtimes) {
  return runtimes.map((r) => {
    return { solverType: r.solverType, solverName: r.solverName, date: r.date };
  });
};

// test
const dplmovieRuntimePool = new DPLMovieRuntimePool();
const observer = new PoolObserverMock(dplmovieRuntimePool);
dplmovieRuntimePool.addRuntime(
  "Deployment Solver",
  "FIFO",
  new Date(1988, 0, 10)
);
dplmovieRuntimePool.addRuntime(
  "Deployment Solver",
  "lotsize",
  new Date(1991, 11, 23)
);
const runtimes = dplmovieRuntimePool.runtimes;

// ================================================
// 1. test that the runtimes are correctly created.
// ================================================
test("1. the pool should be able to create runtimes", () => {
  const runtimeDesc = describeRuntimes(runtimes);
  expect(runtimeDesc).toEqual([
    {
      solverType: "Deployment Solver",
      solverName: "FIFO",
      date: new Date(1988, 0, 10),
    },
    {
      solverType: "Deployment Solver",
      solverName: "lotsize",
      date: new Date(1991, 11, 23),
    },
  ]);
});

// ===============================================
// 2. test that the runtimes can be located by id.
// ===============================================
test("2. the pool should be able to locate runtimes", () => {
  const firstRuntime = runtimes[0];
  const firstruntimeDesc = describeRuntimes([firstRuntime]);
  const locatedruntimeDesc = describeRuntimes([
    dplmovieRuntimePool.getById(firstRuntime.id),
  ]);
  expect(firstruntimeDesc).toEqual(locatedruntimeDesc);
});

// =========================================
// 3. test that the runtimes can be deleted.
// =========================================
test("3. the pool should be able to delete runtimes", () => {
  const firstRuntime = runtimes[0];
  dplmovieRuntimePool.deleteRuntime(firstRuntime);
  const runtimeDesc = describeRuntimes(dplmovieRuntimePool.runtimes);
  expect(runtimeDesc).toEqual([
    {
      solverType: "Deployment Solver",
      solverName: "lotsize",
      date: new Date(1991, 11, 23),
    },
  ]);
});

// =======================================
// 4. test the observability.
// =======================================
test("3. the pool should be oberservable", () => {
  expect(observer.observedCreateCount).toEqual(2);
  expect(observer.observedDeleteCount).toEqual(1);
});
