const translation = window.i18nextify.init({
  keyAttr: 'i18next-key',
  translateAttributes: ['placeholder', 'alt', 'title', 'value#input.type=submit'],
  fallbackLng: ['fi', 'sv', 'en'],
  backend: {
    loadPath: 'locales/{{lng}}/{{ns}}.json'
  },
})

window.i18nextify.i18next.on("languageChanged", function (c) {
  window.i18nextify.forceRerender()
})

function chngLng (lng) {
  window.i18nextify.i18next.changeLanguage(lng)
}
