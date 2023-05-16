const { createApp } = Vue

const annif_base_url = 'https://ai.finto.fi/v1/'
const textract_base_url = 'https://ai.dev.finto.fi/textract/'

const mainApp = createApp({
  data() {
    return {
      projects: [],
      selected_project: '',
      text: '',
      limit: 10,
      language: 'project-language',
      results: [],
      show_results: false,
      loading_results: false,
      selected_file: 'Valitse tiedosto',
      selected_url: '',
      loading_upload: false,
      show_alert_file_size: false,
      show_alert_file_format: false,
      show_alert_request_failed: false,
      show_dragging_effect: false,
      supported_formats: ['txt', 'pdf', 'doc', 'docx', 'odt', 'rtf', 'pptx', 'epub', 'html']
    }
  },
  methods: {
    clear() {
      this.text = ''
      this.show_results = false
      this.selected_file = 'Valitse tiedosto'
      this.selected_url = ''
      this.show_alert_file_size = false
      this.show_alert_file_format = false
      this.show_alert_request_failed = false
    },
    suggest() {
      this.loading_results = true
      this.show_results = false

      var lang = this.language === 'project-language' ? '' : this.language

      fetch(annif_base_url + 'projects/' + this.selected_project + '/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'text=' + this.text + '&limit=' + this.limit + '&language=' + lang
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

      const input = e.dataTransfer
      const files = input.files
      const url = input.getData('URL') || input.getData('text/x-moz-url') // works with chrome and firefox

      if (files && files[0]) {
        this.$refs.tab_file_input.click() // not sure how else to switch the tab
        this.read_file(files[0])
      } else if (url) {
        this.$refs.tab_url_input.click()
        this.read_url(url)
      }
    },
    read_file(file) {
      this.clear()
      this.loading_upload = true
      this.selected_file = file.name
      
      const extension = this.get_extension(file.name)
      this.check_format_support(extension)
      this.check_file_size(file.size)

      if (extension === 'txt') {
        file.text().then(file_text => {
          this.loading_upload = false
          this.text = file_text
        })
      } else {
        let file_form_data = new FormData()
        file_form_data.append('file', file)

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
        })
        .catch(error => {
          console.log('aa')
          this.loading_upload = false
          this.show_alert_request_failed = true
        })
      }
    },
    read_url(url) {
      const url_obj = new URL(url)
      const plain_url = url_obj.origin + url_obj.pathname

      this.clear()
      this.loading_upload = true
      this.selected_url = plain_url

      const extension = this.get_extension(url_obj.pathname)
      this.check_format_support(extension)

      fetch(textract_base_url + 'url', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'url': plain_url})
      })
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.loading_upload = false
        this.text = data.text
      })
      .catch(error => {
        this.loading_upload = false
        this.show_alert_request_failed = true
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
    fetch(annif_base_url + 'projects')
    .then(data => {
      return data.json()
    })
    .then(data => {
      this.projects = data.projects
      this.selected_project = this.projects[0].project_id
    })
  }
})

mainApp.component('file-input', {
  props: ['selected_file', 'supported_formats'],
  emits: ['select-file'],
  template: `
    <div role="tabpanel" class="tab-pane" id="tab-file-input">
      <div class="input-group flex-fill">
        <label class="input-group-text" id="button-select-file" for="input-file" role="button">Selaa</label>
        <label for="input-file" class="form-control" id="input-file-label" role="button">{{ this.selected_file }}</label>
        <input type="file" class="d-none" id="input-file"
          @change="$emit('select-file', $event.target.files[0])"
        >
      </div>
      <div class="tabs-input-footer">
        <span>Tuetut tiedostomuodot: </span><span class="supported-file-formats">{{ this.supported_formats.map(i => '.' + i).join(', ') }}</span>
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
        <input type="url" class="form-control" id="input-url" placeholder="Syötä URL" autocomplete="off" required
          :value="selected_url"
        >
        <input type="submit" id="button-select-url" value="Hae teksti" class="btn btn-primary">
      </form>
      <div class="tabs-input-footer">
        <span>Tuetut tiedostomuodot: </span><span class="supported-file-formats">{{ this.supported_formats.map(i => '.' + i).join(', ') }}</span>
      </div>
    </div>
  `
})

