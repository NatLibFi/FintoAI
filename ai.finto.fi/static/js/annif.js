const { createApp } = Vue

if (window.location.protocol.startsWith('http')) {
  // http or https - use APIs of current Annif and textract instances
  var annif_base_url = '/v1/';
  var textract_base_url = 'https://ai.dev.finto.fi/textract/';  // TODO Switch me back
} else {
  // local development case - use Finto AI dev API and textract running on localhost via port 8001
  // var annif_base_url = 'https://ai.dev.finto.fi/v1/';
  var annif_base_url = 'http://localhost:5000/v1/';
  var textract_base_url = 'https://ai.dev.finto.fi/textract/'//'http://localhost:8001/textract/';
}

const headerApp = createApp({})

headerApp.component('switch-locale', {
  data() {
    return {
      locale_names: {
        fi: 'suomeksi',
        en: 'in English',
        sv: 'på svenska'
      }
    }
  },
  methods: {
    change_locale(event, locale) {
      event.preventDefault()

      // set language
      this.$i18n.locale = locale

      // update URL and history
      window.history.pushState({ url: '?locale=' + locale }, '', '?locale=' + locale)

      // change html lang attribute
      const html = document.querySelector('html')
      html.setAttribute('lang', this.$i18n.locale)
    }
  },
  mounted() {
    const locale = (new URL(document.location)).searchParams.get('locale')

    // check if url parameter is one of Finnish, English or Swedish
    if (['fi', 'en', 'sv'].indexOf(locale) !== -1) {
      // if yes, set language as such
      this.$i18n.locale = locale
    } else {
      // if not, set language to English and change url to match
      this.$i18n.locale = 'en'
      window.history.pushState({ url: '?locale=en' }, '', '?locale=en')
    }

    // change html lang attribute
    let html = document.querySelector('html')
    html.setAttribute('lang', this.$i18n.locale)
  },
  template: `
    <span v-for="locale in this.$i18n.availableLocales.filter(l => l !== this.$i18n.locale)">
      <a
        :href="'?locale=' + locale"
        @click="change_locale($event, locale)"
      >{{ locale_names[locale] }}</a>
    </span>
  `
})

