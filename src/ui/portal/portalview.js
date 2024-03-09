import { PortalAppLinker } from "./src/portalapplinker";

const CLASS_APPCONTAINER = "app-container";
const CLASS_ABOUTME = "about-section";

/*Hovered animation */
const CLASS_APPCONTAINER_HOVER = "app-container-hover";
const CLASS_APPCONTAINER_HOVER_TRANSITION = "app-container-hover-transition";

/*Go animation */
const CLASS_APPCONTAINER_GO = "app-container-go";
const CLASS_APPCONTAINER_GO_TRANSITION = "app-container-go-transition";

const ALL_APP_BUTTONS = document.querySelectorAll(`.${CLASS_APPCONTAINER}`);

export class PortalView {
  constructor() {
    this._portalAppLinker = new PortalAppLinker();
    this._setupHoveredState();
    this._setupGoState();
  }

  /** setup the mouse over/out state of the app-buttons
   */
  _setupHoveredState() {
    const self = this;
    ALL_APP_BUTTONS.forEach(function (appButton) {
      appButton.addEventListener("mouseenter", function () {
        self._removeAnyTransitionCSSClasses(appButton);
        appButton.classList.add(CLASS_APPCONTAINER_HOVER_TRANSITION);
        appButton.classList.add(CLASS_APPCONTAINER_HOVER);
      });
      appButton.addEventListener("mouseleave", function () {
        self._removeAnyTransitionCSSClasses(appButton);
        appButton.classList.add(CLASS_APPCONTAINER_HOVER_TRANSITION);
        appButton.classList.remove(CLASS_APPCONTAINER_HOVER);
      });
    });
  }

  /** setup the state where every app buttons are gone bottom.
   */
  _setupGoState() {
    // wait function for delaying the go states
    const wait = function (seconds) {
      return new Promise(function (resolve) {
        setTimeout(resolve, seconds * 1000);
      });
    };
    // move a button
    const moveButton = function (btn) {
      btn.classList.add(CLASS_APPCONTAINER_GO_TRANSITION);
      btn.classList.add(CLASS_APPCONTAINER_GO);
    };

    const chainedMove = async function () {
      const totalNumberOfButtons = ALL_APP_BUTTONS.length;
      for (let index = totalNumberOfButtons - 1; index >= 0; index--) {
        moveButton(ALL_APP_BUTTONS[index]);
        if (index !== 0) await wait(0.15);
      }
    };

    const AboutMeButton = document.querySelector(`.${CLASS_ABOUTME}`);
    AboutMeButton.addEventListener("click", function () {
      chainedMove();
    });
  }

  /** remove any classes that setup the transition for an animation.
   * @param {HTMLElement} element element on which removing the classes.
   */

  _removeAnyTransitionCSSClasses(element) {
    [CLASS_APPCONTAINER_HOVER_TRANSITION, CLASS_APPCONTAINER_GO_TRANSITION].forEach((className) => {
      element.classList.remove(className);
    });
  }
}
