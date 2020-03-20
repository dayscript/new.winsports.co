Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.match-menu',
  data: {
    display: false,
    selected_option: 'estadisticas',
    opta_competition: '',
    opta_season: '',
    opta_match_id: null,
    drupal_match_id: null,
    opta_home_id: null,
    opta_away_id: null,
    prev: null,
    tournament_name: 'Liga BetPlay Dimayor 2020-I',
    round_name: '',
    cron: null,
    node: null,
    events: [],
    widget: 'chalkboard',
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
      if (this.node['field_tipo_de_articulo'][0]['target_id'] === '2876') {
        this.selected_option = 'cronica'
        this.display = true
        this.cron = this.node['nid'][0]['value']
      }
      else if (this.node['field_tipo_de_articulo'][0]['target_id'] === '2882') {
        this.selected_option = 'previa'
        this.display = true
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
      if (this.node['field_opta_home_id'][0]['value']) {
        this.opta_home_id = this.node['field_opta_home_id'][0]['value']
      }
      if (this.node['field_opta_away_id'][0]['value']) {
        this.opta_away_id = this.node['field_opta_away_id'][0]['value']
      }
      if (this.node['field_torneo_node'][0]['value']) {
        this.tournament_name = this.node['field_torneo_node'][0]['value']
      }
      if (this.node['field_round'][0]['value']) {
        this.round_name = this.node['field_round'][0]['value']
      }
      this.display = true
    }
    if (this.opta_match_id || this.drupal_match_id) {
      this.loadArticles()
    }
    if (this.selected_option == 'directo') {
      this.loadEvents()
    }
    Opta.start()
  },
  methods: {
    selectWidget(widget){
      this.widget = widget
    },
    selectOption (option_key) {
      this.loading++
      this.selected_option = option_key
      if (option_key === 'previa') {
        document.location.href = '/node/' + this.prev
      }
      if (option_key === 'cronica') {
        document.location.href = '/node/' + this.cron
      }
      if (option_key === 'estadisticas' || option_key === 'alineaciones') {
        jQuery('#main-content-region').addClass('md:tw-hidden')
        let timer = setTimeout(() => {
          Opta.start()
          this.loading--
        }, 1000)
      }
      if (option_key === 'directo') {
        jQuery('#main-content-region').addClass('md:tw-hidden')
        this.loadEvents()
        this.loading--
      }
    },
    loadEvents () {
      axios.get('https://s3.amazonaws.com/optafeeds-prod/gamecast/' + this.opta_competition + '/' + this.opta_season + '/matches/' + this.opta_match_id + '.json').then(
          ({data}) => {
            if (data.events) {
              this.events = data.events
            }
          }
      ).catch(() => {
        this.events = []
      })
    },
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
              this.opta_home_id = data[0].field_opta_home_id
              this.opta_away_id = data[0].field_opta_away_id
              this.tournament_name = data[0].field_torneo_node
              this.round_name = data[0].field_round
              for (let i = 0; i < data.length; i++) {
                if (data[i].field_tipo_de_articulo === 'Previa') {
                  this.prev = data[i].nid
                }
                else if (data[i].field_tipo_de_articulo === 'Crónica') {
                  this.cron = data[i].nid
                }
              }
            }
            this.loading--
          }
      ).catch(() => { this.loading-- })
    },
    imageEventsOpta (type) {
      var events = {
        "lineup": "on-off",
        "start": "on-off",
        "attempt blocked": "catch",
        "free kick lost": "fault",
        "free kick won": "fault",
        "post": "shot_stick",
        "miss": "shot_desv",
        "yellow card": "card_yellow",
        "yellow-card": "card_yellow",
        "red card": "card_red",
        "goal": "goal",
        "corner": "corner",
        "offside": "offside",
        "attempt saved": "shot_direct",
        "end 1": "on-off",
        "end 2": "on-off",
        "end 14": "on-off",
        "substitution": "change",
        "start delay": "on-off",
        "end delay": "on-off",
        "penalty won": "penal",
        "penalty lost": "penal_err",
        "goal_head": "goal",
        "goal_shot": "goal",
        "autogoal": "autogoal",
        "penal_goalx": "penal",
        "penal_errx": "penal_err",
        "card_red": "card_red",
        "change_out": "change",
        "comment": "comment",
        "2t_start": "on-off",
        "extra_start": "on-off",
        "extra_end": "on-off"
      }
      return (type in events ? events[type] : '');
    }
  }
});