const mainApp = createApp({
  data() {
    return {
      annif_version: '',
      projects: [],
      vocab_ids: [],
      selected_vocab_id: '',
      text: 'koira',  // TODO Switch me back
      limit: 10,
      text_language: 'fi',
      disable_language_detection: false,
      labels_language: 'detect-language',
      results: [],
      show_results: false,
      loading_results: false,
      detecting_language: false,
      selected_file: '',
      selected_url: '',
      placeholder_to_show: 'text_box_placeholder_text_input', // i18n translation key of the textbox placeholder
      loading_upload: false,
      show_alert_file_size: false,
      show_alert_file_format: false,
      show_alert_request_failed: false,
      show_alert_request_failed_url: false,
      show_alert_language_detect_failed: false,
      show_dragging_effect: false,
      supported_formats: ['txt', 'pdf', 'doc', 'docx', 'odt', 'rtf', 'pptx', 'epub', 'html']
    }
  },
  provide() {
    return {
      detectLanguage: this.detectLanguage
    };
  },
  watch: {
    text_language(newValue, oldValue) {
      if (newValue != null) {
        this.show_alert_language_detect_failed = false;
      }
    },
  },
  methods: {
    clear() {
      // clear previous text, suggestions, alerts etc
      this.text = ''
      this.show_results = false
      this.selected_file = ''
      this.selected_url = ''
      this.show_alert_file_size = false
      this.show_alert_file_format = false
      this.show_alert_request_failed = false
      this.show_alert_request_failed_url = false
      this.show_alert_language_detect_failed = false
    },
    detectLanguage() {
      if (!this.disable_language_detection) {
        this.detecting_language = true;
        this.text_language = 'none';
        fetch(annif_base_url + 'detect-language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: this.text,
            languages: ["fi", "sv", "en"]
          })
        })
        .then(response => response.json())
        .then(data => {
          this.text_language = data.results[0].language;
          // this.text_language_detection_score = this.results[0].language;  TODO Add to tooltip
          console.log("Detected language: " + this.text_language);
          this.detecting_language = false;
          if (this.text_language == null) {
            this.show_alert_language_detect_failed = true;
          };
        })
        .catch(error => {
          console.error('Error:', error);
          this.detecting_language = false;
        });
      }
    },
    suggest() {
      this.loading_results = true;
      this.show_results = false;

      let labelsLang = this.labels_language === 'detect-language' ? '' : this.labels_language;

      const projectId = this.selected_vocab_id + "-" + this.text_language;

      // get suggestions for given text
      console.log("Project to call: " + this.projectId)
      console.log(this.selected_vocab_id)
      console.log(this.text_language)
      console.log(this.projectId)
      fetch(annif_base_url + 'projects/' + projectId + '/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'text=' + this.text + '&limit=' + this.limit + '&language=' + labelsLang
      })
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.results = data.results
        this.loading_results = false
        this.show_results = true
      })
    },

    drag_over(e) {
      e.stopPropagation()
      e.preventDefault()
      this.show_dragging_effect = true
    },
    drag_leave(e) {
      e.stopPropagation()
      e.preventDefault()
      this.show_dragging_effect = false
    },
    read_drop_input(e) {
      e.stopPropagation()
      e.preventDefault()

      this.show_dragging_effect = false

      // get file or url from input data
      const input = e.dataTransfer
      const files = input.files
      const url = input.getData('URL') || input.getData('text/x-moz-url') // works with chrome and firefox but not edge

      // read contents of file or url
      if (files && files[0]) {
        this.$refs.tab_file_input.click() // there is probably a better way to switch the tab
        this.read_file(files[0])
      } else if (url) {
        this.$refs.tab_url_input.click()
        this.read_url(url)
      }
    },
    apply_start_reading_effects() {
      this.clear();
      this.loading_upload = true;
      if (!this.disable_language_detection) {
        this.detecting_language = true;
        this.text_language = 'none';
      }
    },
    read_file(file) {
      this.apply_start_reading_effects()
      this.selected_file = file.name

      const extension = this.get_extension(file.name)
      this.check_format_support(extension)
      this.check_file_size(file.size)

      if (extension === 'txt') {
        // read text files locally
        file.text().then(file_text => {
          this.loading_upload = false
          this.text = file_text
          this.detectLanguage();
        })
      } else {
        let file_form_data = new FormData()
        file_form_data.append('file', file)

        // read contents of file using textract
        fetch(textract_base_url + 'file', {
          method: 'POST',
          body: file_form_data
        })
          .then(data => {
            return data.json()
          })
          .then(data => {
            this.loading_upload = false
            this.text = data.text
            this.detectLanguage();
          })
          .catch(error => {
            this.loading_upload = false
            this.detecting_language = false
            this.show_alert_request_failed = true
          })
      }
    },
    read_url(url) {
      this.apply_start_reading_effects();

      const url_obj = new URL(url)
      const plain_url = url_obj.origin + url_obj.pathname
      this.selected_url = plain_url

      const extension = this.get_extension(url_obj.pathname)
      this.check_format_support(extension)

      // read contents of URL using textract
      fetch(textract_base_url + 'url', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'url': plain_url })
      })
        .then(data => {
          return data.json()
        })
        .then(data => {
          this.loading_upload = false
          this.detecting_language = false
          this.text = data.text
          this.detectLanguage();
        })
        .catch(error => {
          this.loading_upload = false
          this.detecting_language = false
          this.show_alert_request_failed_url = true
        })
    },
    get_extension(path) {
      const parts = path.split('.')
      if (parts.length >= 2) {
        return parts[parts.length - 1].toLowerCase()
      } else {
        return
      }
    },
    check_format_support(extension) {
      // Allow undefined because url to a typical html page lacks .html suffix
      if (!this.supported_formats.includes(extension) && extension !== undefined) {
        this.show_alert_file_format = true
        this.loading_upload = false
        throw new Error('Unsupported format')
      }
    },
    check_file_size(size) {
      if (size > 50000000) {
        this.show_alert_file_size = true
        this.loading_upload = false
        throw new Error('File size exceeds maximum')
      }
    },
  },
  mounted() {
    // get available projects
    fetch(annif_base_url + 'projects')
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.projects = data.projects
        // Assume vocabulary id is a prefix of project id
        this.vocab_ids = [...new Set(this.projects.map(item => item.project_id.split("-")[0]))];
        this.selected_vocab_id = this.vocab_ids[0]
      })

    // get annif version number
    fetch(annif_base_url)
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.annif_version = data.version
      })
  }
})