mainApp.component('text-input', {
  props: ['modelValue', 'show_dragging_effect'], // text
  emits: ['update:modelValue', 'clear'],
  methods: {
    clear() {
      this.$emit('clear', null)
    }
  },
  template: `
    <textarea class="form-control dropzone dropzone-border" id="text" rows="20"
      placeholder='Kopioi tähän tekstiä ja paina "Anna aihe-ehdotukset"-nappia'
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="{ 'dragging': show_dragging_effect }"
    ></textarea>
    <button id="button-clear" type="button" class="btn btn-danger"
      @click="clear">&#x1F7A8;</button>
  `
})

mainApp.component('project-select', {
  props: ['modelValue', 'projects'], //selected project
  emits: ['update:modelValue'],
  template:`
    <label for="project">Sanasto ja tekstin kieli</label>
    <div class="select-wrapper">
      <select class="form-control" id="project"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option
          v-for="p in projects"
          :value="p.project_id"
        >{{ p.name }}</option>
      </select>
    </div>
  `
})

mainApp.component('limit-input', {
  props: ['modelValue'], // limit
  emits: ['update:modelValue'],
  template: `
    <label for="limit-buttons">Ehdotusten enimmäismäärä</label><br>
    <div id="limit-buttons" role="group" class="btn-group">
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
    </div>
  `
})

mainApp.component('language-select', {
  props: ['modelValue'], // selected language
  emits: ['update:modelValue'],
  template:`
    <label for="label-language">Aihe-ehdotusten kieli</label>
    <div class="select-wrapper">
      <select class="form-control" id="label-language"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="project-language">Sama kuin tekstin kieli</option>
        <option value="fi">suomi</option>
        <option value="sv">ruotsi</option>
        <option value="en">englanti</option>
      </select>
    </div>
  `
})

mainApp.component('result-list', {
  props: ['results', 'language', 'selected_project', 'projects'],
  methods: {
    copy_label_to_clipboard(term) {
      navigator.clipboard.writeText(term.label)
    },
    copy_uri_to_clipboard(term) {
      navigator.clipboard.writeText(term.uri)
    },
    copy_uri_and_label_to_clipboard(term) {
      var languageCodes = {
        'fi': 'fin',
        'sv': 'swe',
        'en': 'eng'
      }
      var term_language = 
        this.language === 'project-language' 
        ? languageCodes[this.projects.find(p => p.project_id === this.selected_project).language] 
        : languageCodes[this.language]
      navigator.clipboard.writeText(term.label + '$$2' + 'yso/' + term_language + '$$0'+ term.uri + '\n')
    }
  },
  template: `
    <ul class="list-group" id="results" v-if="results.length !== 0">
      <li
        class="list-group-item"
        v-for="r in results"
      >
        <div id="meter-wrapper">
          <meter
            max="1" title="0.7115"
            v-bind:value="r.score"
            v-bind:title="r.score.toString().slice(0,6)"  
          ></meter>
        </div>
        <div class="btn-group copy-buttons" role="group">
          <button
            type="button" class="btn btn-secondary copy-button" id="copy-button-label" title="Kopioi termi leikepöydälle"
            @click="copy_label_to_clipboard(r)"
          >TERMI</button>
          <button
            type="button" class="btn btn-secondary copy-button" id="copy-button-uri" title="Kopioi URI leikepöydälle"
            @click="copy_uri_to_clipboard(r)"
          >URI</button>
          <button
            type="button" class="btn btn-secondary copy-button" id="copy-button-label-and-uri"
            title="Kopioi termi, URI ja kielikoodi leikepöydälle Melindaa/Alephia varten"
            @click="copy_uri_and_label_to_clipboard(r)"  
          ></button>
        </div>
        <p class="uri-link"><a target="_blank" v-bind:href="r.uri">{{ r.label }}</a></p>
      </li>
    </ul>
    <ul class="list-group" id="no-results" v-if="results.length === 0">
      <li class="list-group-item">Ei tuloksia</li>
    </ul>
  `
})

mainApp.mount('#main')


const footerApp = createApp({
  data() {
    return {
      annif_version: ''
    }
  },
  mounted() {
    fetch(annif_base_url)
    .then(data => {
      return data.json()
    })
    .then(data => {
      this.annif_version = data.version
    })
  }
})

footerApp.mount('#footer-main')