import { escape, trigger, updateCSSOfElement } from "@lesjoursfr/browser-tools";
import { DefaulGDPRConsentParameters } from "./gdpr-consent-parameters.js";
import {
  GDPRConsentParameters,
  GDPRConsentState,
  GDPRConsentUser,
  LangInterface,
  LanguagesLoader,
  ServiceInterface,
  ServicesCategories,
  ServicesLoader,
} from "./interfaces/index.js";
import { getLanguage } from "./languages/index.js";
import {
  activate,
  checkCount,
  closePanel,
  create,
  hashchangeEvent,
  isActivated,
  keydownEvent,
  openAlert,
  openPanel,
  order,
  read,
  respond,
  respondAll,
  respondEffect,
  toggle,
} from "./modules/index.js";

class GDPRConsentInstance implements GDPRConsentState {
  user: GDPRConsentUser;
  lang!: LangInterface;
  services: { [key: string]: ServiceInterface };
  added: { [key: string]: boolean };
  state: { [key: string]: boolean | string };
  launch: { [key: string]: boolean };
  parameters!: GDPRConsentParameters;
  reloadThePage: boolean;
  alreadyLaunch: number;
  languagesLoader?: LanguagesLoader;
  servicesLoader?: ServicesLoader;
  job!: string[];

  public constructor() {
    this.user = {};
    this.services = {};
    this.added = {};
    this.state = {};
    this.launch = {};
    this.reloadThePage = false;
    this.alreadyLaunch = 0;
  }

  public withLanguages(loader: LanguagesLoader): void {
    this.languagesLoader = loader;
  }

  public withServices(loader: ServicesLoader): void {
    this.servicesLoader = loader;
  }

  public init(params: Partial<GDPRConsentParameters> = {}): void {
    // Get params
    this.parameters = Object.assign({}, structuredClone(DefaulGDPRConsentParameters), structuredClone(params));

    // Launch
    if (this.alreadyLaunch === 0) {
      this.alreadyLaunch = 1;

      // Bind events listeners
      window.addEventListener("keydown", (evt) => keydownEvent(this, evt), false);
      window.addEventListener("hashchange", () => hashchangeEvent(this), false);

      // Check if the DOM is already loaded
      if (window.document.readyState === "complete") {
        this.load();
      } else {
        window.addEventListener("load", () => this.load(), false);
      }
    }
  }