mainApp.component('file-input', {
  props: ['selected_file', 'supported_formats'],
  emits: ['select-file'],
  template: `
    <div role="tabpanel" class="tab-pane" id="tab-file-input">
      <div class="input-group flex-fill">
        <label class="input-group-text" id="button-select-file" for="input-file" role="button">
          {{ $t('file_input_browse') }}
        </label>
        <label for="input-file" class="form-control" id="input-file-label" role="button">
          {{ this.selected_file ? this.selected_file : $t('file_input_select') }}
        </label>
        <input type="file" class="d-none" id="input-file" aria-labelledby="input-file-label"
          @change="$emit('select-file', $event.target.files[0])"
        >
      </div>
      <div class="tabs-input-footer">
        <span>{{ $t('supported_file_formats') }}</span>
        <span class="supported-file-formats">{{ this.supported_formats.map(i => '.' + i).join(', ') }}</span>
      </div>
    </div>
  `
})

mainApp.component('url-input', {
  props: ['selected_url', 'supported_formats'],
  emits: ['select-url'],
  methods: {
    select_url(e) {
      e.preventDefault()
      this.$emit('select-url', e.target[0].value)
    }
  },
  template: `
    <div role="tabpanel" class="tab-pane" id="tab-url-input">
      <form class="input-group flex-fill" id="form-url" @submit="select_url($event)">
        <label class="visually-hidden" for="input-url">{{ $t('url_input_placeholder') }}</label>
        <input type="url" class="form-control" id="input-url" autocomplete="off" required
          :placeholder="$t('url_input_placeholder')"
          :value="selected_url"
        >
        <input type="submit" id="button-select-url" class="btn btn-primary"
          :value="$t('url_input_submit')"
        >
      </form>
      <div class="tabs-input-footer">
      <span>{{ $t('supported_file_formats') }}</span>
        <span class="supported-file-formats">{{ this.supported_formats.map(i => '.' + i).join(', ') }}</span>
      </div>
    </div>
  `
})

mainApp.component('text-input', {
  props: ['modelValue', 'show_dragging_effect', 'placeholder_to_show'], // modelValue: text
  emits: ['update:modelValue', 'clear'],
  inject: ['detectLanguage'],
  data() {
    return {
      timeout: null,
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('update:modelValue', value);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.detectLanguage(), 1000);  // Delay for language detection after input typing
    },
  },
  template: `
    <label class="visually-hidden" for="text">{{ $t(placeholder_to_show) }}></label>
    <textarea class="form-control dropzone dropzone-border" id="text" rows="20"
      :placeholder="$t(placeholder_to_show)"
      :value="modelValue"
      @input="updateValue($event.target.value)"
      :class="{ 'dragging': show_dragging_effect }"
    ></textarea>
    <button id="button-clear" type="button" class="btn btn-danger"
      @click="this.$emit('clear')"
    >&#x2715;</button>
  `
})

