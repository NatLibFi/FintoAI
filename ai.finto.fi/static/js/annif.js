
if (window.location.protocol.startsWith('http')) {
    // http or https - use APIs of current Annif and textract instances
    var annif_base_url = '/v1/';
    var textract_url = '/textract';
} else {
    // local development case - use Finto AI dev API and textract running on localhost via port 8001
    var annif_base_url = 'https://ai.dev.finto.fi/v1/';
    var textract_url = 'http://localhost:8001/textract';
}
var projects = {};

function clearResults() {
    $('#results').empty();
    $('#suggestions').hide();
}

function fetchProjects() {
    $.ajax({
        url: annif_base_url + "projects",
        method: 'GET',
        success: function(data) {
            $('#project').empty();
            $.each(data.projects, function(idx, value) {
                $('#project').append(
                    $('<option>').attr('value',value.project_id).append(value.name)
                );
                projects[value.project_id] = value;
            });
        }
    });
}

function makeLabelLanguageOptions() {
    $('#label-language').append(
        $('<option>').attr('value','project-language').attr('data-i18n','label-language-option-project'),
        $('<option>').attr('value','fi').attr('data-i18n','label-language-option-fi'),
        $('<option>').attr('value','sv').attr('data-i18n','label-language-option-sv'),
        $('<option>').attr('value','en').attr('data-i18n','label-language-option-en'),
    );
}

function getLabelPromise(uri, lang) {
    return $.ajax({
        url: "https://api.finto.fi/rest/v1/label?uri=" + uri + "&lang=" + lang,
        method: 'GET'
    });
}

function showResults(data) {
    $.each(data.results, function(idx, value) {
        $('#no-results').hide();
        $('#results').append(
            $('<li class="list-group-item p-0">').append(
                $('<meter class="mr-2">').attr('value',value.score).attr('max',1.0).attr('title',value.score.toFixed(4)),
                $('<a id="uri-link" class="my-2" target="_blank">').attr('href',value.uri).append(value.label),
                $('<div class="btn-group" role="group" id="copy-buttons"> \
                    <button type="button" class="btn btn-secondary copy-button" id="copy-button-label" data-i18n="[title]copy-button-label" \
                        onclick="copyLabelToClipboard(this);"></button><!-- \
                    --><button type="button" class="btn btn-secondary copy-button" id="copy-button-uri" data-i18n="[title]copy-button-uri" \
                        onclick="copyUriToClipboard(this);"></button><!-- \
                    --><button type="button" class="btn btn-secondary copy-button" id="copy-button-label-and-uri" data-i18n="[title]copy-button-label-and-uri" \
                        onclick="copyUriAndLabelToClipboard(this);"></button> \
                </div></li>')
            )
        );
        $('#results').i18n();
        $('#results').show();
    });
}

function selectFile(input) {
    const selectedFile = input.files[0];
    $('.custom-file-label').html(selectedFile.name);
    readFile(selectedFile);
}

function selectUrl() {
    readUrl($('#input-url').val());
}

function readInput(input) {
    const files = input.files;
    const url = input.getData('URL');
    if (files && files[0]) {
        readFile(files[0]);
    } else if (url) {
        readUrl(url);
    }
}

const supportedFormats = ['txt', 'pdf', 'doc', 'docx', 'odt', 'rtf', 'pptx', 'epub'];

function checkFormatSupport(extension) {
    if (!supportedFormats.includes(extension)) {
        alert('Tiedostomuotoa ei tuettu: ' + extension);
        throw "Unsupported format " + extension;
    }
}

function checkFileSize(file) {
    if (file.size > 50000000) {
        alert('Liian suuri tiedosto; suurin sallittu tiedoston koko on 50 MB.');
        throw "File size exceeds maximum";
    }
}

function readFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    checkFileSize(file);
    checkFormatSupport(extension);
    $('.custom-file-label').html(file.name);
    prepareExtraction();
    if (extension === 'txt') {
        const reader = new FileReader();
        reader.onload = function() {
            finishExtraction(file.name, reader.result);
        }
        reader.readAsText(file);
    } else {
        let uploadFileFormData = new FormData();
        uploadFileFormData.append('file', file);
        $.ajax({
            url: textract_url,
            method: 'POST',
            data: uploadFileFormData,
            contentType: false,
            processData: false,
            success: function(data) {
                finishExtraction(file.name, data.text);
            }
        });
    }
}

function readUrl(url) {
    const plainUrl = url.split('?')[0];  // Remove possible parameters
    const extension = plainUrl.split('.').pop().toLowerCase();
    checkFormatSupport(extension);
    prepareExtraction();
    $.ajax({
        url: textract_url + '-url',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({"file_url": plainUrl}),
        success: function(data) {
            finishExtraction(plainUrl, data.text);
        }
    });
}

function prepareExtraction() {
    $('#text').val('');
    $('#suggestions').hide();
    $('#results').empty();
    disableButton();
    $('#upload-spinner').css('visibility', 'visible');
    $('#text').prop('placeholder', 'Ladataan...');
    $('#text-background').css('visibility', 'hidden');
}

