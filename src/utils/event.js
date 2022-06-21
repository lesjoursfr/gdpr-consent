/* globals Event:true */
export function sendEvent(eventKey) {
  if (eventKey !== undefined) {
    // ie compatibility
    let sendEventItem;
    if (typeof Event === "function") {
      sendEventItem = new Event(eventKey);
    } else {
      sendEventItem = document.createEvent("Event");
      sendEventItem.initEvent(eventKey, true, true);
    }
    // end ie compatibility

    window.dispatchEvent(sendEventItem);
  }
}
