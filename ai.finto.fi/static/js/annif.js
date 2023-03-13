const annif_base_url = 'https://ai.finto.fi/v1/'
const textract_base_url = 'https://ai.dev.finto.fi/textract/' 

document.addEventListener('alpine:init', () => {

  Alpine.data('content', () => ({
    text: '',
    show_results: false
  }))

  Alpine.data('textbox', () => ({
    supported_formats: ['txt', 'pdf', 'doc', 'docx', 'odt', 'rtf', 'pptx', 'epub', 'html'],
    selected_file: 'Valitse tiedosto',
    selected_url: '',
    loading_upload: false,
    show_alert_file_size: false,
    show_alert_file_format: false,
    show_alert_request_failed: false,
    show_dragging_effect: false,

    clear() {
      this.text = ''
      this.show_results = false
      this.selected_file = 'Valitse tiedosto'
      this.selected_url = ''
      this.show_alert_file_size = false
      this.show_alert_file_format = false
      this.show_alert_request_failed = false
    },
    supported_formats_text() {
      return this.supported_formats.map(i => '.' + i).join(', ')
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
    select_file(e) {
      this.read_file(e.target.files[0])
    },
    select_url(e) {
      e.preventDefault()
      this.read_url(e.target[0].value)
    },
    read_drop_input(e) {
      e.stopPropagation()
      e.preventDefault()

      this.show_dragging_effect = false

      const input = e.dataTransfer
      const files = input.files
      const url = input.getData('URL') || input.getData('text/x-moz-url') // works with chrome and firefox

      if (files && files[0]) {
        this.$refs.tab_file_input.dispatchEvent(new Event('click')) // not sure how else to switch the tab
        this.read_file(files[0])
      } else if (url) {
        this.$refs.tab_url_input.dispatchEvent(new Event('click'))
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
  }))

  Alpine.data('suggestions', () => ({
    projects: [],
    selected_project: '',
    limit: 10,
    language: 'project-language',
    loading_results: false,
    results: [],

    suggest() {
      this.loading_results = true
      this.show_results = false

      let lang = this.language === 'project-language' ? '' : this.language

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
        this.loading_results = false
        this.show_results = true
        this.results = data.results
      })
    },
    copy_label_to_clipboard(term) {
      navigator.clipboard.writeText(term.label)
    },
    copy_uri_to_clipboard(term) {
      navigator.clipboard.writeText(term.uri)
    },
    copy_uri_and_label_to_clipboard(term) {
      let languageCodes = {
        'fi': 'fin',
        'sv': 'swe',
        'en': 'eng'
      }
      let term_language = 
        this.language === 'project-language' 
        ? languageCodes[this.projects.find(p => p.project_id === this.selected_project).language] 
        : languageCodes[this.language]

      navigator.clipboard.writeText(term.label + '$$2' + 'yso/' + term_language + '$$0'+ term.uri + '\n')
    },

    init() {
      fetch(annif_base_url + 'projects')
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.projects = data.projects
        this.selected_project = this.projects[0].project_id
      })
    }
  }))

  Alpine.data('footer', () => ({
    annif_version: '',
    
    init() {
      fetch(annif_base_url)
      .then(data => {
        return data.json()
      })
      .then(data => {
        this.annif_version = data.version
      })
    }
  }))
})