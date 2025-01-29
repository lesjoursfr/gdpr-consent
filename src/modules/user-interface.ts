import { addClassToElement, removeClassFromElement, trigger, updateCSSOfElement } from "@lesjoursfr/browser-tools";
import { GDPRConsentParameters, GDPRConsentState } from "../interfaces/index.js";
import { checkCount, create, purge } from "./cookies.js";

let alertIsClosed = true;

export function closeAlert(): void {
  if (alertIsClosed === true) {
    return;
  }

  updateCSSOfElement("tarteaucitron-alert-big", "display", "none");
  removeClassFromElement("tarteaucitron-root", "tarteaucitron-before-visible");
  alertIsClosed = true;
  trigger(window, "tac.close_alert");
}

export function openAlert(): void {
  if (alertIsClosed === false) {
    return;
  }

  updateCSSOfElement("tarteaucitron-alert-big", "display", "block");
  addClassToElement("tarteaucitron-root", "tarteaucitron-before-visible");
  alertIsClosed = false;
  trigger(window, "tac.open_alert");
}

export function closePanel(gdprConsentState: GDPRConsentState): void {
  if (document.location.hash === gdprConsentState.parameters.hashtag) {
    if (window.history) {
      window.history.replaceState("", document.title, window.location.pathname + window.location.search);
    } else {
      document.location.hash = "";
    }
  }
  updateCSSOfElement("tarteaucitron", "display", "none");

  for (const elem of document.getElementsByClassName("tarteaucitron-info-box") as HTMLCollectionOf<HTMLElement>) {
    elem.style.display = "none";
  }

  if (gdprConsentState.reloadThePage === true) {
    window.location.reload();
  } else {
    updateCSSOfElement("tarteaucitron-back", "display", "none");
  }
  document.getElementById("tarteaucitron-close-alert")?.focus();
  document.getElementsByTagName("body")[0].classList.remove("modal-open");

  trigger(window, "tac.close_panel");
}

export function respondEffect(key: string, choice: boolean | string, gdprConsentState: GDPRConsentState): void {
  const switchBtn = document.getElementById(key + "Switch")!;
  const allowedState = document.getElementById(key + "Allowed")!;
  const deniedState = document.getElementById(key + "Denied")!;
  switchBtn.classList.remove("switch-denied");
  switchBtn.classList.remove("switch-allowed");
  allowedState.classList.remove("active");
  deniedState.classList.remove("active");

  // Style des switch
  if (choice === true) {
    switchBtn.classList.add("switch-allowed");
    switchBtn.children[0].innerHTML = "&#10003;";
    allowedState.classList.add("active");
  } else {
    switchBtn.classList.add("switch-denied");
    switchBtn.children[0].innerHTML = "&#10007;";
    deniedState.classList.add("active");
  }

  // Compter quels cookies ont été acceptés/refusés/répondus
  let missingResponses = false;
  let nbAllowed = 0;
  let nbDenied = 0;
  for (let index = 0; index < gdprConsentState.job.length; index++) {
    const serviceId = gdprConsentState.job[index];
    const serviceState = gdprConsentState.state[serviceId];
    if (serviceState !== undefined) {
      if (serviceState === true) {
        nbAllowed += 1;
      } else {
        nbDenied += 1;
      }
    } else if (gdprConsentState.services[serviceId].lazyConsent !== true) {
      missingResponses = true;
    }
  }

  // Si tous les cookies obligatoires ont été répondus, je ferme le bandeau
  if (!missingResponses) {
    closeAlert();
  }

  // Si tous les cookies ont été acceptés/refusés, je change le style des boutons
  if (nbAllowed === gdprConsentState.job.length) {
    removeClassFromElement("tarteaucitron-all-denied", "tarteaucitron-is-selected");
    addClassToElement("tarteaucitron-all-allowed", "tarteaucitron-is-selected");
  } else if (nbDenied === gdprConsentState.job.length) {
    removeClassFromElement("tarteaucitron-all-allowed", "tarteaucitron-is-selected");
    addClassToElement("tarteaucitron-all-denied", "tarteaucitron-is-selected");
  }

  // Purge the cookies for the service
  const cookies = gdprConsentState.services[key].cookies;
  if (cookies.length > 0 && choice === false) {
    purge(cookies);
  }

  // Compteur de cookies affiché sous le nom du cookie
  if (choice === true) {
    const element = document.getElementById("tacCL" + key);
    if (element !== null) {
      element.innerHTML = "...";
    }
    setTimeout(function () {
      checkCount(key, gdprConsentState.services[key], gdprConsentState.lang);
    }, 2500);
  } else {
    checkCount(key, gdprConsentState.services[key], gdprConsentState.lang);
  }
}

