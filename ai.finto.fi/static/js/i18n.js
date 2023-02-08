function defaultLanguage() {
    var locale = $.i18n().locale;
    var languages = ["fi", "sv", "en"];
    for (let i = 0; i < languages.length; ++i) {
        if (locale == languages[i])
            return languages[i];
        if (locale.startsWith(languages[i] + "-"))
            return languages[i];
    }
    return languages[0];
}


var setLocale = function(locale) {

    if (locale) {
        $.i18n().locale = locale;
    } else {
        $.i18n().locale = defaultLanguage();
    }

    $('body').i18n();
    $('html').attr('lang', $.i18n().locale);
    
    /* switch link targets */
    $('#nav-feedback').attr("href", $.i18n('url-feedback'));
    $('#nav-about').attr("href", $.i18n('url-read-more'));
    $('#read-more').attr("href", $.i18n('url-read-more'));
    $('#api-more-info').attr("href", $.i18n('url-api-more-info'));
    $('#accessibility-statement').attr("href", $.i18n('url-accessibility-statement'));

    $('#switch-locale a').show();
    $('a[data-locale=' + $.i18n().locale + ']').hide();

};

jQuery(function() {

    $.i18n().load({

        'en': {
            "nav-about": "About",
            "nav-feedback": "Feedback",
            "read-more": "Read more...",
            "splash": "Finto AI suggests subjects for a given text. It's based on Annif, a tool for automated subject indexing.",
            "api-title": "API service",
            "api-desc": "Finto AI is also an API service that can be integrated to other systems.",
            "api-more-info": "More information",
            "api-desc-link": "OpenAPI description",
            "nav-tab-text-input": "Enter text",
            "nav-tab-file-input": "Upload file",
            "nav-tab-url-input": "Enter URL",
            "form-file-input": "Choose file",
            "form-url-input-placeholder": "Enter URL",
            "button-select-url": "Fetch text",
            "supported-file-formats": "Supported formats: ",
            "alert-not-supported-format": "This file format is not supported.",
            "alert-textract-request-failed": "Text extraction failed.",
            "alert-too-big-file": "File is too large; maximum allowed size is 50 MB.",
            "text-box-label-text": "Enter text to be indexed",
            "text-box-placeholder-text-input": 'Copy text here and press the button "Get subject suggestions"',
            "text-box-placeholder-file-input": 'Text from the file is fetched here. Then press the button "Get subject suggestions"',
            "text-box-placeholder-url-input": 'Text from the URL is fetched here. Then press the button "Get subject suggestions"',
            "text-box-background": 'You can also drop a file or a URL here',
            "loading": "Loading...",
            "nav-subject-indexing": "Subject indexing",
            "project": "Vocabulary and text language",
            "limit": "Maximum # of suggestions",
            "label-language": "Suggestions language",
            "label-language-option-project": "same as text language",
            "label-language-option-fi": "Finnish",
            "label-language-option-sv": "Swedish",
            "label-language-option-en": "English",
            "get-suggestions": "Get subject suggestions",
            "suggestions-heading": "Suggestions",
            "select-all-suggestions": "Select all",
            "no-results": "No results",
            "copy-button-label": "Copy label to clipboard",
            "copy-button-uri": "Copy URI to clipboard",
            "copy-button-label-and-uri": "Copy label, URI and language code to clipboard for Melinda/Aleph",
            "copy-many-terms": "Copy selected terms",
            "copy-many-uris": "Copy selected URIs",
            "footer-text": "The data submitted via the above form or the API will not be saved anywhere. Usage of the service is being monitored for development purposes. ",
            "accessibility-statement": "See the accessibility statement",
            "powered-by": "Powered by <a href='https://www.annif.org'>Annif</a> version ",
            "url-feedback": "http://finto.fi/en/feedback",
            "url-read-more": "https://www.kiwi.fi/x/DYDbCQ",
            "url-api-more-info": "https://www.kiwi.fi/x/h4A_Cg",
            "url-accessibility-statement": "https://www.kiwi.fi/x/LQBTCw",
        },
        'sv': {
            "nav-about": "Information",
            "nav-feedback": "Respons",
            "read-more": "Läs mer...",
            "splash": "Finto AI föreslår ämnesord för text. Det är baserat på Annif, ett verktyg för automatisk indexering.",
            "api-title": "API-tjänst",
            "api-desc": "Finto AI är också en API-tjänst som kan integreras med andra system.",
            "api-more-info": "Mer information",
            "api-desc-link": "OpenAPI -beskrivning",
            "nav-tab-text-input": "Mata in text",
            "nav-tab-file-input": "Ladda upp en fil",
            "nav-tab-url-input": "Mata in en URL",
            "form-file-input": "Välj fil",
            "form-url-input-placeholder": "Mata in en URL",
            "button-select-url": "Hämta text",
            "supported-file-formats": "Följande format stöds: ",
            "alert-not-supported-format": "Det här filformatet stöds inte.",
            "alert-textract-request-failed": "Det gick inte att extrahera text.",
            "alert-too-big-file": "För stor fil; den maximala tillåtna filstorleken är 50 MB.",
            "text-box-label-text": "Text för indexering",
            "text-box-placeholder-text-input": 'Kopiera text hit och tryck på knappen "Ge förslag till ämnesord"',
            "text-box-placeholder-file-input": 'Texten från filen hämtas hit. Tryck sedan på knappen "Ge förslag till ämnesord"',
            "text-box-placeholder-url-input": 'Texten från URL:en hämtas hit. Tryck sedan på knappen "Ge förslag till ämnesord"',
            "text-box-background": 'Du kan också släppa en fil eller URL här',
            "loading": "Laddar...",
            "nav-subject-indexing": "Innehållsbeskrivning",
            "project": "Vokabulär och textens språk",
            "limit": "Maximalt antal förslag",
            "label-language": "Förslagets språk",
            "label-language-option-project": "samma som textens språk",
            "label-language-option-fi": "finska",
            "label-language-option-sv": "svenska",
            "label-language-option-en": "engelska",
            "get-suggestions": "Ge förslag till ämnesord",
            "suggestions-heading": "Förslag",
            "select-all-suggestions": "Välj alla",
            "no-results": "Inga resultat",
            "copy-button-label": "Kopiera term till urklipp",
            "copy-button-uri": "Kopiera URI till urklipp",
            "copy-button-label-and-uri": "Kopiera term, URI och språkets kod till urklipp för Melinda/Aleph",
            "copy-many-terms": "Kopiera valda termer",
            "copy-many-uris": "Kopiera valda URIer",
            "footer-text": "Uppgifterna som skickas via formuläret eller API-tjänsten sparas inte. Användningen av tjänsten följs upp och statistikförs för utvecklingsändamål. ",
            "accessibility-statement": "Se tillgänglighetsutlåtande",
            "powered-by": "Drivs av <a href='https://www.annif.org'>Annif</a> version ",
            "url-feedback": "http://finto.fi/sv/feedback",
            "url-read-more": "https://www.kiwi.fi/x/FoDbCQ",
            "url-api-more-info": "https://www.kiwi.fi/x/iIA_Cg",
            "url-accessibility-statement": "https://www.kiwi.fi/x/KABTCw",
        },

        'fi': {
            "nav-about": "Tietoja",
            "nav-feedback": "Palaute",
            "read-more": "Lue lisää...",
            "splash": "Finto AI ehdottaa tekstille sopivia aiheita. Palvelu perustuu Annif-työkaluun.",
            "api-title": "API-palvelu",
            "api-desc": "Finto AI toimii myös rajapintapalveluna, joka voidaan integroida omiin järjestelmiin.",
            "api-more-info": "Lisätietoja",
            "api-desc-link": "OpenAPI-kuvaus",
            "nav-tab-text-input": "Syötä teksti",
            "nav-tab-file-input": "Syötä tiedosto",
            "nav-tab-url-input": "Syötä URL",
            "form-file-input": "Valitse tiedosto",
            "form-url-input": "Syötä URL",
            "form-url-input-placeholder": "Syötä URL",
            "button-select-url": "Hae teksti",
            "supported-file-formats": "Tuetut tiedostomuodot: ",
            "alert-not-supported-format": "Tämä tiedostomuoto ei ole tuettu.",
            "alert-textract-request-failed": "Tekstin haku epäonnistui.",
            "alert-too-big-file": "Liian suuri tiedosto; suurin sallittu tiedoston koko on 50 MB.",
            "text-box-label-text": "Kuvailtava teksti",
            "text-box-placeholder-text-input": 'Kopioi teksti tähän ja paina “Anna aihe-ehdotukset”-painiketta',
            "text-box-placeholder-file-input": 'Teksti tiedostosta haetaan tähän. Paina sitten "Anna aihe-ehdotukset"-painiketta',
            "text-box-placeholder-url-input": 'Teksti URL-osoitteesta haetaan tähän. Paina sitten “Anna aihe-ehdotukset”-painiketta',
            "text-box-background": 'Voit myös pudottaa tiedoston tai URL:n tähän',
            "loading": "Ladataan...",
            "nav-subject-indexing": "Sisällönkuvailu",
            "project": "Sanasto ja tekstin kieli",
            "limit": "Ehdotusten enimmäismäärä",
            "label-language": "Aihe-ehdotusten kieli",
            "label-language-option-project": "sama kuin tekstin kieli",
            "label-language-option-fi": "suomi",
            "label-language-option-sv": "ruotsi",
            "label-language-option-en": "englanti",
            "get-suggestions": "Anna aihe-ehdotukset",
            "suggestions-heading": "Ehdotetut aiheet",
            "select-all-suggestions": "Valitse kaikki",
            "no-results": "Ei tuloksia",
            "copy-button-label": "Kopioi termi leikepöydälle",
            "copy-button-uri": "Kopioi URI leikepöydälle",
            "copy-button-label-and-uri": "Kopioi termi, URI ja kielikoodi leikepöydälle Melindaa/Alephia varten",
            "copy-many-terms": "Kopioi valitut termit",
            "copy-many-uris": "Kopioi valitut URIt",
            "footer-text": "Lomakkeen ja rajapintapalveluiden kautta lähettyjä tietoja ei talleteta. Palvelun käyttöä seurataan ja tilastoidaan palvelun kehittämiseksi. ",
            "accessibility-statement": "Tutustu saavutettavuusselosteeseen",
            "powered-by": "Perustuu <a href='https://www.annif.org'>Annifin</a> versioon ",
            "url-feedback": "http://finto.fi/fi/feedback",
            "url-read-more": "https://www.kiwi.fi/x/-oHbCQ",
            "url-api-more-info": "https://www.kiwi.fi/x/VYA_Cg",
            "url-accessibility-statement": "https://www.kiwi.fi/x/LQBTCw",
        }

    }).done(function() {
        setLocale(url('?locale'));

        History.Adapter.bind(window, 'statechange', function() {
            setLocale(url('?locale'));
        });

        $('#switch-locale').on('click', 'a', function(e) {
            e.preventDefault();
            History.pushState(null, null, "?locale=" + $(this).data('locale'));
        });
    });
});
