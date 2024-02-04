import { DPLMovieRuntimePool } from "./dplmovieruntimepool";
import { PoolObserverMock } from "../../utility/poolbase/poolobservermock";

// utility functions
const describeRuntimes = function (runtimes) {
  return runtimes.map((r) => {
    return { solverType: r.solverType, solverName: r.solverName, date: r.date };
  });
};

/** convert a list of DPLMovieTrackedObject into a list of js object of the form:
 *  {Type: ... , Id: ..., Members: ...}
 * @param {Array<DPLMovieTrackedObject>} trackedObjects
 * @returns description list
 */
const TrackedObjectToFlatObject = function (trackedObjects) {
  return trackedObjects.map(function (trackedObject) {
    const desc = trackedObject
      .getAllPublicMemberNames()
      .filter(function (member) {
        return (
          trackedObject[member] !== null
        ); /*null values are not printed such that we can compare. */
      })
      .map(function (member) {
        if (!(trackedObject[member] instanceof Array)) {
          let memberValue = JSON.stringify(trackedObject[member]);
          return `${member}:${memberValue}`;
        }
        const ids = trackedObject[member]
          .map(function (objectReferred) {
            return objectReferred.Id;
          })
          .join();
        return `${member}:[${ids}]`;
      })
      .join();
    return { Type: trackedObject.Type, Id: trackedObject.Id, Members: desc };
  });
};

// test
const dplmovieRuntimePool = new DPLMovieRuntimePool();
const observer = new PoolObserverMock(dplmovieRuntimePool);
const errorMessage1 = dplmovieRuntimePool.addRuntime(
  "Deployment Solver",
  "FIFO",
  new Date(1988, 0, 10)
);
const errorMessage2 = dplmovieRuntimePool.addRuntime(
  "Deployment Solver",
  "lotsize",
  new Date(1991, 11, 23)
);
const errorMessage3 = dplmovieRuntimePool.addRuntime(
  "Deployment Solver",
  "fairshare",
  new Date(2000, 11, 23),
  [
    {
      EventId: 0,
      EventObjects: [
        { EventType: "creation", ObjectClassId: "Bucket", ObjectId: "B1" },
      ],
    },
    {
      EventId: 1,
      EventObjects: [
        { EventType: "creation", ObjectClassId: "Bucket", ObjectId: "B2" },
      ],
    },
    {
      EventId: 2,
      EventObjects: [
        {
          EventType: "update",
          ObjectClassId: "Bucket",
          ObjectId: "B1",
          AttributeEvents: [
            {
              Name: "EndDate",
              Type: "Date",
              Value: "2009-09-17T04:00:00Z",
              PreviousValue: null,
            },
            { Name: "Number", Type: "Number", Value: 1, PreviousValue: null },
            {
              Name: "StartDate",
              Type: "Date",
              Value: "2009-09-16T04:00:00Z",
              PreviousValue: null,
            },
          ],
        },
      ],
    },
    {
      EventId: 3,
      EventObjects: [
        {
          EventType: "deletion",
          ObjectClassId: "Bucket",
          ObjectId: "B1",
          AttributeEvents: [
            {
              Name: "EndDate",
              Type: "Date",
              PreviousValue: "2009-09-17T04:00:00Z",
            },
            { Name: "Number", Type: "Number", PreviousValue: 1 },
            {
              Name: "StartDate",
              Type: "Date",
              PreviousValue: "2009-09-16T04:00:00Z",
            },
          ],
        },
      ],
    },
    {
      EventId: 4,
      EventObjects: [
        {
          EventType: "creation",
          ObjectClassId: "BucketSeries",
          ObjectId: "Global",
          AttributeEvents: [
            { Name: "Buckets", Type: "Array<Bucket>", Value: ["B2"] },
          ],
        },
      ],
    },
  ]
);
const runtimes = dplmovieRuntimePool.runtimes;

// ================================================
// 1. test that the runtimes are correctly created.
// ================================================
test("1. the pool should be able to create runtimes", () => {
  expect(errorMessage1).toEqual(null);
  expect(errorMessage2).toEqual(null);
  expect(errorMessage3).toEqual(null);
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
      date: new Date(2000, 11, 23),
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
      date: new Date(2000, 11, 23),
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
test("5.8. events with an attribute without Name property, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [
      {
        EventId: 0,
        EventObjects: [
          {
            EventType: "creation",
            ObjectClassId: "Bucket",
            ObjectId: "B1",
            AttributeEvents: [{}],
          },
        ],
      },
    ]
  );
  expect(message).toEqual(
    "There is one Event Object Attribute without any 'Name' property."
  );
});

test("5.9. creation events with an attribute without Value property, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [
      {
        EventId: 0,
        EventObjects: [
          {
            EventType: "creation",
            ObjectClassId: "Bucket",
            ObjectId: "B1",
            AttributeEvents: [{ Name: "Number" }],
          },
        ],
      },
    ]
  );
  expect(message).toEqual(
    "There is one Event Object Attribute with name 'Number' without any 'Value' property even if it is in a 'creation' event."
  );
});

test("5.10. events with an attribute without Type property, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [
      {
        EventId: 0,
        EventObjects: [
          {
            EventType: "creation",
            ObjectClassId: "Bucket",
            ObjectId: "B1",
            AttributeEvents: [{ Name: "Number", Value: 1 }],
          },
        ],
      },
    ]
  );
  expect(message).toEqual(
    "There is one Event Object Attribute with name 'Number' and value '1', without any 'Type' property."
  );
});

