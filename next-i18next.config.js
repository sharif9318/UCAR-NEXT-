module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "kr", "ru"],
    localeDetection: false,
  },
  // i18next options
  defaultNS: "common",
  ns: ["common"],
  fallbackLng: "en",
  returnNull: false,
  returnEmptyString: false,
  debug: process.env.NODE_ENV === "development",
  // Do not include functions here – they break Next.js JSON serialization
  reloadOnPrerender: process.env.NODE_ENV === "development",
  trailingSlash: true,
};
