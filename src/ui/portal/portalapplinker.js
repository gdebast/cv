const CLASS_APP = ".app";
const CLASS_PORTAL = ".portal";
const CLASS_HIDDEN = "hidden";
const apps = document.querySelectorAll(CLASS_APP);
const navigationElement = document.querySelector(CLASS_PORTAL);

/**
 * class responsible for linking the portal to the apps
 */
export class PortalAppLinker {
  constructor() {}

  /**
   * link app button to the app such that it appears when the use click on it.
   */
  linkAll() {
    apps.forEach(function (appElt) {
      // the app element should have a 'for' attribute
      if (!appElt.attributes.for) {
        console.error(`missing for attribute on ${CLASS_APP} elements.`);
        return;
      }
      // there should be an Id pointing of this 'for'
      const linkedButtonId = appElt.attributes.for.value;
      const linkedButton = document.getElementById(linkedButtonId);
      if (!linkedButton) {
        console.error(`missing app button with id ${linkedButtonId}.`);
        return;
      }

      linkedButton.addEventListener("click", function () {
        // hide the navigation - show the app
        if (!navigationElement.classList.contains(CLASS_HIDDEN))
          navigationElement.classList.add(CLASS_HIDDEN);
        if (appElt.classList.contains(CLASS_HIDDEN))
          appElt.classList.remove(CLASS_HIDDEN);
      });
    });
  }
}
