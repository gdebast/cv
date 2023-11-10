class DPLMovieRuntime {
  constructor(id, solverType, solverName, runtimeDate) {
    this._id = id;
    this._solverType = solverType;
    this._solverName = solverName;
    this._runtimeDate = runtimeDate;
  }

  // simple getters
  get id() {
    return this._id;
  }
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
    this._dplMovieRuntimes = new Map();
    this._onAddDeleteObservers = [];
    this._totalNumberOfRuntime = 0;
  }

  /** add a runtime to the pool.
   *  @param {String} solverType  type of the solver from which this runtime is from
   *  @param {String} solverName  name of the solver
   *  @param {Date}   runtimeDate date when the solver was run
   */
  addRuntime(solverType, solverName, runtimeDate) {
    const newRuntimeId = this._totalNumberOfRuntime;
    const newRuntime = new DPLMovieRuntime(
      newRuntimeId,
      solverType,
      solverName,
      runtimeDate
    );
    this._dplMovieRuntimes.set(newRuntimeId, newRuntime);
    this._onAddDeleteObservers.forEach(function (obs) {
      obs.notifyRuntimeCreation(newRuntime);
    });
    this._totalNumberOfRuntime++;
  }

  /** delete the given DPLMovieRuntime from the pool.
   *  @param {Object} runtime  DPLMovieRuntime to delete
   */
  deleteRuntime(runtime) {
    this._onAddDeleteObservers.forEach(function (obs) {
      obs.notifyRuntimeDeletion(runtime);
    });
    this._dplMovieRuntimes.delete(runtime.id);
  }

  // returns all the runtime
  get runtimes() {
    const runtimes = [];
    this._dplMovieRuntimes.forEach(function (runtime) {
      runtimes.push(runtime);
    });
    return runtimes;
  }

  /** return a runtime from an Id
   *  @param {integer} id id of the runtime
   */
  getById(id) {
    const returnedRuntime = this._dplMovieRuntimes.get(id);
    return returnedRuntime;
  }

  /** register a pool observer which will be notified on creation and deletion of Runtime..
   *  This observer must implement the notifyRuntimeDeletion(DPLMovieRuntime) and notifyRuntimeCreation(DPLMovieRuntime).
   *  @param {Object} observer  observer to be notified later
   */
  registerObserver(observer) {
    this._onAddDeleteObservers.push(observer);
  }
}
