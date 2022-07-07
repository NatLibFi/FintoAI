
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
                        onclick="copyLabelToClipboard(this);"></button> \
                    <button type="button" class="btn btn-secondary copy-button" id="copy-button-uri" data-i18n="[title]copy-button-uri" \
                        onclick="copyUriToClipboard(this);"></button> \
                    <button type="button" class="btn btn-secondary copy-button" id="copy-button-label-and-uri" data-i18n="[title]copy-button-label-and-uri" \
                        onclick="copyUriAndLabelToClipboard(this);"></button> \
                </div></li>')
            )
        );
        $('#results').i18n();
        $('#results').show();
    });
}

function selectFile(input) {
    readFile(input.files[0]);
}

function selectUrl() {
    readUrl($('#input-url').val());
}

function readDropInput(input) {
    const files = input.files;
    const url = input.getData('URL');
    if (files && files[0]) {
        $('#tabs-input a[href="#tab-file-input"]').tab('show');
        readFile(files[0]);
    } else if (url) {
        $('#tabs-input a[href="#tab-url-input"]').tab('show');
        readUrl(url);
    }
}

const supportedFormats = ['txt', 'pdf', 'doc', 'docx', 'odt', 'rtf', 'pptx',
    'epub', 'html'];

function checkFormatSupport(extension) {
    // Allow undefined because url to a typical html page lacks .html suffix
    if (!supportedFormats.includes(extension) && extension !== undefined) {
        $("#alert-not-supported-format").removeClass('d-none');
        throw "Unsupported format " + extension;
    }
}

function checkFileSize(size) {
    if (size > 50000000) {
        $("#alert-too-big-file").removeClass('d-none');
        throw "File size exceeds maximum";
    }
}

function getExtension(path) {
    const parts = path.split('.');
    if (parts.length >= 2) {
        return parts[parts.length - 1].toLowerCase();
    } else {
        return;
    }
}

function readFile(file) {
    const extension = getExtension(file.name);
    clearInputs();
    checkFileSize(file.size);
    checkFormatSupport(extension);
    prepareExtraction();
    $('.custom-file-label').html(file.name);
    if (extension === 'txt') {
        const reader = new FileReader();
        reader.onload = function() {
            finishExtraction(reader.result);
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
                finishExtraction(data.text);
            },
            error: function(jqXHR) {
                handleFailedExtraction(jqXHR);
            }
        });
    }
}

function readUrl(url) {
    const urlObj = new URL(url);
    const extension = getExtension(urlObj.pathname);
    clearInputs();
    checkFormatSupport(extension);
    prepareExtraction();
    $('#input-url').val(url);
    $('#button-select-url').prop('disabled', false);
    const plainUrl = urlObj.origin + urlObj.pathname;  // Remove possible parameters
    $.ajax({
        url: textract_url + '-url',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({"file_url": plainUrl}),
        success: function(data) {
            finishExtraction(data.text);
        },
        error: function(jqXHR) {
            handleFailedExtraction(jqXHR);
        }
    });
}

function clearInputs() {
    $(".alert").addClass('d-none');
    $('#text').val('');
    $('.custom-file-label').html($.i18n('form-file-input'));
    $('#input-url').val('');
    $('#button-select-url').prop('disabled', true);
}

function prepareExtraction() {
    $('#suggestions').hide();
    $('#results').empty();
    disableSuggestButton();
    $('#upload-spinner').show();
    $('#text').prop({placeholder: $.i18n('loading')})
    $('#text-box-background').hide();
}

function finishExtraction(text) {
    $('#upload-spinner').hide();
    $('#text').val(text);
    let activeTab = $("#tabs-input .nav-item .active")[0].getAttribute('href');
    switchTextboxPlaceholder(activeTab)
    enableSuggestButton();
    $('#get-suggestions').focus();
}

function handleFailedExtraction(jqXHR) {
    var textractStatus = jqXHR.status + ' ' + jqXHR.responseText;
    $("#textract-status").remove();
    $("#alert-textract-request-failed").removeClass('d-none').append(
        '<span id="textract-status">' + textractStatus + '</span>');
    finishExtraction();
    $('#text-box-background').show();
}

function switchTextboxPlaceholder(activeTab) {
    if (activeTab === '#tab-file-input') {
        $('#text').prop({placeholder: $.i18n('text-box-placeholder-file-input')});
    } else if (activeTab === '#tab-url-input') {
        $('#text').prop({placeholder: $.i18n('text-box-placeholder-url-input')});
    } else {
        $('#text').prop({placeholder: $.i18n('text-box-placeholder-text-input')});
    }
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

function disableSuggestButton() {
    $('#get-suggestions').prop("disabled", true);
}

function enableSuggestButton() {
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
            readDropInput(e.originalEvent.dataTransfer);
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        let activeTab = $(e.target).attr("href")
        switchTextboxPlaceholder(activeTab);
    });

    $('#no-results').hide();
    $('#results-spinner').hide();
    $('#upload-spinner').hide();
    $('.supported-file-formats').append(supportedFormats.map(i => '.' + i).join(', '));
    $('#form-file-input').attr('accept', supportedFormats.map(i => '.' + i));
    clearResults();
    if ($.trim($('#text').val()) != "") {
        enableSuggestButton();
        $('#text-box-background').hide();
    } else {
        disableSuggestButton();
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
        clearInputs();
        $('#text').focus();
        $('#text-box-background').show();
        clearResults();
        disableSuggestButton();
    });
    $('#text').on("input", function() {
        enableSuggestButton();
        $('#text-box-background').hide();
    });
});
