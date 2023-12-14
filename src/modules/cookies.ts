import {
  AbstractKeyValueStore,
  CookiesKeyValueStore,
  KeyValueStorageTypes,
  getDefaultKeyValueStore,
} from "@lesjoursfr/browser-tools";
import Cookies from "js-cookie";
import { GDPRConsentParameters, LangInterface, ServiceInterface } from "../interfaces/index.js";

const owner: { [key: string]: string[] } = {};

let kStore: AbstractKeyValueStore | null = null;
function getStore({ cookieName, timeExpire, preferLocalStorage }: GDPRConsentParameters): AbstractKeyValueStore {
  if (kStore === null) {
    kStore = preferLocalStorage ? getDefaultKeyValueStore(timeExpire) : new CookiesKeyValueStore(timeExpire);
    if (kStore.type === KeyValueStorageTypes.localStorage && Cookies.get(cookieName) !== undefined) {
      kStore.setItem(cookieName, Cookies.get(cookieName)!);
      Cookies.remove(cookieName);
    }
  }

  return kStore;
}

export function read(gdprConsentParams: GDPRConsentParameters): string {
  const store = getStore(gdprConsentParams);

  return store.getItem(gdprConsentParams.cookieName) ?? "";
}

export function create(key: string, status: boolean | string, gdprConsentParams: GDPRConsentParameters): void {
  const store = getStore(gdprConsentParams);
  const regex = new RegExp("!" + key + "=(wait|true|false)", "g");
  const cookie = read(gdprConsentParams).replace(regex, "");
  const value = cookie + "!" + key + "=" + status;

  store.setItem(gdprConsentParams.cookieName, value);
}

export function purge(arr: string[]): void {
  for (let i = 0; i < arr.length; i += 1) {
    Cookies.remove(arr[i]);
    Cookies.remove(arr[i], { path: "/" });
    Cookies.remove(arr[i], { path: "/", domain: "." + location.hostname });
    Cookies.remove(arr[i], { path: "/", domain: "." + location.hostname.split(".").slice(-2).join(".") });
  }
}

export function checkCount(key: string, service: ServiceInterface, lang: LangInterface): void {
  const arr = service.cookies;
  const nb = arr.length;
  let nbCurrent = 0;
  let html = "";
  const status = document.cookie.indexOf(key + "=true");

  if (status >= 0 && nb === 0) {
    html += lang.useNoCookie;
  } else if (status >= 0) {
    for (let i = 0; i < nb; i += 1) {
      if (document.cookie.indexOf(arr[i] + "=") !== -1) {
        nbCurrent += 1;
        if (owner[arr[i]] === undefined) {
          owner[arr[i]] = [];
        }
        if (owner[arr[i]].indexOf(service.name) === -1) {
          owner[arr[i]].push(service.name);
        }
      }
    }

    if (nbCurrent > 0) {
      html += lang.useCookieCurrent + " " + nbCurrent + " cookie";
      if (nbCurrent > 1) {
        html += "s";
      }
      html += ".";
    } else {
      html += lang.useNoCookie;
    }
  } else if (nb === 0) {
    html = lang.noCookie;
  } else {
    html += lang.useCookie + " " + nb + " cookie";
    if (nb > 1) {
      html += "s";
    }
    html += ".";
  }

  const element = document.getElementById("tacCL" + key);
  if (element !== null) {
    element.innerHTML = html;
  }
}