mainApp.component('vocab-select', {
  props: ['modelValue', 'vocab_ids'],
  emits: ['update:modelValue'],
  components: {  // Use sub-component to make UI language switching change the vocabulary display name
    'vocabulary-display-name': {
      props: ['selected_vocab_id'],
      data() {
        return {
          vocabularyUrlsMap: {
            'yso': 'https://finto.fi/yso/',
            'ykl': 'https://finto.fi/ykl/',
            'kauno': 'https://finto.fi/kauno/',
            'thema': 'https://ns.editeur.org/thema/',
          },
        };
      },
      computed: {
        vocabularyName() {
          const vocabularyNamesMap = {
            'yso': this.$t('vocabulary_name_yso'),
            'ykl': this.$t('vocabulary_name_ykl'),
            'kauno': this.$t('vocabulary_name_kauno'),
            'thema': this.$t('vocabulary_name_thema'),
          }
          return vocabularyNamesMap[this.selected_vocab_id] || '';
        },
        vocabularyUrl() {
          return this.vocabularyUrlsMap[this.selected_vocab_id] || '';
          },
        },
      template: `
        <span id="vocabulary-display-name">
        <a :href="vocabularyUrl" target="_blank">{{ vocabularyName }}
          <img src="static/img/arrow-up-right-from-square-solid-dark.svg" alt="" aria-hidden="true"></a></span>
      `,
    },
  },
  template: `
    <div>
      <label class="suggest-form-label form-label" for="project">{{ $t('project_select_label') }}</label>
        <div class="select-wrapper">
          <select class="form-control" id="project"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            >
            <option v-for="vid in vocab_ids" :value="vid">{{ $t("project_name_"+vid) }} </option>
          </select>
        </div>
      <vocabulary-display-name :selected_vocab_id="modelValue"/>
    </div>
    `,
    // {{ extractVersionSpecifierInParentheses(vid) }}
});
  //   displayProjectName(project) {
  //     return project.project_id + ' ' + this.extractVersionSpecifierInParentheses(project.name);
  //   },
  //   extractVersionSpecifierInParentheses(name) {
  //     const match = name.match(/\(([^)]+)\)$/);
  //     return match ? match[0] : '';
  //   },
  // },

mainApp.component('limit-input', {
  props: ['modelValue'], // modelValue: limit
  emits: ['update:modelValue'],
  template: `
    <fieldset id="limit-buttons" class="btn-group select-buttons">
      <legend class="suggest-form-label">{{ $t('limit_input_label') }}</legend>
      <input type="radio" class="btn-check" name="limit" id="l1" checked
        :value="modelValue"
        @change="$emit('update:modelValue', 10)"
      >
      <label class="btn btn-secondary" for="l1">10</label>
      <input type="radio" class="btn-check" name="limit" id="l2"
        :value="modelValue"
        @change="$emit('update:modelValue', 15)"
      >
      <label class="btn btn-secondary" for="l2">15</label>
      <input type="radio" class="btn-check" name="limit" id="l3"
        :value="modelValue"
        @change="$emit('update:modelValue', 20)"
      >
      <label class="btn btn-secondary" for="l3">20</label>
    </fieldset>
  `
})

mainApp.component('text-language-select', {
  props: ['modelValue', 'selected_vocab_id', 'detecting_language'], // modelValue: text_language
  emits: ['update:modelValue'],
  computed: {
    disabledLanguages() {
      // Map of languages and their enabling criteria based on vocabularyId
      return {
        sv: this.selected_vocab_id == 'kauno',
        en: this.selected_vocab_id == 'kauno',
      };
    }
  },
  methods: {
    isLanguageDisabled(language) {
      return this.disabledLanguages[language] || false; // Default to false if not specified in map
    },
  },
  template: `
    <label class="suggest-form-label form-label" for="text-language">{{ $t('language_select_text') }}</label>
    <div>
      <fieldset id="language-buttons" class="btn-group select-buttons">
        <input type="radio" class="btn-check" name="language" id="fi" :checked="modelValue === 'fi'"
          @change="$emit('update:modelValue', 'fi')">
        <label class="btn btn-secondary" for="fi">{{ $t('language_select_fi') }}</label>

        <input type="radio" class="btn-check" name="language" id="sv" :checked="modelValue === 'sv'"
          @change="$emit('update:modelValue', 'sv')">
        <label class="btn btn-secondary" for="sv">{{ $t('language_select_sv') }}</label>

        <input type="radio" class="btn-check" name="language" id="en" :checked="modelValue === 'en'"
        @change="$emit('update:modelValue', 'en')">
        <label class="btn btn-secondary" for="en">{{ $t('language_select_en') }}</label>

        <input type="radio" class="btn-check" name="language" id="none" :checked="modelValue === 'none'"
        style="display: none;">
      </fieldset>
      <div id="language-detection-spinner" class="spinner-border" role="status" v-cloak
        v-if="detecting_language">
      </div>
    `
});