  public load(): void {
    // Check if we have loaders
    if (typeof this.languagesLoader !== "function") {
      throw new Error("Missing languages loader !");
    }
    if (typeof this.servicesLoader !== "function") {
      throw new Error("Missing services loader !");
    }

    // Load language and services
    const lang = getLanguage(this.languagesLoader());
    if (lang === undefined) {
      throw new Error("Missing english translation !");
    }
    this.lang = lang;
    this.services = this.servicesLoader(this.user);

    // Delete loaders
    delete this.languagesLoader;
    delete this.servicesLoader;

    const body = document.body;
    const div = document.createElement("div");
    let html = "";
    let index;
    let cat: ServicesCategories[] = ["ads", "analytic", "api", "comment", "social", "support", "video", "other"];
    let i;

    cat = cat.sort((a, b) => {
      if (this.lang[a].title > this.lang[b].title) {
        return 1;
      }
      if (this.lang[a].title < this.lang[b].title) {
        return -1;
      }
      return 0;
    });

    // Prepare the html
    // For the Pannel
    html +=
      '<button type="button" id="tarteaucitron-back" onclick="GDPRConsent.closePanel();" aria-label="' +
      this.lang.close +
      '"></button>';
    html += '<div id="tarteaucitron" role="dialog" aria-labelledby="dialogTitle">';
    html += '   <button type="button" id="tarteaucitron-close-panel" onclick="GDPRConsent.closePanel();">X</button>';
    html += '   <div id="tarteaucitron-services">';

    // L'en-tête des services
    html += '      <div id="tarteaucitron-services-top">';
    html +=
      '         <span class="tarteaucitron-h1" role="heading" aria-level="1" id="dialogTitle">' +
      this.lang.title +
      "</span>";
    html += '         <div id="tarteaucitron-info">';
    html += "          " + this.lang.disclaimer;
    if (this.parameters.websiteName) {
      html += "      " + this.lang.disclaimerWebsite + " " + escape(this.parameters.websiteName) + ".";
    }
    html += "          </div>";
    // Accepter tout ou interdire tout
    html += '         <div class="tarteaucitron-line">';
    html += '               <span class="tarteaucitron-h3" role="heading" aria-level="2">' + this.lang.all + "</span>";
    html += '               <div class="tarteaucitron-ask">';
    html +=
      '                  <button type="button" id="tarteaucitron-all-allowed" class="tarteaucitron-allow" onclick="GDPRConsent.respondAll(true, true);">';
    html += "                        &#10003; " + this.lang.allowAll;
    html += "                  </button> ";
    html +=
      '                  <button type="button" id="tarteaucitron-all-denied" class="tarteaucitron-deny" onclick="GDPRConsent.respondAll(false, true);">';
    html += "                        &#10007; " + this.lang.denyAll;
    html += "                  </button>";
    html += "                </div>";
    html += "           </div>";
    html += "      </div>";

    // La liste des Services
    html += '      <div id="tarteaucitron-services-list">';
    html += '         <div class="clear"></div>';
    if (this.parameters.mandatory === true) {
      html += '<div class="tarteaucitron-cookie-group">';
      html += '   <div class="tarteaucitron-cookie-text">';
      html +=
        '      <span class="tarteaucitron-h3" role="heading" aria-level="2">' + this.lang.mandatoryTitle + "</span>";
      html += '      <span class="tarteaucitron-description">' + this.lang.mandatoryText + "</span>";
      html += "   </div>";
      html += '   <div class="tarteaucitron-cookie-buttons">';
      html += '       <button type="button" class="tarteaucitron-allow solo">';
      html += "           &#10003; " + this.lang.allow;
      html += "       </button> ";
      html += "   </div>";
      html += "</div>";
    }
    for (i = 0; i < cat.length; i += 1) {
      html += '         <li id="tarteaucitron-services-title_' + cat[i] + '" class="tarteaucitron-hidden">';
      html += '            <div class="tarteaucitron-title">';
      html +=
        '               <button type="button" onclick="GDPRConsent.toggle(\'tarteaucitron-details' +
        cat[i] +
        "', 'tarteaucitron-info-box');return false\">&#10011; " +
        this.lang[cat[i]].title +
        "</button>";
      html += "            </div>";
      html +=
        '            <div id="tarteaucitron-details' +
        cat[i] +
        '" class="tarteaucitron-details tarteaucitron-info-box">';
      html += "               " + this.lang[cat[i]].details;
      html += "            </div>";
      html += '         <ul id="tarteaucitron-services_' + cat[i] + '"></ul></li>';
    }
    html +=
      '             <li id="tarteaucitron-no-services-title" class="tarteaucitron-line">' +
      this.lang.noServices +
      "</li>";
    html += "         </ul>";
    html += '         <div id="tarteaucitron-services-bottom">';
    html +=
      '             <button type="button" id="tarteaucitron-save-responses" onclick="GDPRConsent.closePanel();">' +
      this.lang.save +
      "</button>";
    html += "         </div>";
    html += "      </div>";
    html += "   </div>";
    html += "</div>";

    // For the Banner
    if (!this.parameters.acceptAllCta) {
      html += '<div id="tarteaucitron-alert-big" class="tarteaucitron-alert-big-bottom">';
      if (this.parameters.siteDisclaimerTitle !== "" && this.parameters.siteDisclaimerMessage !== "") {
        html += '<div id="tarteaucitron-wrapper">';
        html += '   <div id="tarteaucitron-disclaimer-texte">';
        html += '      <span id="tarteaucitron-site-disclaimer-title">';
        html += "         " + this.parameters.siteDisclaimerTitle;
        html += "      </span>";
        html += '      <span id="tarteaucitron-site-disclaimer-message">';
        html += "          " + this.parameters.siteDisclaimerMessage + "<br />";
        html += "      </span>";
      }
      html += '         <span id="tarteaucitron-disclaimer-alert">';
      html += "             " + this.lang.alertBigPrivacy;
      html += "         </span>";
      html += "      </div>";

      html += '      <div id="tarteaucitron-disclaimer-buttons">';
      html += '          <button type="button" id="tarteaucitron-personalize" onclick="GDPRConsent.openPanel();">';
      html += "              " + this.lang.personalize;
      html += "          </button>";
      html += "      </div>";
      html += "   </div>";
      html += "</div>";
    } else {
      html += '<div id="tarteaucitron-alert-big" class="tarteaucitron-alert-big-bottom">';
      if (this.parameters.siteDisclaimerTitle !== "" && this.parameters.siteDisclaimerMessage !== "") {
        html += '<div id="tarteaucitron-wrapper">';
        html += '   <div id="tarteaucitron-disclaimer-texte">';
        html += '      <span id="tarteaucitron-site-disclaimer-title">';
        html += "         " + this.parameters.siteDisclaimerTitle;
        html += "      </span>";
        html += '      <span id="tarteaucitron-site-disclaimer-message">';
        html += "          " + this.parameters.siteDisclaimerMessage + "<br />";
        html += "      </span>";
      }
      html += '         <span id="tarteaucitron-disclaimer-alert">';
      html += "             " + this.lang.alertBigPrivacy;
      html += "         </span>";
      html += "      </div>";
      html += '      <div id="tarteaucitron-disclaimer-buttons">';
      html += '          <button type="button" id="tarteaucitron-continue" onclick="GDPRConsent.respondAll(false);">';
      html += "              &rarr; " + this.lang.continue;
      html += "          </button>";
      html += '         <div id="tarteaucitron-group-buttons">';
      html +=
        '             <button type="button" id="tarteaucitron-personalize" onclick="GDPRConsent.respondAll(true);">';
      html += "                 &#10003; " + this.lang.acceptAll;
      html += "             </button>";
      html += '             <button type="button" id="tarteaucitron-close-alert" onclick="GDPRConsent.openPanel();">';
      html += "                 " + this.lang.personalize;
      html += "             </button>";
      html += "         </div>";
      html += "      </div>";
      html += "   </div>";
      html += "</div>";
    }

    div.id = "tarteaucitron-root";

    // Append tarteaucitron: #tarteaucitron-root last-child of the body
    body.appendChild(div);
    div.innerHTML = html;

    // Send an event
    trigger(window, "tac.root_available");

    if (this.job !== undefined) {
      this.job = this.cleanArray(this.job);
      for (index = 0; index < this.job.length; index += 1) {
        this.addService(this.job[index]);
      }
    } else {
      this.job = [];
    }

    this.job.push = (id: string): number => {
      if (this.job.indexOf(id) === -1) {
        Array.prototype.push.call(this.job, id);
      }
      this.launch[id] = false;
      this.addService(id);
      return this.job.length;
    };

    if (document.location.hash === this.parameters.hashtag) {
      openPanel(this);
    }
  }

