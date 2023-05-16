const { createApp } = Vue

const annif_base_url = 'https://ai.finto.fi/v1/'

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
      loading_results: false
    }
  },
  methods: {
    hide_results() {
      this.show_results = false
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
    }
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

mainApp.component('text-input', {
  props: ['modelValue'], // text
  emits: ['update:modelValue', 'hide-results'],
  methods: {
    clear_text() {
      this.$emit('update:modelValue', '')
      this.$emit('hide-results', null)
    }
  },
  template: `
    <textarea
      class="form-control dropzone dropzone-border" id="text" rows="20"
      placeholder='Kopioi tähän tekstiä ja paina "Anna aihe-ehdotukset"-nappia'
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <button id="button-clear" type="button" class="btn btn-danger"
      @click="clear_text">&#x1F7A8;</button>
  `
})

mainApp.component('project-select', {
  props: ['modelValue', 'projects'], //selected project
  emits: ['update:modelValue'],
  template:`
    <label for="project">Sanasto ja tekstin kieli</label>
    <div class="select-wrapper">
      <select
        class="form-control" id="project"
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
    <ul class="list-group" id="results" v-if="results.length!==0">
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
    <ul class="list-group" id="no-results" v-if="results.length===0">
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