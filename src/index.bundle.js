/* globals module:true, require:true */
require("./css/main.scss");

const GDPRConsent = require("./gdpr-consent").default;

const { getLanguages } = require("./languages/index");
GDPRConsent.withLanguages(getLanguages);

const { getServices } = require("./services/index");
GDPRConsent.withServices(getServices);

module.exports = GDPRConsent;
