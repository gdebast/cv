import { ASSERT, ASSERT_TYPE } from "../../utility/assert/assert";
import { PoolBase } from "../../utility/poolbase/poolbase";
import { DPLMovieRuntime } from "./src/dplmovieruntime";

/*class responsible for owning the DPLMovieRuntime*/
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
   *  @param {Array}  jsonEvents array of json events
   */
  addRuntime(solverType, solverName, runtimeDate, jsonEvents) {
    ASSERT_TYPE(runtimeDate, Date);
    const newRuntimeId = this.protected_makeNewId();
    const newRuntime = new DPLMovieRuntime(
      newRuntimeId,
      solverType,
      solverName,
      runtimeDate,
      jsonEvents
    );
    if (newRuntime.errorMessage) return newRuntime.errorMessage;

    /*the new runtime is added to the pool only if it is valid */
    this.protected_addStoredObject(newRuntime, newRuntimeId);
    return null;
  }
}
