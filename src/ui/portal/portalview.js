import { ASSERT, ASSERT_EXIST, ASSERT_ISBOOLEAN, ASSERT_TYPE } from "../../model/utility/assert/assert";
import { PortalAppLinker } from "./src/portalapplinker";

const CLASS_APP_GRID = "app-grid";
const CLASS_APPCONTAINER = "app-container";
const CLASS_ABOUTME = "about-section";
const CLASS_RELATIVESIZE = "relative-size";
const CLASS_ABSOLUTESIZE = "absolute-size";
const TAG_MAINELEMENTS = ["html", "body"];

/*id of the text in the portal*/
const JOB_DESCRIPTION_ID = "description-jobtitle";
const ABOUTME_BUTTON_TEXT_ID = "about-me-button-text";
const DPLMOVIE_BUTTON_TEXT_ID = "dplmovie-button-text";
const GRAPHPLAYER_BUTTON_TEXT_ID = "graphplayer-button-text";

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
const CLASS_INSERT_PHOTO = "insert-photo";
const CLASS_INSERT_PHOTO_GO_TRANSITION = "insert-photo-go-transition";
const CLASS_INSERT_PHOTO_GO = "insert-photo-go";
const CLASS_INSERT_TITLE = "insert-title";
const CLASS_INSERT_TITLE_GO = "insert-title-go";
const CLASS_INSERT_TITLE_GO_TRANSITION = "insert-title-go-transition";

const ALL_APP_BUTTONS = document.querySelectorAll(`.${CLASS_APPCONTAINER}`);
const APP_GRID = document.querySelector(`.${CLASS_APP_GRID}`);

const ALL_TRANSITION_CLASS = [
  CLASS_APPCONTAINER_HOVER_TRANSITION,
  CLASS_APPCONTAINER_GO_TRANSITION,
  CLASS_INSERT_HEADER_GO_TRANSITION,
  CLASS_APPCONTAINER_COMEBACK_TRANSITION,
  CLASS_INSERT_PARAGRAPH_GO_TRANSITION,
  CLASS_INSERT_TITLE_GO_TRANSITION,
  CLASS_INSERT_PHOTO_GO_TRANSITION,
];

export class PortalView {
  constructor(translator, localConfigGetter) {
    ASSERT_EXIST(translator);
    ASSERT_EXIST(localConfigGetter);
    this._portalAppLinker = new PortalAppLinker();
    this._translator = translator;
    this._localConfigGetter = localConfigGetter;
    this._setupHoveredState();
    this._setupGoState();
    this._translatePortal();
    this._insertProvider = null;
    this._insertHeaderHTMLElement = null;
  }

  /** register an object able to provide the insert.
   *  An insert is the set of html elements replacing the app buttons when clicking on the about-me button.
   *  the insert-provider must provide the method getInsertPhoto(), getInsertTitle(), getInsertHeader(), getInsertHeaderBackButtonId() and getInsertParagraphs()
   */
  registerInsertProvider(insertProvider) {
    ASSERT_EXIST(insertProvider);
    this._insertProvider = insertProvider;
    this._setupPhotoAndTitleInsert();
  }

  // -------
  // PRIVATE
  // -------

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

