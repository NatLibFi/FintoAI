
if (window.location.protocol.startsWith('http')) {
    // http or https - use API of current Annif instance
    var base_url = '/v1/'; 
} else {
    // local development case - use Finto AI dev API
    var base_url = 'https://ai.dev.finto.fi/v1/';
}
var projects = {};

function clearResults() {
    $('#results').empty();
    $('#suggestions').hide();
}

function fetchProjects() {
    $.ajax({
        url: base_url + "projects",
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

function readInput(input) {
    if (input.files && input.files[0]) {
        readFile(input.files[0])
    }
}

function readFile(file) {
    prepareUpload(file.name);
    const reader = new FileReader();
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'txt') {
        reader.onload = function() {
            finishUpload(file.name, reader.result);
        }
        reader.readAsText(file);
    } else {
        reader.onload = function() {
            const base64String = btoa(reader.result);
            $.ajax({
                url: 'http://localhost:8080/textract',
                method: 'POST',
                data: JSON.stringify({
                    'content': base64String,
                    'file_type': extension
                }),
                success: function(data) {
                    finishUpload(file.name, data.text);
                }
            });
        }
        reader.readAsBinaryString(file);
    }
}

function prepareUpload(fileName) {
    $('.custom-file-label').html(fileName);
    $('#text').val('');
    $('#suggestions').show();
    $('#results').empty();
    $('#upload-spinner').css('visibility', 'visible');
    $('#upload-icon').css('visibility', 'hidden');
    $('#results-spinner').show();
    $('#text').prop('placeholder', 'Ladataan...');
}

function finishUpload(fileName, text) {
    $('#uploaded-file').html(fileName);
    $('#upload-spinner').css('visibility', 'hidden');
    $('#upload-icon').css('visibility', 'visible');
    $('#text').val(text);
    $('#text').prop('placeholder', 'Kopioi tähän tekstiä ja paina "Anna aihe-ehdotukset"-nappia');
    getSuggestions();
    enableButton();
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
        url: base_url + "projects/" + $('#project').val() + "/suggest",
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
    $('#dropzone').on({
        dragenter: function(e) {
            e.stopPropagation();
            e.preventDefault();
            draggingLevelCounter++;
            $("#dropzone").addClass('dragging');
        },
        dragleave: function(e) {
            e.stopPropagation();
            e.preventDefault();
            draggingLevelCounter--;
            if (draggingLevelCounter == 0) {
                $("#dropzone").removeClass('dragging');
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
            $("#dropzone").removeClass('dragging');
            const files = e.originalEvent.dataTransfer.files;
            readFile(files[0]);
        }
    });

    $('#no-results').hide();
    $('#results-spinner').hide();
    $('#upload-spinner').css('visibility', 'hidden');
    clearResults();
    if ($.trim($('#text').val()) != "") {
        enableButton();
    } else {
        disableButton();
    }
    fetchProjects();
    makeLabelLanguageOptions();
    $('#get-suggestions').click(function() {
        clearResults();
        getSuggestions();
    });
    $('#button-clear').click(function() {
        $('#text').val('');
        $('.custom-file-label').html('Valitse tiedosto');
        $('#text').focus();
        clearResults();
        disableButton();
    });
    $('#text').on("input", function() {
        enableButton();
    });
});
