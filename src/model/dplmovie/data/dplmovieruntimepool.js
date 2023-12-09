import { ASSERT_TYPE } from "../../utility/assert/assert";
import { PoolBase } from "../../utility/poolbase/poolbase";

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

export class DPLMovieRuntimePool extends PoolBase {
  // returns all the runtime
  get runtimes() {
    const sortRuntimes = function (r1, r2) {
      return r1.date < r2.date ? -1 : 1;
    };
    return this.protected_getSortedObjectsAsArray(sortRuntimes);
  }

  /** add a runtime to the pool.
   *  @param {String} solverType  type of the solver from which this runtime is from
   *  @param {String} solverName  name of the solver
   *  @param {Date}   runtimeDate date when the solver was run
   */
  addRuntime(solverType, solverName, runtimeDate) {
    ASSERT_TYPE(runtimeDate, Date);
    const newRuntimeId = this.protected_makeNewId();
    const newRuntime = new DPLMovieRuntime(
      newRuntimeId,
      solverType,
      solverName,
      runtimeDate
    );
    this.protected_addStoredObject(newRuntime, newRuntimeId);
  }

  /** delete the given DPLMovieRuntime from the pool.
   *  @param {DPLMovieRuntime} runtime  DPLMovieRuntime to delete
   */
  deleteRuntime(runtime) {
    ASSERT_TYPE(runtime, DPLMovieRuntime);
    this.protected_deleteStoredObject(runtime);
  }
}