function finishExtraction(fileName, text) {
    $('#upload-spinner').css('visibility', 'hidden');
    $('#text').val(text);
    $('#text').prop('placeholder', 'Kopioi tähän tekstiä ja paina "Anna aihe-ehdotukset"-nappia');
    enableButton();
    $('#get-suggestions').focus();
}

function copyUriToClipboard(buttonItem) {
    var uri = buttonItem.parentElement.parentElement.childNodes[1].href;
    navigator.clipboard.writeText(uri);
}

function copyLabelToClipboard(buttonItem) {
    var label = buttonItem.parentElement.parentElement.childNodes[1].textContent;
    navigator.clipboard.writeText(label);
}

var languageCodes = {
    'fi': 'fin',
    'sv': 'swe',
    'en': 'eng'
}

function copyUriAndLabelToClipboard(buttonItem) {
    var label = buttonItem.parentElement.parentElement.childNodes[1].textContent;
    var uri = buttonItem.parentElement.parentElement.childNodes[1].href;
    if ($('#label-language').val() == 'project-language') {
        var language = languageCodes[projects[$('#project').val()].language];
    }
    else {
        var language = languageCodes[$('#label-language').val()];
    }
    navigator.clipboard.writeText(label + '$$2' + 'yso/' + language + '$$0'+ uri + '\n');
}

function getSuggestions() {
    $('#suggestions').show();
    $('#results-spinner').show();
    $.ajax({
        url: annif_base_url + "projects/" + $('#project').val() + "/suggest",
        method: 'POST',
        data: {
          text: $('#text').val(),
          limit: $('input[name="limit"]:checked').val(),
          threshold: 0.01
        },
        success: function(data) {
            $('#results-spinner').hide();

            if (data.results.length == 0) {
                $('#results').hide();
                $('#no-results').show();
            }

            if ($('#label-language').val() == 'project-language') {
                showResults(data);
            }
            else {
                var promises = []
                $.each(data.results, function(idx, value) {
                    promises.push(
                        getLabelPromise(value.uri, $('#label-language').val())
                    );
                });

                $.when.apply($, promises).done(function(result) {
                    $.each(promises, function(idx, promise) {
                        var newLabel = promise.responseJSON.prefLabel;
                        if (newLabel === undefined) {
                            var projectLanguage = projects[$('#project').val()].language;
                            newLabel = data.results[idx].label + ' (' + projectLanguage + ')';
                        }
                        data.results[idx].label = newLabel;
                    });
                    showResults(data);
                }).fail(function (jqXHR) {
                    alert('URI query on api.finto.fi failed:\n' + jqXHR.responseText);
                    $('#results').hide();
                    $('#no-results').show();
                }
                );
            }
        }
    });
}

function disableButton() {
    $('#get-suggestions').prop("disabled", true);
}

function enableButton() {
    $('#get-suggestions').prop("disabled", false);
}

$(document).ready(function() {
    let draggingLevelCounter = 0;
    $('.dropzone').on({
        dragenter: function(e) {
            e.stopPropagation();
            e.preventDefault();
            draggingLevelCounter++;
            $(".dropzone").addClass('dragging');
        },
        dragleave: function(e) {
            e.stopPropagation();
            e.preventDefault();
            draggingLevelCounter--;
            if (draggingLevelCounter == 0) {
                $(".dropzone").removeClass('dragging');
            }
        },
        dragover: function(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        drop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            draggingLevelCounter = 0;
            $(".dropzone").removeClass('dragging');
            readInput(e.originalEvent.dataTransfer);
        }
    });

    $('#no-results').hide();
    $('#results-spinner').hide();
    $('#upload-spinner').css('visibility', 'hidden');
    $('#supported-file-formats').append(supportedFormats.map(i => '.' + i).join(', '));
    $('#button-file-upload').attr('accept', supportedFormats.map(i => '.' + i));
    clearResults();
    if ($.trim($('#text').val()) != "") {
        enableButton();
        $('#text-background').css('visibility', 'hidden');
    } else {
        disableButton();
    }
    fetchProjects();
    makeLabelLanguageOptions();
    if ($.trim($('#input-url').val()) == "") {
        $('#button-select-url').prop("disabled", true);
    }
    $('#input-url').on('input', function() {
        $('#button-select-url').prop("disabled", false);
    });
    $('#form-url').on('submit', function(e) {
        e.preventDefault();
        selectUrl();
     });
    $('#get-suggestions').click(function() {
        clearResults();
        getSuggestions();
    });
    $('#button-clear').click(function() {
        $('#text').val('');
        $('.custom-file-label').html('Valitse tiedosto');
        $('#input-url').val('');
        $('#button-select-url').prop("disabled", true);
        $('#text').focus();
        $('#text-background').css('visibility', 'visible');
        clearResults();
        disableButton();
    });
    $('#text').on("input", function() {
        enableButton();
        $('#text-background').css('visibility', 'hidden');

    });
});
