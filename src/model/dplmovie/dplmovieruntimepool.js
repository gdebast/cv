class DPLMovieRuntime {
  constructor(solverType, solverName, runtimeDate) {
    this._solverType = solverType;
    this._solverName = solverName;
    this._runtimeDate = runtimeDate;
  }

  // simple getters
  get solverType() {
    return this._solverType;
  }
  get solverName() {
    return this._solverName;
  }
  get date() {
    return this._runtimeDate;
  }
}

export class DPLMovieRuntimePool {
  constructor() {
    this._dplMovieRuntimes = [];
    this._onAddDeleteObservers = [];
  }

  /** add a runtime to the pool.
   *  @param {String} solverType  type of the solver from which this runtime is from
   *  @param {String} solverName  name of the solver
   *  @param {Date}   runtimeDate date when the solver was run
   */
  addRuntime(solverType, solverName, runtimeDate) {
    const newRuntime = new DPLMovieRuntime(solverType, solverName, runtimeDate);
    this._dplMovieRuntimes.push(newRuntime);
    this._onAddDeleteObservers.forEach(function (obs) {
      obs.notifyRuntimeCreation(newRuntime);
    });
  }

  // returns all the runtime
  get runtimes() {
    return this._dplMovieRuntimes;
  }

  /** register a pool observer which will be notified on creation and deletion of Runtime..
   *  This observer must implement the notifyRuntimeDeletion(DPLMovieRuntime) and notifyRuntimeCreation(DPLMovieRuntime).
   *  @param {Object} observer  observer to be notified later
   */
  registerObserver(observer) {
    this._onAddDeleteObservers.push(observer);
  }
}
