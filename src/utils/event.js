export function sendEvent(eventKey) {
  if (eventKey !== undefined) {
    window.dispatchEvent(new Event(eventKey));
  }
}
