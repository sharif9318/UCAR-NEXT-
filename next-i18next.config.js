module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "kr", "ru"],
    localeDetection: false,
  },

  defaultNS: "common",
  ns: ["common"],
  fallbackLng: "en",
  returnNull: false,
  returnEmptyString: false,
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  trailingSlash: true,
};
