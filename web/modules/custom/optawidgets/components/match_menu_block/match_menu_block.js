Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.match-menu',
  data: {
    selected_option: 'directo',
    opta_competition: '',
    opta_season: '',
    opta_match_id: null,
    drupal_match_id: null,
    prev: null,
    cron: null,
    node: null
  },
  beforeMount () {
    const id = this.$el.id
    this.node = drupalSettings.pdb.contexts['entity:node'];
  },
  mounted () {
    if (this.node['type'][0]['target_id'] === 'article') {
      if (this.node['field_partido'].length) {
        this.drupal_match_id = this.node['field_partido'][0]['target_id']
      }
      if (this.node['field_tipo_de_articulo'][0]['target_id'] === '2876') {
        this.selected_option = 'cronica'
        this.cron = this.node['nid'][0]['value']
      }
      else if (this.node['field_tipo_de_articulo'][0]['target_id'] === '2882') {
        this.selected_option = 'previa'
        this.prev = this.node['nid'][0]['value']
      }
    }
    else {
      if (this.node['field_opta_id'][0]['value']) {
        this.opta_competition = this.node['field_opta_id'][0]['value']
      }
      if (this.node['field_opta_season'][0]['value']) {
        this.opta_season = this.node['field_opta_season'][0]['value']
      }
      if (this.node['field_opta_match_id'][0]['value']) {
        this.opta_match_id = this.node['field_opta_match_id'][0]['value']
      }
    }
    if (this.opta_match_id || this.drupal_match_id) {
      this.loadArticles()
    }
    Opta.start()
  },
  methods: {
    selectOption (option_key) {
      if (option_key === 'previa') {
        document.location.href = '/node/' + this.prev
      }
      if (option_key === 'cronica') {
        document.location.href = '/node/' + this.cron
      }
      if (option_key === 'estadisticas') {
        Opta.start()
      }
      if (option_key === 'directo') {
        this.loadEvents()
      }

      this.selected_option = option_key
    },
    loadEvents () {
      axios.get('https://s3.amazonaws.com/optafeeds-prod/gamecast/' + this.opta_competition + '/' + this.opta_season + '/matches/' + this.opta_match_id + '.json').then(
          ({data}) => {
            console.log(data)
          }
      ).catch()
    },
    loadArticles () {
      let url = ''
      if (this.drupal_match_id) {
        url = '/api/match-node/articles/' + this.drupal_match_id
      }
      else {
        url = '/api/match/articles/' + this.opta_match_id
      }
      axios.get(url).then(
          ({data}) => {
            if (data.length > 0) {
              this.opta_competition = data[0].field_opta_id
              this.opta_season = data[0].field_opta_season
              this.opta_match_id = data[0].field_opta_match_id
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