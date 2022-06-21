export function addScript(url, id, callback, execute, attrName, attrVal) {
  "use strict";
  let script;
  let done = false;

  if (execute === false) {
    if (typeof callback === "function") {
      callback();
    }
  } else {
    script = document.createElement("script");
    script.type = "text/javascript";
    script.id = id !== undefined ? id : "";
    script.async = true;
    script.src = url;

    if (attrName !== undefined && attrVal !== undefined) {
      script.setAttribute(attrName, attrVal);
    }

    if (typeof callback === "function") {
      script.onreadystatechange = script.onload = function () {
        const state = script.readyState;
        if (!done && (!state || /loaded|complete/.test(state))) {
          done = true;
          callback();
        }
      };
    }

    document.getElementsByTagName("head")[0].appendChild(script);
  }
}

export function searchElements(className, fn) {
  "use strict";
  const elems = document.getElementsByTagName("*");
  let i;
  let index = 0;

  for (i in elems) {
    if (elems[i] !== undefined) {
      for (index = 0; index < className.length; index += 1) {
        if ((" " + elems[i].className + " ").indexOf(" " + className[index] + " ") > -1) {
          fn(elems[i]);
        }
      }
    }
  }
}

export function css(id, property, value) {
  "use strict";
  if (document.getElementById(id) !== null) {
    document.getElementById(id).style[property] = value;
  }
}

export function addClass(id, className) {
  "use strict";
  if (document.getElementById(id) !== null) {
    document.getElementById(id).classList.add(className);
  }
}

export function removeClass(id, className) {
  "use strict";
  if (document.getElementById(id) !== null) {
    document.getElementById(id).classList.remove(className);
  }
}