  public addService(serviceId: string): void {
    const s = this.services;
    const service = s[serviceId];
    const cookie = read(this.parameters);
    const isDenied = cookie.indexOf(service.key + "=false") >= 0;
    const isAllowed =
      cookie.indexOf(service.key + "=true") >= 0 ||
      (!service.needConsent && cookie.indexOf(service.key + "=false") < 0);
    const isResponded = cookie.indexOf(service.key + "=false") >= 0 || cookie.indexOf(service.key + "=true") >= 0;

    let html = "";
    if (this.added[service.key] !== true) {
      this.added[service.key] = true;

      html += '<div id="' + service.key + '-line" class="tarteaucitron-cookie-group">';
      html += '   <div class="tarteaucitron-cookie-text">';
      html += '       <span class="tarteaucitron-h3" role="heading" aria-level="3">' + service.name + "</span>";
      html += '       <span id="tacCL' + service.key + '" class="tarteaucitron-description"></span>';
      if (this.parameters.moreInfoLink === true) {
        html +=
          '       <a href="' +
          service.uri +
          '" target="_blank" rel="noreferrer noopener" title="' +
          service.name +
          " " +
          this.lang.newWindow +
          '">';
        html += "           " + this.lang.source;
        html += "       </a>";
      }
      html += "   </div>";
      html += '   <div class="tarteaucitron-cookie-buttons">';
      html +=
        '       <span id="' +
        service.key +
        'Allowed" class="tarteaucitron-switch-state" onclick="GDPRConsent.respond(this, event);">' +
        this.lang.allow +
        "</span>";
      html +=
        '       <div class="tarteaucitron-switch" id="' +
        service.key +
        'Switch" onclick="GDPRConsent.respond(this, event);">';
      html += '          <button type="button" class="tarteaucitron-switch-button"></button>';
      html += "       </div> ";
      html +=
        '       <span id="' +
        service.key +
        'Denied" class="tarteaucitron-switch-state" onclick="GDPRConsent.respond(this, event);">' +
        this.lang.deny +
        "</span>";
      html += "   </div>";
      html += "</li>";

      updateCSSOfElement("tarteaucitron-services-title_" + service.type, "display", "block");

      const serviceTypeEl = document.getElementById("tarteaucitron-services_" + service.type);
      if (serviceTypeEl !== null) {
        serviceTypeEl.innerHTML += html;
      }

      updateCSSOfElement("tarteaucitron-no-services-title", "display", "none");

      order(service.type, this);
    }

    if (isAllowed) {
      if (this.launch[service.key] !== true) {
        this.launch[service.key] = true;
        service.js();
        trigger(window, service.key + "_loaded");
      }
      this.state[service.key] = true;
    } else if (isDenied) {
      if (typeof service.fallback === "function") {
        service.fallback(this.lang);
      }
      this.state[service.key] = false;
    } else if (!isResponded) {
      create(service.key, "wait", this.parameters);
      if (typeof service.fallback === "function") {
        service.fallback(this.lang);
      }
      if (service.lazyConsent !== true) {
        openAlert();
      }
    }

    checkCount(service.key, service, this.lang);
    trigger(window, service.key + "_added");
  }

