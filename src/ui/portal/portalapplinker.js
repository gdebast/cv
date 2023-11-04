const CLASS_APP = ".app";
const CLASS_PORTAL = ".portal";
const CLASS_HIDDEN = "hidden";
const CLASS_APPMENU = ".app-menu";
const CLASS_APPMENUBTN = ".portal-app-btn";
const CLASS_APPSPECIFICBTN = "app-specific-btn";
const apps = document.querySelectorAll(CLASS_APP);
const appSpecificBtn = document.querySelectorAll(
  `${CLASS_APPMENU} .${CLASS_APPSPECIFICBTN}`
);
const portalElt = document.querySelector(CLASS_PORTAL);
const appMenuElt = document.querySelector(CLASS_APPMENU);
const appPortalBtn = document.querySelector(CLASS_APPMENUBTN);

/**
 * class responsible for linking the portal to the apps
 */
export class PortalAppLinker {
  constructor() {}

  /**
   * link app button to the app such that it appears when the use click on it.
   * It also connect the app menu.
   */
  linkAll() {
    let self = this;
    // connect each app section to its button
    apps.forEach(function (appElt) {
      // the app element should have a 'for' attribute
      if (!appElt.attributes.for) {
        console.error(
          `missing 'for' attribute on ${CLASS_APP} elements: ${appElt}`
        );
        return;
      }
      // there should be an Id pointing of this 'for'
      const linkedButtonId = appElt.attributes.for.value;
      const linkedButton = document.getElementById(linkedButtonId);
      if (!linkedButton) {
        console.error(`missing app button with id ${linkedButtonId}.`);
        return;
      }

      // find all app-specific button of its navigation panel
      const appNavBtn = [];
      appSpecificBtn.forEach(function (appBtn) {
        // the app-specific buttons should have a 'for' attribute
        if (!appBtn.attributes.for) {
          console.error(
            `missing for attribute on ${CLASS_APPSPECIFICBTN} elements: ${appBtn}.`
          );
          return;
        }

        if (appBtn.attributes.for.value === linkedButtonId)
          appNavBtn.push(appBtn);
      });

      linkedButton.addEventListener(
        "click",
        self.__slot_closeOpenApp.bind({ app: appElt, appNavBtn: appNavBtn })
      );
    });

    // connect the app-to-portal button such that it closes the app
    appPortalBtn.addEventListener(
      "click",
      this.__slot_closeOpenApp.bind(undefined)
    );
  }

  /**
   * slot controling the opening and closing of the app.
   * if the 'this' keyword is set, it is the app to open.
   * if it is not set, we close all app and buttons in the navigation menu.
   */
  __slot_closeOpenApp() {
    let elementsToHide = [];
    let elementsToShow = [];
    if (this) {
      elementsToHide.push(portalElt);
      elementsToShow.push(appMenuElt);
      elementsToShow.push(this.app);
      this.appNavBtn.forEach(function (appBtn) {
        elementsToShow.push(appBtn);
      });
    } else {
      apps.forEach(function (app) {
        elementsToHide.push(app);
      });
      appSpecificBtn.forEach(function (appBtn) {
        elementsToHide.push(appBtn);
      });
      elementsToHide.push(appMenuElt);
      elementsToShow.push(portalElt);
    }

    elementsToShow.forEach(function (elt) {
      if (elt.classList.contains(CLASS_HIDDEN))
        elt.classList.remove(CLASS_HIDDEN);
    });
    elementsToHide.forEach(function (elt) {
      if (!elt.classList.contains(CLASS_HIDDEN))
        elt.classList.add(CLASS_HIDDEN);
    });
  }
}
