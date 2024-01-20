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
dplmovieRuntimePool.addRuntime(
  "Deployment Solver",
  "fairshare",
  new Date(1991, 11, 23),
  [
    {
      EventId: 0,
      EventObjects: [
        { EventType: "creation", ObjectClassId: "Bucket", ObjectId: "B1" },
      ],
    },
  ]
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
    {
      solverType: "Deployment Solver",
      solverName: "fairshare",
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
  dplmovieRuntimePool.delete(firstRuntime);
  const runtimeDesc = describeRuntimes(dplmovieRuntimePool.runtimes);
  expect(runtimeDesc).toEqual([
    {
      solverType: "Deployment Solver",
      solverName: "lotsize",
      date: new Date(1991, 11, 23),
    },
    {
      solverType: "Deployment Solver",
      solverName: "fairshare",
      date: new Date(1991, 11, 23),
    },
  ]);
});

// =======================================
// 4. test the observability.
// =======================================
test("4. the pool should be oberservable", () => {
  expect(observer.observedCreateCount).toEqual(3);
  expect(observer.observedDeleteCount).toEqual(1);
});

// =========================
// 5. test non-happy flows.
// =========================
test("5.1. events without EventId are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [{}]
  );
  expect(message).toEqual("An event does not contain any EventId.");
});
test("5.2. events without EventObjects are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [{ EventId: 0 }]
  );
  expect(message).toEqual(
    "The event '0' does not contain any 'EventObjects' property"
  );
});
test("5.3. events with empty EventObjects array, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [{ EventId: 0, EventObjects: [] }]
  );
  expect(message).toEqual(
    "The event '0' has a 'EventObjects' property which is an empty array"
  );
});
test("5.4. events with one EventObject EventType, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [{ EventId: 0, EventObjects: [{}] }]
  );
  expect(message).toEqual(
    "There is one Event Object without any 'EventType' property."
  );
});
test("5.5. events with one EventObject which EventType is not recognized, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [{ EventId: 0, EventObjects: [{ EventType: "not a type" }] }]
  );
  expect(message).toEqual(
    "The event type 'not a type' is not recognized. it should be one of the following: creation,update,deletion"
  );
});
test("5.6. events with one EventObject which ObjectClassId is not defined, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [{ EventId: 0, EventObjects: [{ EventType: "creation" }] }]
  );
  expect(message).toEqual(
    "There is one Event Object with type 'creation' which does not have a 'ObjectClassId' property."
  );
});
test("5.7. events with one EventObject which ObjectId is not defined, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [
      {
        EventId: 0,
        EventObjects: [{ EventType: "creation", ObjectClassId: "Bucket" }],
      },
    ]
  );
  expect(message).toEqual(
    "There is one Event Object with type 'creation' and class 'Bucket', which does not have a 'ObjectId' property."
  );
});