  _translatePortal() {
    this._translator.registerTranslatable(ABOUTME_BUTTON_TEXT_ID, {
      ENG: "About the author",
      FR: "A propos de l'autheur",
    });
    this._translator.registerTranslatable(DPLMOVIE_BUTTON_TEXT_ID, {
      ENG: "Discover the DPL Movie ...",
      FR: "Découvrir le DPL Movie ...",
    });
    this._translator.registerTranslatable(GRAPHPLAYER_BUTTON_TEXT_ID, {
      ENG: "... Play with graphs",
      FR: "... Jouer avec des graphes",
    });
    this._translator.translate(APP_GRID);
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

    // recover or hide the phto and the insert if needed.
    const recoverInsertPhotoAndTitleIfNeeded = function () {
      if (self._localConfigGetter.hidePhotoAndMainDescriptionAtStart == false) return;
      self._insertPhotoHtmlElement.classList.add(CLASS_INSERT_PHOTO_GO_TRANSITION);
      self._insertTitleHtmlElement.classList.add(CLASS_INSERT_TITLE_GO_TRANSITION);
      self._insertPhotoHtmlElement.classList.remove(CLASS_INSERT_PHOTO_GO);
      self._insertTitleHtmlElement.classList.remove(CLASS_INSERT_TITLE_GO);
    };
    const removeInsertPhotoAndTitleIfNeeded = function () {
      if (self._localConfigGetter.hidePhotoAndMainDescriptionAtStart == false) return;
      self._insertPhotoHtmlElement.classList.add(CLASS_INSERT_PHOTO_GO);
      self._insertTitleHtmlElement.classList.add(CLASS_INSERT_TITLE_GO);
    };

    const makeInsertAppear = async function () {
      self._setAbsoluteSizingClassesForMainElements();
      // the buttons are disapearing
      const totalNumberOfButtons = ALL_APP_BUTTONS.length;
      for (let index = totalNumberOfButtons - 1; index >= 0; index--) {
        const btn = ALL_APP_BUTTONS[index];
        removeButton(btn);
        if (index !== 0) await wait(0.15);
      }

      // the insert is appearing
      if (self._insertProvider != null) {
        // the photo and title are appearing
        recoverInsertPhotoAndTitleIfNeeded();
        await wait(0.001);

        // header is appearing
        recoverInsertHeader();
        await wait(0.001);
        self._insertHeaderHTMLElement.classList.remove(CLASS_INSERT_HEADER_GO); /*this needs to be after the wait function call */

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
      self._setDefaultSizingClassesForMainElements();
    };

    const makeInsertDisappear = async function () {
      self._setAbsoluteSizingClassesForMainElements();
      ASSERT_EXIST(self._insertProvider);

      /* remove the insert paragraphs */
      const insertParagraphs = self._insertProvider.getInsertParagraphs().reverse();
      // if the number of insert paragraphs is a multiple of two, the first one should go to the right, because the first one comes from the left.
      let currentTransitionDirection = insertParagraphs.length % 2 === 0 ? CLASS_INSERT_PARAGRAPH_GO_RIGHT : CLASS_INSERT_PARAGRAPH_GO_LEFT;
      for (const insertParagraph of insertParagraphs) {
        insertParagraph.classList.add(currentTransitionDirection);
        insertParagraph.classList.add(CLASS_INSERT_PARAGRAPH_GO_TRANSITION);
        await wait(0.3);
        insertParagraph.remove();
        // increment
        currentTransitionDirection =
          currentTransitionDirection === CLASS_INSERT_PARAGRAPH_GO_LEFT ? CLASS_INSERT_PARAGRAPH_GO_RIGHT : CLASS_INSERT_PARAGRAPH_GO_LEFT;
      }

      /*remove the header */
      removeInsertHeader();
      await wait(0.15);

      /*remove the photo and the title */
      removeInsertPhotoAndTitleIfNeeded();
      await wait(0.15);

      /*recover the buttons */
      const totalNumberOfButtons = ALL_APP_BUTTONS.length;
      for (let index = 0; index < totalNumberOfButtons; index++) {
        const btn = ALL_APP_BUTTONS[index];
        recoverButton(btn);
        await wait(0.15);
      }
      await wait(0.001);
      for (const btn of ALL_APP_BUTTONS) self._removeAnyTransitionCSSClasses(btn);
      self._setRelativeSizingClassesForMainElements();
    };

    const AboutMeButton = document.querySelector(`.${CLASS_ABOUTME}`);
    AboutMeButton.addEventListener("click", function () {
      makeInsertAppear();
    });
  }

  /**
   * add the photo and the title at startup.
   */
  _setupPhotoAndTitleInsert() {
    if (this._insertProvider == null) return;

    // get the inserts
    this._insertPhotoHtmlElement = this._insertProvider.getInsertPhoto();
    this._insertTitleHtmlElement = this._insertProvider.getInsertTitle();
    console.log(this._insertPhotoHtmlElement);
    // put them in the grid
    this._insertPhotoHtmlElement.classList.add(CLASS_INSERT_PHOTO);
    this._insertTitleHtmlElement.classList.add(CLASS_INSERT_TITLE);
    APP_GRID.append(this._insertPhotoHtmlElement);
    APP_GRID.append(this._insertTitleHtmlElement);

    // make it go if the needed
    if (this._localConfigGetter.hidePhotoAndMainDescriptionAtStart) {
      this._insertPhotoHtmlElement.classList.add(CLASS_INSERT_PHOTO_GO);
      this._insertTitleHtmlElement.classList.add(CLASS_INSERT_TITLE_GO);
    }
  }

  /** remove any classes that setup the transition for an animation.
   * @param {HTMLElement} element element on which removing the classes.
   */
  _removeAnyTransitionCSSClasses(element) {
    ALL_TRANSITION_CLASS.forEach((className) => {
      element.classList.remove(className);
    });
  }

  /** add the relative sizing for the main elements
   */
  _setRelativeSizingClassesForMainElements() {
    TAG_MAINELEMENTS.forEach(function (elementTag) {
      const elt = document.querySelector(elementTag);
      ASSERT_EXIST(elt);
      if (elt.classList.contains(CLASS_ABSOLUTESIZE)) {
        elt.classList.remove(CLASS_ABSOLUTESIZE);
      }
      elt.classList.add(CLASS_RELATIVESIZE);
    });
  }

  /** add the absolute sizing for the main elements
   */
  _setAbsoluteSizingClassesForMainElements() {
    TAG_MAINELEMENTS.forEach(function (elementTag) {
      const elt = document.querySelector(elementTag);
      ASSERT_EXIST(elt);
      if (elt.classList.contains(CLASS_RELATIVESIZE)) {
        elt.classList.remove(CLASS_RELATIVESIZE);
      }
      elt.classList.add(CLASS_ABSOLUTESIZE);
    });
  }

  /** add the default sizing for the main elements
   */
  _setDefaultSizingClassesForMainElements() {
    TAG_MAINELEMENTS.forEach(function (elementTag) {
      const elt = document.querySelector(elementTag);
      ASSERT_EXIST(elt);
      if (elt.classList.contains(CLASS_RELATIVESIZE)) {
        elt.classList.remove(CLASS_RELATIVESIZE);
      }
      if (elt.classList.contains(CLASS_ABSOLUTESIZE)) {
        elt.classList.remove(CLASS_ABSOLUTESIZE);
      }
    });
  }
}