mainApp.component('labels-language-select', {
  props: ['modelValue', 'selected_vocab_id'], // modelValue: selected language
  emits: ['update:modelValue'],
  computed: {
    disabledLanguages() {
      // Map of languages and their enabling criteria based on vocabularyId
      return {
        se: this.selected_vocab_id !== 'yso', // 'se' enabled only if vocabularyId is 'yso'
      };
    }
  },
  methods: {
    isOptionDisabled(language) {
      return this.disabledLanguages[language] || false; // Default to false if not specified in map
    }
  },
  template: `
    <label class="suggest-form-label form-label" for="label-language">{{ $t('language_select_label') }}</label>
    <div class="select-wrapper">
      <select class="form-control" id="labels-language" :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)">
        <option value="detect-language">{{ $t('language_select_same_as_text') }}</option>
        <option value="fi">{{ $t('language_select_fi') }}</option>
        <option value="sv">{{ $t('language_select_sv') }}</option>
        <option value="en">{{ $t('language_select_en') }}</option>
        <option :disabled="isOptionDisabled('se')" value="se">{{ $t('language_select_sm') }}</option>
      </select>
    </div>
  `
});

mainApp.component('result-list', {
  props: ['results', 'language', 'selected_project', 'projects'],
  methods: {
    copy_class_to_clipboard(term) {
      navigator.clipboard.writeText(term.notation)
    },
    copy_label_to_clipboard(term) {
      navigator.clipboard.writeText(term.label)
    },
    copy_uri_to_clipboard(term) {
      navigator.clipboard.writeText(term.uri)
    },
    copy_uri_and_label_to_clipboard(term) {
      const languageCodes = {
        fi: 'fin',
        sv: 'swe',
        en: 'eng'
      }
      const vocab = this.selected_project.split('-')[0];  // Get vocabulary id for Melinda format from project id
      if (vocab === 'ykl') {
        var alephString = term.notation + '$$2' + vocab + '\n';
      } else {
        const term_language =
          this.language === 'project-language'
            ? languageCodes[this.projects.find(p => p.project_id === this.selected_project).language]
            : languageCodes[this.language]
        var alephString = term.label + '$$2' + vocab + '/' + term_language + '$$0' + term.uri + '\n';
      }
      navigator.clipboard.writeText(alephString);
    }
  },
  template: `
    <ul class="list-group" id="results"
      v-if="results.length !== 0"
    >
      <li class="list-group-item"
        v-for="r in results"
      >
        <div id="meter-wrapper">
          <meter max="1"
            :value="r.score"
            :title="r.score.toString().slice(0,6)"
          ></meter>
        </div>
        <div class="btn-group copy-buttons" role="group">
          <button type="button" class="btn btn-secondary copy-button" id="copy-button-class"
            v-if="r.notation"
            :title="$t('copy_class_title')"
            @click="copy_class_to_clipboard(r)"
          >{{ $t('class_button') }}</button>
          <button type="button" class="btn btn-secondary copy-button" id="copy-button-label"
            :title="$t('copy_term_title')"
            @click="copy_label_to_clipboard(r)"
          >{{ $t('term_button') }}</button>
          <button type="button" class="btn btn-secondary copy-button" id="copy-button-uri"
            :title="$t('copy_uri_title')"
            @click="copy_uri_to_clipboard(r)"
          >URI</button>
          <button type="button" class="btn btn-secondary copy-button" id="copy-button-label-and-uri"
            :title="$t('copy_label_and_uri_title')"
            @click="copy_uri_and_label_to_clipboard(r)"
          ></button>
        </div>
        <p class="uri-link"><a target="_blank" :href="r.uri">{{ r.notation }} {{ r.label }}</a></p>
      </li>
    </ul>
    <ul class="list-group" id="no-results"
      v-if="results.length === 0"
    >
      <li class="list-group-item">{{ $t('no_results') }}</li>
    </ul>
  `
})

// empty footer app for i18n
const footerApp = createApp({})

headerApp.use(i18n)
mainApp.use(i18n)
footerApp.use(i18n)

headerApp.mount('#header')
mainApp.mount('#main')
footerApp.mount('#footer')
