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
            "text-box-label-text": "Enter text to be indexed",
            "text-box-placeholder": 'Copy text here and press the button "Get subject suggestions"',
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
            "copy-heading": "Copy",
            "no-results": "No results",
            "copy-button-label": "Copy label to clipboard",
            "copy-button-uri": "Copy URI to clipboard",
            "copy-button-label-and-uri": "Copy label, URI and language code to clipboard for Melinda/Aleph",
            "footer-text": "The data submitted via the above form or the API will not be saved anywhere. Usage of the service is being monitored for development purposes. ",
            "accessibility-statement": "See the accessibility statement",
            "powered-by": "Powered by ",
            "url-feedback": "http://finto.fi/en/feedback",
            "url-read-more": "https://www.kiwi.fi/x/DYDbCQ",
            "url-api-more-info": "https://www.kiwi.fi/x/h4A_Cg",
            "url-accessibility-statement": "https://www.kiwi.fi/x/LQBTCw",
        },
        'sv': {
            "nav-about": "Information",
            "nav-feedback": "Respons",
            "read-more": "L??s mer...",
            "splash": "Finto AI f??resl??r ??mnesord f??r text. Det ??r baserat p?? Annif, ett verktyg f??r automatisk indexering.",
            "api-title": "API-tj??nst",
            "api-desc": "Finto AI ??r ocks?? en API-tj??nst som kan integreras med andra system.",
            "api-more-info": "Mer information",
            "api-desc-link": "OpenAPI -beskrivning",
            "text-box-label-text": "Text f??r indexering",
            "text-box-placeholder": 'Kopiera text hit och tryck p?? knappen "Ge f??rslag till ??mnesord"',
            "nav-subject-indexing": "Inneh??llsbeskrivning",
            "project": "Vokabul??r och textens spr??k",
            "limit": "Maximalt antal f??rslag",
            "label-language": "F??rslagets spr??k",
            "label-language-option-project": "samma som textens spr??k",
            "label-language-option-fi": "finska",
            "label-language-option-sv": "svenska",
            "label-language-option-en": "engelska",
            "get-suggestions": "Ge f??rslag till ??mnesord",
            "suggestions-heading": "F??rslag",
            "copy-heading": "Kopiera",
            "no-results": "Inga resultat",
            "copy-button-label": "Kopiera term till urklipp",
            "copy-button-uri": "Kopiera URI till urklipp",
            "copy-button-label-and-uri": "Kopiera term, URI och spr??kets kod till urklipp f??r Melinda/Aleph",
            "footer-text": "Uppgifterna som skickas via formul??ret eller API-tj??nsten sparas inte. Anv??ndningen av tj??nsten f??ljs upp och statistikf??rs f??r utvecklings??ndam??l. ",
            "accessibility-statement": "Se tillg??nglighetsutl??tande",
            "powered-by": "Drivs av ",
            "url-feedback": "http://finto.fi/sv/feedback",
            "url-read-more": "https://www.kiwi.fi/x/FoDbCQ",
            "url-api-more-info": "https://www.kiwi.fi/x/iIA_Cg",
            "url-accessibility-statement": "https://www.kiwi.fi/x/KABTCw",
        },

        'fi': {
            "nav-about": "Tietoja",
            "nav-feedback": "Palaute",
            "read-more": "Lue lis????...",
            "splash": "Finto AI ehdottaa tekstille sopivia aiheita. Palvelu perustuu Annif-ty??kaluun.",
            "api-title": "API-palvelu",
            "api-desc": "Finto AI toimii my??s rajapintapalveluna, joka voidaan integroida omiin j??rjestelmiin.",
            "api-more-info": "Lis??tietoja",
            "api-desc-link": "OpenAPI-kuvaus",
            "text-box-label-text": "Kuvailtava teksti",
            "text-box-placeholder": 'Kopioi t??h??n teksti?? ja paina "Anna aihe-ehdotukset"-nappia',
            "nav-subject-indexing": "Sis??ll??nkuvailu",
            "project": "Sanasto ja tekstin kieli",
            "limit": "Ehdotusten enimm??ism????r??",
            "label-language": "Aihe-ehdotusten kieli",
            "label-language-option-project": "sama kuin tekstin kieli",
            "label-language-option-fi": "suomi",
            "label-language-option-sv": "ruotsi",
            "label-language-option-en": "englanti",
            "get-suggestions": "Anna aihe-ehdotukset",
            "suggestions-heading": "Ehdotetut aiheet",
            "copy-heading": "Kopioi",
            "no-results": "Ei tuloksia",
            "copy-button-label": "Kopioi termi leikep??yd??lle",
            "copy-button-uri": "Kopioi URI leikep??yd??lle",
            "copy-button-label-and-uri": "Kopioi termi, URI ja kielikoodi leikep??yd??lle Melindaa/Alephia varten",
            "footer-text": "Lomakkeen ja rajapintapalveluiden kautta l??hettyj?? tietoja ei talleteta. Palvelun k??ytt???? seurataan ja tilastoidaan palvelun kehitt??miseksi. ",
            "accessibility-statement": "Tutustu saavutettavuusselosteeseen",
            "powered-by": "Voimanl??hteen?? ",
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
