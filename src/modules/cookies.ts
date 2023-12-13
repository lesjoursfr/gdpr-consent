import { GDPRConsentParameters, LangInterface, ServiceInterface } from "../interfaces/index.js";

const owner: { [key: string]: string[] } = {};

export function read(gdprConsentParams: GDPRConsentParameters): string {
  const nameEQ = gdprConsentParams.cookieName + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return "";
}

export function create(key: string, status: boolean | string, gdprConsentParams: GDPRConsentParameters): void {
  const d = new Date();
  const time = d.getTime();
  const expireTime = time + gdprConsentParams.timeExpire;
  const regex = new RegExp("!" + key + "=(wait|true|false)", "g");
  const cookie = read(gdprConsentParams).replace(regex, "");
  const value = gdprConsentParams.cookieName + "=" + cookie + "!" + key + "=" + status;

  d.setTime(expireTime);
  document.cookie = value + "; expires=" + d.toUTCString() + "; path=/;";
}

export function purge(arr: string[]): void {
  for (let i = 0; i < arr.length; i += 1) {
    document.cookie = arr[i] + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;";
    document.cookie = arr[i] + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=." + location.hostname + ";";
    document.cookie =
      arr[i] +
      "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=." +
      location.hostname.split(".").slice(-2).join(".") +
      ";";
  }
}

export function checkCount(key: string, service: ServiceInterface, lang: LangInterface): void {
  const arr = service.cookies as unknown as string;
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