test("5.11. update events with an attribute without PreviousValue property, are not accepted.", () => {
  const message = dplmovieRuntimePool.addRuntime(
    "Unhappy",
    "Unhappy",
    new Date(1988, 0, 10),
    [
      {
        EventId: 0,
        EventObjects: [
          {
            EventType: "creation",
            ObjectClassId: "Bucket",
            ObjectId: "B1",
            AttributeEvents: [{ Name: "Number", Value: 1, Type: "Number" }],
          },
        ],
      },
      {
        EventId: 1,
        EventObjects: [
          {
            EventType: "update",
            ObjectClassId: "Bucket",
            ObjectId: "B1",
            AttributeEvents: [{ Name: "Number", Type: "Number", Value: 2 }],
          },
        ],
      },
    ]
  );
  expect(message).toEqual(
    "There is one Event Object Attribute with name 'Number' without any 'PreviousValue' property even if it is in a 'update' event."
  );
});

// ===============================================
// 6. test that each runtime can be played forward
// ===============================================
test("6.1 runtime should allow to install a first event", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  const hasEventBefore = playableRuntime.hasCurrentEvent();
  playableRuntime.installFirstEvent();
  const hasEventAfter = playableRuntime.hasCurrentEvent();
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([{ Type: "Bucket", Id: "B1", Members: "" }]);
  expect(hasEventBefore).toEqual(false);
  expect(hasEventAfter).toEqual(true);
});

test("6.2 runtime should allow to go to the next event", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  const hasEventBefore = playableRuntime.hasCurrentEvent();
  playableRuntime.nextEvent();
  const hasEventAfter = playableRuntime.hasCurrentEvent();
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([
    { Type: "Bucket", Id: "B1", Members: "" },
    { Type: "Bucket", Id: "B2", Members: "" },
  ]);
  expect(hasEventBefore).toEqual(true);
  expect(hasEventAfter).toEqual(true);
});

test("6.3 runtime should handle update events", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  const hasEventBefore = playableRuntime.hasCurrentEvent();
  playableRuntime.nextEvent();
  const hasEventAfter = playableRuntime.hasCurrentEvent();
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([
    {
      Type: "Bucket",
      Id: "B1",
      Members:
        'EndDate:"2009-09-17T04:00:00.000Z",Number:1,StartDate:"2009-09-16T04:00:00.000Z"',
    },
    { Type: "Bucket", Id: "B2", Members: "" },
  ]);
  expect(hasEventBefore).toEqual(true);
  expect(hasEventAfter).toEqual(true);
});

test("6.4 runtime should handle deletion events", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  const hasEventBefore = playableRuntime.hasCurrentEvent();
  playableRuntime.nextEvent();
  const hasEventAfter = playableRuntime.hasCurrentEvent();
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([{ Type: "Bucket", Id: "B2", Members: "" }]);
  expect(hasEventBefore).toEqual(true);
  expect(hasEventAfter).toEqual(true);
});

test("6.5 runtime should handle reference to array of objects", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  const hasEventBefore = playableRuntime.hasCurrentEvent();
  playableRuntime.nextEvent();
  const hasEventAfter = playableRuntime.hasCurrentEvent();
  expect(
    TrackedObjectToFlatObject(playableRuntime.getTrackedObjects("Bucket"))
  ).toEqual([{ Type: "Bucket", Id: "B2", Members: "" }]);
  expect(
    TrackedObjectToFlatObject(playableRuntime.getTrackedObjects("BucketSeries"))
  ).toEqual([{ Type: "BucketSeries", Id: "Global", Members: "Buckets:[B2]" }]);
  expect(hasEventBefore).toEqual(true);
  expect(hasEventAfter).toEqual(true);
});

test("6.6 runtime should handle no next event by looping to the first event", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  const hasEventBefore = playableRuntime.hasCurrentEvent();
  playableRuntime.nextEvent();
  const hasEventAfter = playableRuntime.hasCurrentEvent();
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([{ Type: "Bucket", Id: "B1", Members: "" }]);
  expect(hasEventBefore).toEqual(true);
  expect(hasEventAfter).toEqual(true);
});

// ================================================
// 7. test that each runtime can be played backward
// ================================================

test("7.1 runtime should handle backtracking an creation event.", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  playableRuntime.nextEvent();
  playableRuntime.previousEvent();
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([{ Type: "Bucket", Id: "B1", Members: "" }]);
});

test("7.2 runtime should handle backtracking an update event.", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  playableRuntime.nextEvent();
  playableRuntime.nextEvent();
  playableRuntime.previousEvent();
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([
    { Type: "Bucket", Id: "B1", Members: "" },
    { Type: "Bucket", Id: "B2", Members: "" },
  ]);
});

test("7.3 runtime should handle backtracking a delete event.", () => {
  const runtimes = dplmovieRuntimePool.runtimes;
  const playableRuntime = runtimes[1];
  playableRuntime.nextEvent();
  playableRuntime.nextEvent();
  playableRuntime.previousEvent();
  console.log(playableRuntime);
  expect(
    TrackedObjectToFlatObject(runtimes[1].getTrackedObjects("Bucket"))
  ).toEqual([
    {
      Type: "Bucket",
      Id: "B1",
      Members:
        'EndDate:"2009-09-17T04:00:00.000Z",Number:1,StartDate:"2009-09-16T04:00:00.000Z"',
    },
    { Type: "Bucket", Id: "B2", Members: "" },
  ]);
});
