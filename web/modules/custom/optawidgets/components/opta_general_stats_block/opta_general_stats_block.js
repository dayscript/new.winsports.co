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
  computed:{
    options(){
      let items = []
      items.push({key: 'positions', label: 'Posiciones'})
      items.push({key: 'results', label: 'Resultados'})
      if (this.competition === '371') items.push({key: 'decline', label: 'Descenso'})
      if (this.competition === '625' || this.competition === '371') items.push({key: 'reclassification', label: 'Reclasificación'})
      items.push({key: 'calendar', label: 'Calendario'})
      items.push({key: 'team_ranking', label: 'Ranking de equipos'})
      items.push({key: 'player_compare', label: 'Duelo'})
      items.push({key: 'season_standings', label: 'Estadísticas'})
      items.push({key: 'scorers', label: 'Goleadores'})
      items.push({key: 'referees', label: 'Árbitros'})
      items.push({key: 'player_ranking', label: 'Ranking de jugadores'})
      return items
    }
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