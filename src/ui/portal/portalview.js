import { ASSERT, ASSERT_EXIST } from "../../model/utility/assert/assert";
import { PortalAppLinker } from "./src/portalapplinker";

const CLASS_APP_GRID = "app-grid";
const CLASS_APPCONTAINER = "app-container";
const CLASS_ABOUTME = "about-section";

/*Hovered animation */
const CLASS_APPCONTAINER_HOVER = "app-container-hover";
const CLASS_APPCONTAINER_HOVER_TRANSITION = "app-container-hover-transition";

/*app-buttons Go/come-back animation */
const CLASS_APPCONTAINER_GO = "app-container-go";
const CLASS_APPCONTAINER_GO_TRANSITION = "app-container-go-transition";
const CLASS_APPCONTAINER_COMEBACK_TRANSITION = "app-container-comeback-transition";

/*Insert animation */
const CLASS_INSERT_HEADER = "insert-header";
const CLASS_INSERT_HEADER_GO = "insert-header-go";
const CLASS_INSERT_HEADER_GO_TRANSITION = "insert-header-go-transition";
const CLASS_INSERT_PARAGRAPH_GO_TRANSITION = "insert-paragraph-go-transition";
const CLASS_INSERT_PARAGRAPH_GO_LEFT = "insert-paragraph-go-left";
const CLASS_INSERT_PARAGRAPH_GO_RIGHT = "insert-paragraph-go-rigth";

const ALL_APP_BUTTONS = document.querySelectorAll(`.${CLASS_APPCONTAINER}`);
const APP_GRID = document.querySelector(`.${CLASS_APP_GRID}`);

const ALL_TRANSITION_CLASS = [
  CLASS_APPCONTAINER_HOVER_TRANSITION,
  CLASS_APPCONTAINER_GO_TRANSITION,
  CLASS_INSERT_HEADER_GO_TRANSITION,
  CLASS_APPCONTAINER_COMEBACK_TRANSITION,
  CLASS_INSERT_PARAGRAPH_GO_TRANSITION,
];

export class PortalView {
  constructor() {
    this._portalAppLinker = new PortalAppLinker();
    this._setupHoveredState();
    this._setupGoState();
    this._insertProvider = null;
    this._insertHeaderHTMLElement = null;
  }

