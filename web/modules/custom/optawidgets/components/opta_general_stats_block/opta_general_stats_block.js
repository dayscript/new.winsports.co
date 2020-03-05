Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.opta-general-stats',
  data: {
    node: null,
    type: 'col',
    loading: 0,
    tournaments: {
      col: [],
      int: [],
    },
    competition: '371',
    season: '2020',
    selected_option: 'positions',
    options: [
      {key: 'positions', label: 'Posiciones'},
      {key: 'results', label: 'Resultados'},
      {key: 'calendar', label: 'Calendario'},
      {key: 'team_ranking', label: 'Ranking de equipos'},
      {key: 'player_compare', label: 'Duelo'},
      {key: 'season_standings', label: 'Estadísticas'},
      {key: 'scorers', label: 'Goleadores'},
      {key: 'referees', label: 'Árbitros'},
      {key: 'player_ranking', label: 'Ranking de jugadores'},
    ],
  },
  beforeMount () {
    // this.node = drupalSettings.pdb.contexts['entity:node'];
    // this.competition = this.node['field_opta_id'][0]['value'];
    // this.season = this.node['field_opta_season'][0]['value'];
    // if(drupalSettings.opta.competition) this.competition =
    // drupalSettings.opta.competition if(drupalSettings.opta.season)
    // this.season = drupalSettings.opta.season
  },
  mounted () {
    var id = this.getParameterByName('id')
    if (id) {
      let data = id.split('-')
      this.competition = data[0]
      this.season = data[1]
    }
    this.loadTournaments()
  },
  methods: {
    loadTournaments () {
      this.loading++
      axios.get('/api/torneos-posinternacional/json').then(
          ({data}) => {
            this.loading--
            this.tournaments.int = data;
            if (this.tournaments.int.filter(function(item){
              return item.field_opta_id === this.competition && item.field_opta_season === this.season
            }.bind(this)).length > 0) {
              this.type = 'int'
            }
          }
      ).catch(() => {this.loading--})
      this.loading++
      axios.get('/api/torneos-poscolombia/json').then(
          ({data}) => {
            this.loading--
            this.tournaments.col = data;
          }
      ).catch(() => {this.loading--})
    },
    selectOption (option_key) {
      this.selected_option = option_key
      // this.loadTable()
    },
    getParameterByName (name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) {
        return null;
      }
      if (!results[2]) {
        return '';
      }
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }
});