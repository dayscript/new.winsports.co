Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.match-menu',
  data: {
    competition: '',
    selected_option: 'directo',
    season: '',
    prev: null,
    cron: null,
    match: '',
    node: null
  },
  beforeMount () {
    const id = this.$el.id
    this.node = drupalSettings.pdb.contexts['entity:node'];
    if (this.node['field_opta_id'][0]['value']) {
      this.competition = this.node['field_opta_id'][0]['value']
    }
    if (this.node['field_opta_season'][0]['value']) {
      this.season = this.node['field_opta_season'][0]['value']
    }
    if (this.node['field_opta_match_id'][0]['value']) {
      this.match = this.node['field_opta_match_id'][0]['value']
    }

  },
  mounted () {
    if (this.match) {
      this.loadArticles(this.match)
    }
  },
  methods: {
    selectOption (option_key) {
      this.selected_option = option_key
      // this.loadTable()
    },
    loadArticles (match_id) {
      axios.get('/api/match/articles/' + match_id).then(
          ({data}) => {
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].field_tipo_de_articulo === 'Previa') {
                  this.prev = data[i].nid
                }
                else if (data[i].field_tipo_de_articulo === 'Crónica') {
                  this.cron = data[i].nid
                }
              }
            }
          }
      ).catch()
    }
  }

});