"use strict";

/** class used to mock an observer of a pool, in the purpose of testing.
 */
export class PoolObserverMock {
  constructor(pool) {
    this.observedDeleteCount = 0;
    this.observedCreateCount = 0;
    pool.registerObserver(this);
  }

  notifyRuntimeDeletion(_) {
    this.observedDeleteCount++;
  }
  notifyRuntimeCreation(_) {
    this.observedCreateCount++;
  }
}
