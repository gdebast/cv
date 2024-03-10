import { ASSERT_EXIST } from "../../model/utility/assert/assert";

/* contact info */
const CVCONTACT_EMAIL = "gatien.debast@gmail.com";
const CVCONTACT_PHONE = "+32479/75.95.49";
const CVCONTACT_ADDRESS = "Brabant Wallon, Belgium";

export class CVView {
  constructor(portalView) {
    ASSERT_EXIST(portalView);
    this._portalView = portalView;
    this._portalView.registerInsertProvider(this);
  }

  /**  implement the oberser pattern with the PortalView.*/
  getInsertHeader() {
    const contactElt = document.createElement("section");
    contactElt.innerHTML = this._makeContactInnerHtml();
    contactElt.classList.add("cv-address-backToMenu");
    return contactElt;
  }

  // -------
  // PRIVATE
  // -------
  /**
   * @returns {String} the html code that contains the contact and a button to go back.
   */
  _makeContactInnerHtml() {
    const html = `<address class="cv-address">
                        <div>${CVCONTACT_EMAIL}</div>
                        <div>${CVCONTACT_PHONE}</div>
                        <div>${CVCONTACT_ADDRESS}</div>
                  </address> 
                  <button id="cv-backToMenu">
                    <svg xmlns="http://www.w3.org/2000/svg" class="cv-backToMenu-icon" viewBox="0 0 512 512">
                        <path fill="none" 
                              stroke="currentColor" 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="48" 
                              d="M268 112l144 144-144 144M392 256H100"/>
                    </svg>
                  </button>`;
    return html;
  }

  /**
   * TODO:
   * PortalView offers two registration mechanisms to trigger the appearance of the cv (one for the contact, one for the elements):
   *  - PortalView asks to CVView what is the button that triggers the reverse.
   *  - PortalView add an event listener to this button:
   *     * when hovered, the button slide to the right
   *     * when clicked, the buttons goes right and the button moves up
   * PortalView offers a registration mechanism to add elements in its grid
   */
}
