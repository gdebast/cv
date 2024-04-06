"use strict";

import { ASSERT_EXIST } from "../../model/utility/assert/assert";
import { ENG, FR } from "../../model/utility/translatable/translatablestring";
import ukImage from "../../../uk.png";
import frImage from "../../../france.png";

const CLASS_HIDDIN = "hidden";

/* contact info */
const CVCONTACT_EMAIL = "gatien.debast@gmail.com";
const CVCONTACT_PHONE = "+32479/75.95.49";
const CVCONTACT_ADDRESS_ID = "cv-address-physical";

/*experience*/
const CVEXPERIENCE_ID = "cv-experience-title";
const CVEXPERIENCE_SOFTWAREENGINEER_TITLE_ID = "cv-experience-software-engineer-title";
const CVEXPERIENCE_SOFTWAREENGINEER_1_ID = "cv-experience-software-engineer-1";
const CVEXPERIENCE_SOFTWAREENGINEER_2_ID = "cv-experience-software-engineer-2";
const CVEXPERIENCE_ORCONSULTANT_TITLE_ID = "cv-experience-or-consultant-title";
const CVEXPERIENCE_ORCONSULTANT_1_ID = "cv-experience-or-consultant-1";
const CVEXPERIENCE_ORCONSULTANT_2_ID = "cv-experience-or-consultant-2";
const CVEXPERIENCE_ORCONSULTANT_3_ID = "cv-experience-or-consultant-3";
const CVEXPERIENCE_SUPPLYCHAINCONSULTANT_TITLE_ID = "cv-experience-supply-chain-consultant-title";
const CVEXPERIENCE_SUPPLYCHAINCONSULTANT_1_ID = "cv-experience-supply-chain-1-title";

const CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON = "cv-experience-list-element-button";
const CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON_ICON = "cv-experience-list-element-button-icon";
const CLASS_CV_EXPERIENCE_LIST_ELEMENT_CONTENT = "cv-experience-list-element-content";

/*languages*/
const CVLANGUAGE_ID = "cv-language-title";
const CVLANGUAGE_HUMAN_ID = "cv-language-list-element-title-human-language";
const CVLANGUAGE_HUMAN_ENGLISH_DESC = "cv-language-list-element-english-description";
const CVLANGUAGE_HUMAN_FRENCH_DESC = "cv-language-list-element-french-description";
const CLASS_CV_LANGUAGE_SWITCH_BTN = "cv-language-switch-btn";
const CLASS_CV_LANGUAGE_HUMAN_BTN_FLAG = "cv-language-human-btn-flag";
const CVLANGUAGE_PROGRAMMING_ID = "cv-language-list-element-title-programming-language";
const CVLANGUAGE_PROGRAMMING_CPP_ID = "cv-language-programming-cpp";
const CVLANGUAGE_PROGRAMMING_JSHTMLCSS_ID = "cv-language-programming-jshtmlcss";
const CVLANGUAGE_PROGRAMMING_PYTHON_ID = "cv-language-programming-python";
const CVLANGUAGE_PROGRAMMING_MIP_ID = "cv-language-programming-mip";
const CVLANGUAGE_PROGRAMMING_OPAL_ID = "cv-language-programming-opal";

/*icons*/
const HTML_CLOSED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" 
                               fill="none" 
                               viewBox="0 0 24 24" 
                               stroke-width="1.5" 
                               stroke="currentColor" 
                               class="${CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON_ICON}">
                               <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>`;
const HTML_OPENED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" 
                               fill="none" 
                               viewBox="0 0 24 24" 
                               stroke-width="1.5" 
                               stroke="currentColor" 
                               class="${CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON_ICON}">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>`;

export class CVView {
  constructor(portalView, translator) {
    ASSERT_EXIST(portalView);
    ASSERT_EXIST(translator);
    this._portalView = portalView;
    this._translator = translator;
    this._portalView.registerInsertProvider(this);

    this._makeContactHtmlElement();
    this._makeExperienceParagraphHtmlElement();
    this._makeLanguageParagraphHtmlElement();
  }

  /**  implement the oberser pattern with the PortalView.*/
  getInsertHeader() {
    this._translator.translate(this._contactHtmlElement);
    return this._contactHtmlElement;
  }
  getInsertHeaderBackButtonId() {
    return "cv-backToMenu";
  }
  getInsertParagraphs() {
    this._translator.translate(this._experienceHtmlElement);
    this._translator.translate(this._languageHtmlElement);
    return [this._languageHtmlElement, this._experienceHtmlElement];
  }

