export function addScript(url: string, attributes?: { [key: string]: string | undefined }, callback?: () => void) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = url;

  for (const attrName in attributes) {
    const attrVal = attributes[attrName];
    if (attrVal !== undefined) {
      script.setAttribute(attrName, attrVal);
    }
  }

  if (typeof callback === "function") {
    let done = false;
    script.onload = function () {
      if (done === false) {
        done = true;
        callback();
      }
    };
  }

  document.getElementsByTagName("head")[0].appendChild(script);
}
