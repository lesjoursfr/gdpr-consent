import { GDPRConsent } from "../src/gdpr-consent.js";
import { getLanguages } from "../src/languages/index.js";
import { getServices } from "../src/services/index.js";

import "../src/css/gdpr-consent.scss";

GDPRConsent.withLanguages(getLanguages);
GDPRConsent.withServices(getServices);

export default GDPRConsent;
