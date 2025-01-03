const messages = {
  fi: {
    header_nav_feedback: "Palaute",
    header_nav_guide: "Käyttöohje",
    finto_url: "https://finto.fi/fi/",
    feedback_url: "http://finto.fi/fi/feedback",
    guide_url: "https://www.kiwi.fi/x/6QAnEg",
    info: "Finto AI — tekoälypohjainen automaattisen sisällönkuvailun palvelu. Finto AI ehdottaa tekstille asiasanoja valitun sanaston pohjalta. Asiasanoja voidaan hyödyntää esimerkiksi tiedonhaun tukena.",
    text_box_label: "Kuvailtava teksti",
    tab_text_input: "Syötä teksti",
    tab_file_input: "Syötä tiedosto",
    tab_url_input: "Syötä URL",
    file_input_browse: "Selaa",
    file_input_select: "Valitse tiedosto",
    url_input_placeholder: "Syötä URL",
    url_input_submit: "Hae teksti",
    supported_file_formats: "Tuetut tiedostomuodot: ",
    alert_file_format: "Tämä tiedostomuoto ei ole tuettu.",
    alert_request_failed: "Tekstin haku epäonnistui.",
    alert_request_failed_url: "Tekstin haku epäonnistui. URL-kohteen koko max. 6 MB. Ei uudelleenohjauksia. Voit yrittää ladata kohteen itsellesi ja syöttää se tiedostona.",
    alert_file_size: "Liian suuri tiedosto; suurin sallittu tiedoston koko on 50 MB.",
    alert_language_detection_failed: "Tekstin kielen tunnistus ei onnistunut automaattisesti. Valitse kieli yllä olevista painikkeista.",
    text_box_placeholder_text_input: "Kopioi tai kirjoita tähän tekstiä ja paina \"Anna aihe-ehdotukset\"-painiketta",
    text_box_placeholder_file_input: "Teksti tiedostosta haetaan tähän. Paina sitten \"Anna aihe-ehdotukset\"-painiketta",
    text_box_placeholder_url_input: "Teksti URL-osoitteesta haetaan tähän. Paina sitten \"Anna aihe-ehdotukset\"-painiketta",
    text_box_background: "Voit myös pudottaa tiedoston tai URL:n tähän",
    loading: "Ladataan...",
    powered_by: "Käytössä",
    suggestions_label: "Sisällönkuvailu",
    vocab_select_label: "Sanasto",
    text_language_select_label: "Tekstin kieli",
    vocabulary_name_yso: "YSO — Yleinen suomalainen ontologia",
    vocabulary_name_ykl: "YKL — Yleisten kirjastojen luokitusjärjestelmä",
    vocabulary_name_kauno: "KAUNO — fiktiivisen aineiston ontologia",
    vocabulary_name_koko: "KOKO-ontologia",
    vocabulary_name_thema: "Thema-aiheluokitus",
    vocabulary_info: "Sanasto: ",
    language_detected_info: "* automaattisesti tunnistettu",
    limit_input_label: "Ehdotusten enimmäismäärä",
    language_select_label: "Termien kieli",
    language_select_same_as_text: "Sama kuin tekstin kieli",
    language_select_fi: "suomi",
    language_select_sv: "ruotsi",
    language_select_en: "englanti",
    language_select_sm: "pohjoissaame",
    get_suggestions: "Anna aihe-ehdotukset",
    suggestions_heading: "Ehdotukset",
    copy_heading: "Kopioi",
    copy_class_title: "Kopioi luokka leikepöydälle",
    copy_term_title: "Kopioi termi leikepöydälle",
    copy_uri_title: "Kopioi URI leikepöydälle",
    copy_label_and_uri_title: "Kopioi termi, URI ja kielikoodi leikepöydälle Melindaa/Alephia varten",
    class_button: "LUOK.",
    term_button: "TERMI",
    no_results: "Ei tuloksia",
    email_label: "Sähköposti:",
    footer_info: "Finto AI on automaattisen sisällönkuvailun palvelu, joka perustuu ",
    footer_info_tool: "-työkaluun.",
    api_heading: "API-palvelu",
    api_description: "Finto AI toimii myös rajapintapalveluna, joka voidaan integroida omiin järjestelmiin.",
    api_info_link: "Lisätietoja",
    api_description_link: "OpenAPI-kuvaus",
    api_info_link_url: "https://www.kiwi.fi/x/VYA_Cg",
    footer_links_heading: "Linkit",
    footer_info_link: "Tietoja Finto AI -palvelusta",
    footer_info_link_url: "https://www.kiwi.fi/x/-oHbCQ",
    footer_wiki_link: "Finto-palvelun asiakaswiki",
    footer_wiki_link_url: "https://www.kiwi.fi/display/Finto",
    footer_accessibility_link: "Saavutettavuus",
    footer_accessibility_link_url: "https://www.kiwi.fi/x/LQBTCw",
    footer_privacy_link: "Tietosuoja",
    footer_privacy_link_url: "https://www.kiwi.fi/x/9YBzEw",
    footer_follow_heading: "Seuraa meitä",
    footer_follow_heading_finto: "Finto-palvelu",
    footer_follow_heading_natlib: "Kansalliskirjasto",
    footer_twitter_link: "X",
    nat_lib_alt: "Kansalliskirjasto",
    nat_lib: "Palvelun tarjoaa Kansalliskirjasto",
    nat_lib_url: "https://www.kansalliskirjasto.fi/fi"
  },
  en: {
    header_nav_feedback: "Feedback",
    header_nav_guide: "User guide",
    finto_url: "https://finto.fi/en/",
    feedback_url: "http://finto.fi/en/feedback",
    guide_url: "https://www.kiwi.fi/x/vIE9FQ",
    info: "Finto AI — a service for automated subject indexing based on artificial intelligence. Finto AI suggests subject headings for texts from a vocabulary. The subjects can be utilized to support information retrieval.",
    text_box_label: "Enter text to be indexed",
    tab_text_input: "Enter text",
    tab_file_input: "Upload file",
    tab_url_input: "Enter URL",
    file_input_browse: "Browse",
    file_input_select: "Choose file",
    url_input_placeholder: "Enter URL",
    url_input_submit: "Fetch text",
    supported_file_formats: "Supported formats: ",
    alert_file_format: "This file format is not supported.",
    alert_request_failed: "Text extraction failed.",
    alert_request_failed_url: "Text extraction failed. Size of URL-targets max. 6 MB. No redirects. You can try downloading the target and then uploading it as a file.",
    alert_file_size: "File is too large; maximum allowed size is 50 MB.",
    alert_language_detection_failed: "Automatic text language detection failed. Please select a language with the buttons above.",
    text_box_placeholder_text_input: "Copy or write text here and press the button \"Get subject suggestions\"",
    text_box_placeholder_file_input: "Text from the file is fetched here. Then press the button \"Get subject suggestions\"",
    text_box_placeholder_url_input: "Text from the URL is fetched here. Then press the button \"Get subject suggestions\"",
    text_box_background: "You can also drop a file or a URL here",
    loading: "Loading...",
    powered_by: "Powered by",
    suggestions_label: "Subject indexing",
    vocab_select_label: "Vocabulary",
    text_language_select_label: "Text language",
    vocabulary_name_yso: "YSO — General Finnish ontology",
    vocabulary_name_ykl: "PLC — Finnish Public Libraries Classification System",
    vocabulary_name_kauno: "KAUNO — ontology for fiction",
    vocabulary_name_koko: "KOKO ontology",
    vocabulary_name_thema: "Thema — subject category scheme for book trading",
    vocabulary_info: "Vocabulary: ",
    language_detected_info: "* automatically detected",
    limit_input_label: "Maximum # of suggestions",
    language_select_label: "Labels language",
    language_select_same_as_text: "Same as text language",
    language_select_fi: "Finnish",
    language_select_sv: "Swedish",
    language_select_en: "English",
    language_select_sm: "Northern Sami",
    get_suggestions: "Get subject suggestions",
    suggestions_heading: "Suggestions",
    copy_heading: "Copy",
    copy_class_title: "Copy class to clipboard",
    copy_term_title: "Copy label to clipboard",
    copy_uri_title: "Copy URI to clipboard",
    copy_label_and_uri_title: "Copy label, URI and language code to clipboard for Melinda/Aleph",
    class_button: "CLASS",
    term_button: "TERM",
    no_results: "No results",
    email_label: "E-mail:",
    footer_info: "Finto AI is a service for automated subject indexing. The service is based on ",
    footer_info_tool: " tool.",
    api_heading: "API service",
    api_description: "Finto AI offers also an API that can be integrated to other systems.",
    api_info_link: "More information",
    api_description_link: "OpenAPI description",
    api_info_link_url: "https://www.kiwi.fi/x/h4A_Cg",
    footer_links_heading: "Links",
    footer_info_link: "Information about Finto AI",
    footer_info_link_url: "https://www.kiwi.fi/x/DYDbCQ",
    footer_wiki_link: "Finto service customer wiki",
    footer_wiki_link_url: "https://www.kiwi.fi/x/CogdCw",
    footer_accessibility_link: "Accessibility statement",
    footer_accessibility_link_url: "https://www.kiwi.fi/x/moE9FQ",
    footer_privacy_link: "Privacy policy",
    footer_privacy_link_url: "https://www.kiwi.fi/x/94BzEw",
    footer_follow_heading: "Follow us",
    footer_follow_heading_finto: "Finto service",
    footer_follow_heading_natlib: "The National Library of Finland",
    footer_twitter_link: "X",
    nat_lib_alt: "The National Library of Finland",
    nat_lib: "The service is offered by the National Library of Finland",
    nat_lib_url: "https://www.kansalliskirjasto.fi/en"
  },
  sv: {
    header_nav_feedback: "Respons",
    header_nav_guide: "Användarmanual",
    finto_url: "https://finto.fi/sv/",
    feedback_url: "http://finto.fi/sv/feedback",
    guide_url: "https://www.kiwi.fi/x/zYE9FQ",
    info: "Finto AI — en tjänst för automatisk innehållsbeskrivning baserad på artificiell intelligens. Finto AI föreslår ämnesord för texter utifrån en vald vokabulär. Ämnesorden kan till exempel användas som stöd för informationssökning.",
    text_box_label: "Text för indexering",
    tab_text_input: "Mata in text",
    tab_file_input: "Ladda upp en fil",
    tab_url_input: "Mata in en URL",
    file_input_browse: "Bläddra",
    file_input_select: "Välj fil",
    url_input_placeholder: "Mata in en URL",
    url_input_submit: "Hämta text",
    supported_file_formats: "Följande format stöds: ",
    alert_file_format: "Det här filformatet stöds inte.",
    alert_request_failed: "Det gick inte att extrahera texten.",
    alert_request_failed_url: "Det gick inte att extrahera texten. URL-objektets storlek max. 6 MB. Inga omdirigeringar. Du kan försöka ladda ner objektet och sedan ladda upp det som en fil.",
    alert_file_size: "För stor fil; den maximala tillåtna filstorleken är 50 MB.",
    alert_language_detection_failed: "Automatisk identifiering av textspråk misslyckades. Välj ett språk med knapparna ovan.",
    text_box_placeholder_text_input: "Kopiera eller skriv text hit och tryck på knappen \"Ge förslag till ämnesord\"",
    text_box_placeholder_file_input: "Texten från filen hämtas hit. Tryck sedan på knappen \"Ge förslag till ämnesord\"",
    text_box_placeholder_url_input: "Texten från URL:en hämtas hit. Tryck sedan på knappen \"Ge förslag till ämnesord\"",
    text_box_background: "Du kan också släppa en fil eller URL här",
    loading: "Laddar...",
    powered_by: " Drivs av",
    suggestions_label: "Innehållsbeskrivning",
    vocab_select_label: "Vokabulär",
    text_language_select_label: "Textens språk",
    vocabulary_name_yso: "ALLFO — Allmän finländsk ontologi",
    vocabulary_name_ykl: "KAB — Allmänna bibliotekens klassifikationssystem",
    vocabulary_name_kauno: "KAUNO — ontologi för fiktivt material",
    vocabulary_name_koko: "KOKO-ontologin",
    vocabulary_name_thema: "Thema-ämneskategorier",
    vocabulary_info: "Vokabulär: ",
    language_detected_info: "* detekteras automatiskt",
    limit_input_label: "Maximalt antal förslag",
    language_select_label: "Termers språk",
    language_select_same_as_text: "Samma som textens språk",
    language_select_fi: "finska",
    language_select_sv: "svenska",
    language_select_en: "engelska",
    language_select_sm: "nordsamiska",
    get_suggestions: "Ge förslag till ämnesord",
    suggestions_heading: "Förslag",
    copy_heading: "kopiera",
    copy_class_title: "Kopiera klass till klippbord",
    copy_term_title: "Kopiera term till klippbord",
    copy_uri_title: "Kopiera URI till klippbord",
    copy_label_and_uri_title: "Kopiera term, URI och språkets kod till klippbord för Melinda/Aleph",
    class_button: "KLASS",
    term_button: "TERM",
    no_results: "Inga resultat",
    email_label: "E-post:",
    footer_info: "Finto AI är en tjänst för automatisk ämnesindexering. Den tjänst är baserat på ",
    footer_info_tool: " verktyg.",
    api_heading: "API-tjänst",
    api_description: "Finto AI är också en API-tjänst som kan integreras med andra system.",
    api_info_link: "Mer information",
    api_description_link: "OpenAPI-beskrivning",
    api_info_link_url: "https://www.kiwi.fi/x/iIA_Cg",
    footer_links_heading: "Länkar",
    footer_info_link: "Information om Finto AI",
    footer_info_link_url: "https://www.kiwi.fi/x/FoDbCQ",
    footer_wiki_link: "Finto-servicens kundwiki",
    footer_wiki_link_url: "https://www.kiwi.fi/x/BogdCw",
    footer_accessibility_link: "Tillgänglighet",
    footer_accessibility_link_url: "https://www.kiwi.fi/x/KABTCw",
    footer_privacy_link: "Dataskydd",
    footer_privacy_link_url: "https://www.kiwi.fi/x/-IBzEw",
    footer_follow_heading: "Följ oss",
    footer_follow_heading_finto: "Finto-service",
    footer_follow_heading_natlib: "Nationalbiblioteket",
    footer_twitter_link: "X",
    nat_lib_alt: "Nationalbiblioteket",
    nat_lib: "Tjänsten erbjuds av Nationalbiblioteket",
    nat_lib_url: "https://www.kansalliskirjasto.fi/sv"
  }
}

const i18n = VueI18n.createI18n({
  locale: 'en',
  fallbackLocale: 'fi',
  messages,
})