  public cleanArray(arr: string[]): string[] {
    const s = this.services;

    const len = arr.length;
    let out = [];
    const obj: { [key: string]: boolean } = {};
    for (let i = 0; i < len; i += 1) {
      if (!obj[arr[i]]) {
        obj[arr[i]] = true;
        if (s[arr[i]] !== undefined) {
          out.push(arr[i]);
        }
      }
    }

    out = out.sort(function (a, b) {
      if (s[a].type + s[a].key > s[b].type + s[b].key) {
        return 1;
      }
      if (s[a].type + s[a].key < s[b].type + s[b].key) {
        return -1;
      }
      return 0;
    });

    return out;
  }

  public closePanel(): void {
    closePanel(this);
  }

  public openPanel(): void {
    openPanel(this);
  }

  public respondEffect(key: string, status: boolean): void {
    respondEffect(key, status, this);
  }

  public respondAll(status: boolean | string, closePanelAfter?: boolean): void {
    respondAll(status, this, this.parameters, closePanelAfter);
  }

  public respond(el: HTMLElement, evt: MouseEvent): void {
    respond(el, this, this.parameters, evt);
  }

  public activate(id: string): void {
    activate(id, this, this.parameters);
  }

  public isActivated(id: string): boolean {
    return isActivated(id, this);
  }

  public toggle(id: string, closeClass: string): void {
    toggle(id, closeClass);
  }
}

export const GDPRConsent = new GDPRConsentInstance();