  /** register an object able to provide the insert.
   *  An insert is the set of html elements replacing the app buttons when clicking on the about-me button.
   *  the insert-provider must provide the method getInsertHeader(), getInsertHeaderBackButtonId() and getInsertParagraphs()
   */
  registerInsertProvider(insertProvider) {
    ASSERT_EXIST(insertProvider);
    this._insertProvider = insertProvider;
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
    const self = this;

    // wait function for delaying the go states
    const wait = function (seconds) {
      return new Promise(function (resolve) {
        setTimeout(resolve, seconds * 1000);
      });
    };

    // remove/recover a button
    const removeButton = function (btn) {
      btn.classList.add(CLASS_APPCONTAINER_GO_TRANSITION);
      btn.classList.add(CLASS_APPCONTAINER_GO);
    };
    const recoverButton = function (btn) {
      btn.classList.add(CLASS_APPCONTAINER_COMEBACK_TRANSITION);
      btn.classList.remove(CLASS_APPCONTAINER_GO);
    };

    // add/remove the header of the insert.
    const recoverInsertHeader = function () {
      // lazy creation.
      if (self._insertHeaderHTMLElement != null) return;
      const insertHeaderHTMLElement = self._insertProvider.getInsertHeader();
      insertHeaderHTMLElement.classList.add(CLASS_INSERT_HEADER);
      insertHeaderHTMLElement.classList.add(CLASS_INSERT_HEADER_GO);
      insertHeaderHTMLElement.classList.add(CLASS_INSERT_HEADER_GO_TRANSITION);
      APP_GRID.append(insertHeaderHTMLElement);
      self._insertHeaderHTMLElement = insertHeaderHTMLElement;
      const backButton = self._insertHeaderHTMLElement.querySelector(`#${self._insertProvider.getInsertHeaderBackButtonId()}`);
      ASSERT_EXIST(backButton);
      backButton.addEventListener("click", function () {
        makeInsertDisappear();
      });
    };
    const removeInsertHeader = function () {
      ASSERT_EXIST(self._insertHeaderHTMLElement);
      self._insertHeaderHTMLElement.classList.add(CLASS_INSERT_HEADER_GO);
    };

    const makeInsertAppear = async function () {
      // the buttons are disapearing
      const totalNumberOfButtons = ALL_APP_BUTTONS.length;
      for (let index = totalNumberOfButtons - 1; index >= 0; index--) {
        const btn = ALL_APP_BUTTONS[index];
        removeButton(btn);
        if (index !== 0) await wait(0.15);
      }

      // the insert is appearing
      if (self._insertProvider != null) {
        recoverInsertHeader();
        await wait(0.001);
        self._insertHeaderHTMLElement.classList.remove(CLASS_INSERT_HEADER_GO); /*this needs to be after a wait function call */
        // make the paragraph appearing
        const insertParagraphs = self._insertProvider.getInsertParagraphs();
        let startGridRow = 3;
        let currentTransitionDirection = CLASS_INSERT_PARAGRAPH_GO_LEFT;
        for (const insertParagraph of insertParagraphs) {
          await wait(0.5);
          insertParagraph.style.gridColumn = "1/3";
          insertParagraph.style.gridRow = String(startGridRow);
          insertParagraph.classList.add(currentTransitionDirection);
          insertParagraph.classList.add(CLASS_INSERT_PARAGRAPH_GO_TRANSITION);
          APP_GRID.append(insertParagraph);
          await wait(0.001);
          insertParagraph.classList.remove(currentTransitionDirection); /*appearing */
          // increment
          currentTransitionDirection =
            currentTransitionDirection === CLASS_INSERT_PARAGRAPH_GO_LEFT ? CLASS_INSERT_PARAGRAPH_GO_RIGHT : CLASS_INSERT_PARAGRAPH_GO_LEFT;
          startGridRow++;
        }
        await wait(0.1);
        for (const insertParagraph of insertParagraphs) self._removeAnyTransitionCSSClasses(insertParagraph);
      }
      await wait(0.1);
      for (const btn of ALL_APP_BUTTONS) self._removeAnyTransitionCSSClasses(btn);
    };

    const makeInsertDisappear = async function () {
      /*remove the header */
      removeInsertHeader();
      ASSERT_EXIST(self._insertProvider);
      await wait(0.15);
      /* remove the insert paragraphs */
      const insertParagraphs = self._insertProvider.getInsertParagraphs();
      let currentTransitionDirection = CLASS_INSERT_PARAGRAPH_GO_LEFT;
      for (const insertParagraph of insertParagraphs) {
        insertParagraph.classList.add(currentTransitionDirection);
        insertParagraph.classList.add(CLASS_INSERT_PARAGRAPH_GO_TRANSITION);
        await wait(0.3);
        insertParagraph.remove();
        // increment
        currentTransitionDirection =
          currentTransitionDirection === CLASS_INSERT_PARAGRAPH_GO_LEFT ? CLASS_INSERT_PARAGRAPH_GO_RIGHT : CLASS_INSERT_PARAGRAPH_GO_LEFT;
      }
      const totalNumberOfButtons = ALL_APP_BUTTONS.length;
      for (let index = 0; index < totalNumberOfButtons; index++) {
        const btn = ALL_APP_BUTTONS[index];
        recoverButton(btn);
        await wait(0.15);
      }
      await wait(0.001);
      for (const btn of ALL_APP_BUTTONS) self._removeAnyTransitionCSSClasses(btn);
    };

    const AboutMeButton = document.querySelector(`.${CLASS_ABOUTME}`);
    AboutMeButton.addEventListener("click", function () {
      makeInsertAppear();
    });
  }

  /** remove any classes that setup the transition for an animation.
   * @param {HTMLElement} element element on which removing the classes.
   */

  _removeAnyTransitionCSSClasses(element) {
    ALL_TRANSITION_CLASS.forEach((className) => {
      element.classList.remove(className);
    });
  }
}