export function openPanel(gdprConsentState: GDPRConsentState): void {
  updateCSSOfElement("tarteaucitron", "display", "block");
  updateCSSOfElement("tarteaucitron-back", "display", "block");

  document.getElementById("tarteaucitron-close-panel")!.focus();
  document.getElementsByTagName("body")[0].classList.add("modal-open");

  for (let index = 0; index < gdprConsentState.job.length; index++) {
    if (gdprConsentState.state[gdprConsentState.job[index]] !== undefined) {
      respondEffect(gdprConsentState.job[index], gdprConsentState.state[gdprConsentState.job[index]], gdprConsentState);
    }
  }

  trigger(window, "tac.open_panel");
}

export function respondAll(
  status: boolean | string,
  gdprConsentState: GDPRConsentState,
  gdprConsentParams: GDPRConsentParameters,
  closePanelAfter: boolean = false
): void {
  const s = gdprConsentState.services;

  for (let index = 0; index < gdprConsentState.job.length; index += 1) {
    const service = s[gdprConsentState.job[index]];
    const key = service.key;

    if (gdprConsentState.state[key] !== status) {
      if (status === false && gdprConsentState.launch[key] === true) {
        gdprConsentState.reloadThePage = true;
      }
      if (gdprConsentState.launch[key] !== true && status === true) {
        gdprConsentState.launch[key] = true;
        gdprConsentState.services[key].js();
      }
      gdprConsentState.state[key] = status;
      create(key, status, gdprConsentParams);
      respondEffect(key, status, gdprConsentState);
    }
  }

  if (closePanelAfter) {
    closePanel(gdprConsentState);
  }
}

export function respond(
  el: HTMLElement,
  gdprConsentState: GDPRConsentState,
  gdprConsentParams: GDPRConsentParameters,
  event: MouseEvent
): void {
  const key = el.id.replace(/(Eng[0-9]+|Allow|Deni)ed|Switch/g, "");
  const elPos = el.getBoundingClientRect();
  const mousePosition = event.clientX;

  let status!: boolean;
  if (el.classList.contains("tarteaucitron-switch")) {
    // Cas 1 : Je clique sur le switch
    // Je regarde si il a déjà été activé ou refusé...
    if (gdprConsentState.state[key] !== undefined) {
      if (el.classList.contains("switch-denied")) {
        status = true;
      } else {
        status = false;
      }
    } else if (mousePosition < elPos.left + el.clientWidth / 2) {
      status = true;
    } else {
      status = false;
    }
  } else if (el.classList.contains("tarteaucitron-switch-state")) {
    // Cas 2 : Je clique sur "Autoriser" ou "Interdire"
    // Je vérifie que je ne reclique pas sur la même valeur
    if (el.id.includes("Allowed") && gdprConsentState.state[key] !== true) {
      status = true;
    } else if (el.id.includes("Denied") && gdprConsentState.state[key] !== false) {
      status = false;
    } else {
      return;
    }
  }

  if (status === true && gdprConsentState.launch[key] !== true) {
    gdprConsentState.launch[key] = true;
    trigger(window, key + "_loaded");
    gdprConsentState.services[key].js();
  }

  if (status === false && gdprConsentState.launch[key] === true) {
    gdprConsentState.reloadThePage = true;
  }

  gdprConsentState.state[key] = status;
  create(key, status, gdprConsentParams);
  respondEffect(key, status, gdprConsentState);
}

export function activate(
  id: string,
  gdprConsentState: GDPRConsentState,
  gdprConsentParams: GDPRConsentParameters
): void {
  if (gdprConsentState.launch[id] === true) {
    return;
  }

  gdprConsentState.launch[id] = true;
  trigger(window, id + "_loaded");
  gdprConsentState.services[id].js();
  gdprConsentState.state[id] = true;
  create(id, true, gdprConsentParams);
  respondEffect(id, true, gdprConsentState);
}

export function isActivated(id: string, gdprConsentState: GDPRConsentState): boolean {
  return gdprConsentState.state[id] === true;
}

export function toggle(id: string, closeClass: string): void {
  const div = document.getElementById(id);
  if (div === null) {
    return;
  }

  if (closeClass !== undefined) {
    for (const elem of document.getElementsByClassName(closeClass) as HTMLCollectionOf<HTMLElement>) {
      if (elem.id !== id) {
        elem.style.display = "none";
      }
    }
  }

  if (div.style.display !== "block") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}

export function order(id: string, gdprConsentState: GDPRConsentState): void {
  const main = document.getElementById("tarteaucitron-services_" + id);
  if (main === null) {
    return;
  }

  const children = [...main.children];
  children.sort((a, b) => {
    if (
      gdprConsentState.services[a.id.replace(/-line/g, "")].name >
      gdprConsentState.services[b.id.replace(/-line/g, "")].name
    ) {
      return 1;
    }
    if (
      gdprConsentState.services[a.id.replace(/-line/g, "")].name <
      gdprConsentState.services[b.id.replace(/-line/g, "")].name
    ) {
      return -1;
    }
    return 0;
  });

  for (const child of children) {
    main.appendChild(child);
  }
}
