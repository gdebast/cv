import { ASSERT_EXIST } from "../../../model/utility/assert/assert";

const CLASS_FORWARD_BUTTON = "dplmovie-next-event-btn";
const CLASS_BACKWARD_BUTTON = "dplmovie-previous-event-btn";
const CLASS_RESET_BUTTON = "dplmovie-restart-btn";
const CLASS_LOCALHIDDEN = "player-hidden";

/**
 *  class responsible for playing the current DPLMovieRuntime displayed.
 *  @param dplMovieRuntimeView side view of the different DPLMovie runtimes.
 */
export class DPLMovieRuntimePlayerView {
  constructor(dplMovieRuntimeView) {
    ASSERT_EXIST(dplMovieRuntimeView);
    this._dplMovieRuntimeToPlay = null;
    dplMovieRuntimeView.registerObserver(this);
    this._forwardButton = document.querySelector(`.${CLASS_FORWARD_BUTTON}`);
    this._backwardButton = document.querySelector(`.${CLASS_BACKWARD_BUTTON}`);
    this._resetButton = document.querySelector(`.${CLASS_RESET_BUTTON}`);
    ASSERT_EXIST(this._forwardButton);
    ASSERT_EXIST(this._backwardButton);
    ASSERT_EXIST(this._resetButton);
    this._connect();
    this._toggleHideIfNeeded();
  }

  // Implement the Observer pattern with DPLMovieRuntimeView.
  notifyDeletePoolObject(poolObject) {
    if (poolObject === this._dplMovieRuntimeToPlay) {
      this._dplMovieRuntimeToPlay = null;
      this._toggleHideIfNeeded();
    }
  }
  notifySelectedPoolObject(poolObject) {
    this._dplMovieRuntimeToPlay = poolObject;
    this._toggleHideIfNeeded();
  }

  // -------
  // PRIVATE
  // -------

  /** connect the different buttons.
   */
  _connect() {
    const self = this;

    // forward button click event
    this._forwardButton.addEventListener("click", function () {
      if (self._dplMovieRuntimeToPlay === null) return;
      self._dplMovieRuntimeToPlay.nextEvent();
    });

    // reset button click event
    this._resetButton.addEventListener("click", function () {
      if (self._dplMovieRuntimeToPlay === null) return;
      self._dplMovieRuntimeToPlay.installFirstEvent();
    });

    // backward button click event
    this._backwardButton.addEventListener("click", function () {
      if (self._dplMovieRuntimeToPlay === null) return;
      self._dplMovieRuntimeToPlay.previousEvent();
    });
  }

  /**
   * hide/reveal all the player buttons if it has no DPLMovieRuntime to play.
   */
  _toggleHideIfNeeded() {
    for (const button of [
      this._forwardButton,
      this._backwardButton,
      this._resetButton,
    ]) {
      if (this._dplMovieRuntimeToPlay === null)
        button.classList.add(CLASS_LOCALHIDDEN);
      else button.classList.remove(CLASS_LOCALHIDDEN);
    }
  }
}
