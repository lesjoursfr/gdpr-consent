/* globals module:true, require:true */
const GDPRConsent = require("./gdpr-consent").default;

const { getLanguages } = require("./languages/index").default;
GDPRConsent.withLanguages(getLanguages);

const { getServices } = require("./services/index").default;
GDPRConsent.withServices(getServices);

module.exports = GDPRConsent;