  // -------
  // PRIVATE
  // -------

  /** make the html element containing the contact information.
   * The instance of this class owns it.
   */
  _makeContactHtmlElement() {
    this._translator.registerTranslatable(CVCONTACT_ADDRESS_ID, { ENG: "Brabant Wallon, Belgium", FR: "Brabant Wallon, Belgique" });
    const html = `<address class="cv-address">
                        <div>${CVCONTACT_EMAIL}</div>
                        <div>${CVCONTACT_PHONE}</div>
                        <div id="${CVCONTACT_ADDRESS_ID}"></div>
                  </address> 
                  <button id="${this.getInsertHeaderBackButtonId()}">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke-width="1.5" 
                      stroke="currentColor" 
                      class="cv-backToMenu-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                    </svg>
                  </button>`;
    const contactElt = document.createElement("section");
    contactElt.innerHTML = html;
    contactElt.classList.add("cv-address-backToMenu");
    contactElt.classList.add("cv-box");
    this._contactHtmlElement = contactElt;
  }

  /** make the html element containing the experience.
   */
  _makeExperienceParagraphHtmlElement() {
    this._translator.registerTranslatable(CVEXPERIENCE_ID, {
      ENG: "Experiences",
      FR: "Expériences",
    });

    /* Supply Chain Consultant */
    this._translator.registerTranslatable(CVEXPERIENCE_SUPPLYCHAINCONSULTANT_TITLE_ID, {
      ENG: "Supply Chain Consultant, OMP, France, Paris",
      FR: "Consultant en logistique et chaine d'approvisionnement, OMP, France, Paris",
    });
    this._translator.registerTranslatable(CVEXPERIENCE_SUPPLYCHAINCONSULTANT_1_ID, {
      ENG: "I started my software career as a supply chain consultant in Paris. OMP is SaaS company which deliver planning and scheduling software used in industries involving production and distribution. Its consultancy team delivers and taylors this application. As a consultant, I had to taylor this application to customer needs. This was the start of my softaware engineering career as it gave me the opportunity to write code.",
      FR: "J'ai démarré ma carrière dans les logiciels informatique en tant que consultant en logistique et chaine d'approvisionnement à Paris. OMP est un société SaaS qui fournit un logiciel pour des entreprises ayant besoin de plannifier et d'ordonnancer la distribution et la production de leurs produits. Son activité de consultance installe et personnalise cette application. En tant que consultant, je devais principalement personnaliser afin de répondre aux besoins clients. Ce fut mes débuts dans la programmation.",
    });

    /* Operational Research Consultant */
    this._translator.registerTranslatable(CVEXPERIENCE_ORCONSULTANT_TITLE_ID, {
      ENG: "Operational Research Consultant, OMP, Belgium, Antwerpen",
      FR: "Consultant en recherche opérationelle, OMP, Belgique, Anvers",
    });
    this._translator.registerTranslatable(CVEXPERIENCE_ORCONSULTANT_1_ID, {
      ENG: "After almost three years in Paris, I came back to Belgium to encorporate the Operational Research team. This team is responsible for maintaining, develloping and installing the algorithms automating the planning decisions for our customers. During those years, I maintained and customized the Mixed Integer Programming model of OMP.",
      FR: "Après presque trois ans à Paris, je suis revenu en Belgique pour intégrer l'équipe de recherche opérationelle. Cette équipe maintient, dévellope et installe les algorithmes capables de prendre des décisions de plannification pour nos clients. Durant ces années, j'ai maintenu et installé le modèle de programmation linéaire d'OMP.",
    });
    this._translator.registerTranslatable(CVEXPERIENCE_ORCONSULTANT_2_ID, {
      ENG: "In parallel of my consulting activity, I was responsible for standardizing some of our planning algorithms which we made in the OPAL language for some customers and that could be useful for other customers. This side activity gave me the passion for software development and a solid knowledge in graph theory. Indeed most of the algorithm were solving supply chain network problems.",
      FR: "En parallèle de mon activité de consultant, j'étais responsable de standardiser certains de algorithmes de plannification fait en OPAL, spécifiquement pour des clients mais que d'autres pourraient utiliser. Cette autre tâche m'a donné goût au développement de logiciel, et m'a donné une solide connaissance de la théorie des graphe. En effet, la plupart de nos algoritmes permettaient de résoudre des problème dans un réseau logistique.",
    });
    this._translator.registerTranslatable(CVEXPERIENCE_ORCONSULTANT_3_ID, {
      ENG: "My passion for development made me learn C++ during the year 2018. This choice was made because of the need for C++ developers at OMP. It was the perfect opportunity to learn and practice this fundamental language. After learning C++, I integrated our C++ development team where I learnt about the code architecture principle and the importance of testing.",
      FR: "Ma passion pour le développement m'a conduit à apprendre le C++ durant l'année 2018. Le choix du C++ provient du besoin de dévellopeur C++ chez OMP, et de sa difficulté. C'était donc une opportunité d'apprendre et de pratiquer ce language fondamental. Après avoir appris ce language, j'ai intégrer une équipe de développement. Elle m'a appris les principes d'architecture et l'importance des tests.",
    });

    /* Operational Research Software Engineer */
    this._translator.registerTranslatable(CVEXPERIENCE_SOFTWAREENGINEER_TITLE_ID, {
      ENG: "Operational Research Software Engineer, OMP, Belgium, Wavre",
      FR: "Ingénieur Software en recherche opéraionelle, OMP, Belgique, Wavre",
    });
    this._translator.registerTranslatable(CVEXPERIENCE_SOFTWAREENGINEER_1_ID, {
      ENG: "In 2019, I became responsible for the Solver module. My first decision was to organize progressively this module with modern architecture principles. The code had to be encapsulated in components, the components could not have cyclic dependencies and the purpose of a component could not be shared. Those rules were translated into a style guide which helpt the understanding.",
      FR: "En 2019, je suis devenu responsable du module Solver. Ma première decision fut d'organiser progressivement ce module grâce à des principes modernes d'architecture. Le code devait être organisé en composants encapsulés, qui ne partageaient pas de responsabilité, et qui ne devait pas avoir de dependences cyclique entre eux. Ces règles furent traduire en guide pour faciliter la comprehension.",
    });
    this._translator.registerTranslatable(CVEXPERIENCE_SOFTWAREENGINEER_2_ID, {
      ENG: "The other main achievement while being the responsible of this module, was to set up automatic testing on every public component. Automatic testing was never set up on this module. The productivity of the team increased as well as the quality of the product, as we could concentrate on the development rather than on solving bugs.",
      FR: "L'autre principale réalisation alors que j'étais responsable de ce module, fut de mettre en place des tests automatique sur chaque composant disposant d'une interface publique. Les tests automatiques n'avaient jamais été mis en place sur ce module. La productivité de notre équipe, autant que la qualité du produit, fut améliorée étant donné que notre équipe pu se concentrer d'avantage sur les dévelopements que sur les bugs.",
    });

    /*compute the current year */
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const html = `<h1 class = "cv-paragraph-title" id="${CVEXPERIENCE_ID}"></h1>
                  <ol class = "cv-paragraph-list">
                    <li class = "cv-paragraph-list-element">
                      <h2 class = "cv-paragraph-list-element-title cv-experience-list-element-date-title-button ">
                        <div class = "cv-experience-list-element-date">2013 - 2015</div>
                        <div class = "cv-experience-list-element-title" 
                             id="${CVEXPERIENCE_SUPPLYCHAINCONSULTANT_TITLE_ID}">
                        </div>
                        <button class = "${CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON}">${HTML_CLOSED_ICON}</button>
                      </h2>
                      <div class = "cv-experience-list-element-content hidden">
                        <p id="${CVEXPERIENCE_SUPPLYCHAINCONSULTANT_1_ID}"></p>
                      </div>
                    </li>
                    <li class = "cv-paragraph-list-element">
                      <h2 class = "cv-paragraph-list-element-title cv-experience-list-element-date-title-button ">
                        <div class = "cv-experience-list-element-date">2015 - 2019</div>
                        <div class = "cv-experience-list-element-title" 
                             id="${CVEXPERIENCE_ORCONSULTANT_TITLE_ID}">
                        </div>
                        <button class = "${CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON}">${HTML_CLOSED_ICON}</button>
                      </h2>
                      <div class = "cv-experience-list-element-content hidden">
                        <p id="${CVEXPERIENCE_ORCONSULTANT_1_ID}"></p>
                        <p id="${CVEXPERIENCE_ORCONSULTANT_2_ID}"></p>
                        <p id="${CVEXPERIENCE_ORCONSULTANT_3_ID}"></p>
                      </div>
                    </li>
                    <li class = "cv-paragraph-list-element">
                      <h2 class = "cv-paragraph-list-element-title cv-experience-list-element-date-title-button">
                        <div class = "cv-experience-list-element-date">2019 - ${currentYear}</div>
                        <div class = "cv-experience-list-element-title" 
                             id="${CVEXPERIENCE_SOFTWAREENGINEER_TITLE_ID}">
                        </div>
                        <button class = "${CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON}">${HTML_CLOSED_ICON}</button>
                      </h2>
                      <div class = "cv-experience-list-element-content hidden">
                        <p id="${CVEXPERIENCE_SOFTWAREENGINEER_1_ID}"></p>
                        <p id="${CVEXPERIENCE_SOFTWAREENGINEER_2_ID}"></p>
                      </div>
                    </li>
                  </ol>`;

    const expElt = document.createElement("section");
    expElt.innerHTML = html;
    expElt.classList.add("cv-box");
    expElt.classList.add("cv-paragraph");
    this._experienceHtmlElement = expElt;

    /*connect the button to make the experience content appear and disappear */
    const allExperienceButtons = this._experienceHtmlElement.querySelectorAll(`.${CLASS_CV_EXPERIENCE_LIST_ELEMENT_BUTTON}`);
    allExperienceButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const experienceItemHtmlElt = btn.parentNode.parentNode;
        const experienceContent = experienceItemHtmlElt.querySelector(`.${CLASS_CV_EXPERIENCE_LIST_ELEMENT_CONTENT}`);
        ASSERT_EXIST(experienceContent);
        if (experienceContent.classList.contains("hidden")) btn.innerHTML = HTML_OPENED_ICON;
        else btn.innerHTML = HTML_CLOSED_ICON;

        experienceContent.classList.toggle("hidden");
      });
    });
  }

  _makeLanguageParagraphHtmlElement() {
    this._translator.registerTranslatable(CVLANGUAGE_ID, {
      ENG: "Languages",
      FR: "Langues",
    });
    this._translator.registerTranslatable(CVLANGUAGE_HUMAN_ID, {
      ENG: "Human Languages",
      FR: "Langues humaines",
    });
    this._translator.registerTranslatable(CVLANGUAGE_HUMAN_ENGLISH_DESC, {
      ENG: "Profesional level",
      FR: "Niveau professionel",
    });
    this._translator.registerTranslatable(CVLANGUAGE_HUMAN_FRENCH_DESC, {
      ENG: "Mother language",
      FR: "Langue maternelle",
    });
    this._translator.registerTranslatable(CVLANGUAGE_PROGRAMMING_ID, {
      ENG: "Programming Languages",
      FR: "Languages de programmation",
    });
    this._translator.registerTranslatable(CVLANGUAGE_PROGRAMMING_CPP_ID, {
      ENG: "Professional usage at OMP since 2019.",
      FR: "Utilité professionnel chez OMP depuis 2019.",
    });
    this._translator.registerTranslatable(CVLANGUAGE_PROGRAMMING_JSHTMLCSS_ID, {
      ENG: "Personal usage for some projects.",
      FR: "Utilité personnelle pour des projets.",
    });
    this._translator.registerTranslatable(CVLANGUAGE_PROGRAMMING_PYTHON_ID, {
      ENG: "Professional usage for some small projects.",
      FR: "Utilité professionnel pour de petits projets.",
    });
    this._translator.registerTranslatable(CVLANGUAGE_PROGRAMMING_MIP_ID, {
      ENG: "Professional usage at OMP since 2015.",
      FR: "Utilité professionnel chez OMP depuis 2015.",
    });
    this._translator.registerTranslatable(CVLANGUAGE_PROGRAMMING_OPAL_ID, {
      ENG: "Configuration language for OMP softwares.",
      FR: "Language de configuration pour OMP.",
    });

    const html = `<h1 class = "cv-paragraph-title" id="${CVLANGUAGE_ID}"></h1>
                  <ol class = "cv-paragraph-list cv-language-list">
                    <li class = "cv-paragraph-list-element cv-language-list-element">
                      <h2 class = "cv-paragraph-list-element-title" id="${CVLANGUAGE_HUMAN_ID}"></h2>
                      <div class = "cv-language-human-grid">

                        <!-- ENGLISH -->
                        <div class = "cv-language-human-btn-container">
                          <div class = "cv-language-human-btn ${CLASS_CV_LANGUAGE_SWITCH_BTN}" id="__ENGLISH" for="__ENGLISH" value="${ENG}">
                            <img class="${CLASS_CV_LANGUAGE_HUMAN_BTN_FLAG}" src="${ukImage}" alt="uk" />
                          </div>
                        </div>
                        <label class="cv-language-human-name ${CLASS_CV_LANGUAGE_SWITCH_BTN}" for="__ENGLISH" id="${ENG}"></label>
                        <p class="cv-language-human-desc" id=${CVLANGUAGE_HUMAN_ENGLISH_DESC}></p>

                        <!-- FRENCH -->
                        <div class = "cv-language-human-btn-container">
                          <div class = "cv-language-human-btn ${CLASS_CV_LANGUAGE_SWITCH_BTN}" id="__FRENCH" for="__FRENCH" value="${FR}">
                            <img class="${CLASS_CV_LANGUAGE_HUMAN_BTN_FLAG} ${CLASS_HIDDIN}" src="${frImage}" alt="France" />
                          </div>
                        </div>
                        <label class="cv-language-human-name ${CLASS_CV_LANGUAGE_SWITCH_BTN}" for="__FRENCH" id="${FR}"></label>
                        <p class="cv-language-human-desc" id=${CVLANGUAGE_HUMAN_FRENCH_DESC}></p>
                      </div>
                    </li>
                    <li class = "cv-paragraph-list-element cv-language-list-element">
                      <h2 class = "cv-paragraph-list-element-title" id="${CVLANGUAGE_PROGRAMMING_ID}"></h2>
                      <div class = "cv-language-programming-grid">
                        
                        <!-- C++ -->
                        <label class="cv-language-programming-name">C++</label>
                        <p class="cv-language-programming-description" id=${CVLANGUAGE_PROGRAMMING_CPP_ID}></p>

                        <!-- Javascript-HTML-CSS -->
                        <label class="cv-language-programming-name">Javascript-HTML-CSS</label>
                        <p class="cv-language-programming-description" id=${CVLANGUAGE_PROGRAMMING_JSHTMLCSS_ID}></p>

                        <!-- Python -->
                        <label class="cv-language-programming-name">Python</label>
                        <p class="cv-language-programming-description" id=${CVLANGUAGE_PROGRAMMING_PYTHON_ID}></p>

                        <!-- MIP -->
                        <label class="cv-language-programming-name">Mixed Integer Programming</label>
                        <p class="cv-language-programming-description" id=${CVLANGUAGE_PROGRAMMING_MIP_ID}></p>

                        <!-- OPAL -->
                        <label class="cv-language-programming-name">OPAL</label>
                        <p class="cv-language-programming-description" id=${CVLANGUAGE_PROGRAMMING_OPAL_ID}></p>

                      </div>
                    </li>
                  </ol>`;

    const langElt = document.createElement("section");
    langElt.innerHTML = html;
    langElt.classList.add("cv-box");
    langElt.classList.add("cv-paragraph");
    this._languageHtmlElement = langElt;

    /* connect the language buttons to translator 
      each button and label has the cv-language-switch-btn class and they each should point to the round flag with the 'for' attribute.
      When we click on it, we look for the id in the 'for' attribute and use the 'value' property for setting the language.
      The flag is then hidden for every round flag button, but the one clicked on.  
    */
    const self = this;
    const languageSwitchRadioBtns = this._languageHtmlElement.querySelectorAll(`.${CLASS_CV_LANGUAGE_SWITCH_BTN}`);
    languageSwitchRadioBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const roundFlagBtn = self._languageHtmlElement.querySelector(`#${btn.attributes.for.nodeValue}`);
        ASSERT_EXIST(roundFlagBtn);
        self._translator.setLanguage(roundFlagBtn.attributes.value.nodeValue);
        const flagElt = roundFlagBtn.children[0];
        ASSERT_EXIST(flagElt);
        const flagElements = self._languageHtmlElement.querySelectorAll(`.${CLASS_CV_LANGUAGE_HUMAN_BTN_FLAG}`);
        flagElements.forEach(function (flag) {
          if (flag === flagElt) flag.classList.remove(CLASS_HIDDIN);
          else flag.classList.add(CLASS_HIDDIN);
        });
      });
    });
  }
}
