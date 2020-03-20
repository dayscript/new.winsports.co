Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.gamecast-header',
  data: {
    opta_competition: '',
    opta_season: '',
    opta_match_id: null,
    drupal_match_id: null,
    tournament_name: 'Liga BetPlay Dimayor 2020-I',
    round_name: '',
    node: null,
    loading: 0
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
      if (this.node['field_torneo_node'][0]['value']) {
        this.tournament_name = this.node['field_torneo_node'][0]['value']
      }
      if (this.node['field_round'][0]['value']) {
        this.round_name = this.node['field_round'][0]['value']
      }
    }
    if (this.opta_match_id || this.drupal_match_id) {
      this.loadArticles()
    }
    Opta.start()
  },
  methods: {
    loadArticles () {
      this.loading++
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
              this.tournament_name = data[0].field_torneo_node
              this.round_name = data[0].field_round
            }
            this.loading--
          }
      ).catch(() => { this.loading-- })
    },
  }
});
