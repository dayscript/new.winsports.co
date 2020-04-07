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
    selected_phase_id: '',
    teams: [],
  },
  mounted() {
    var id = this.getParameterByName('id')
    if (id) {
      let data = id.split('-')
      this.competition = data[0]
      this.season = data[1]
    }
    this.loadTournaments()
  },
  computed: {
    options(){
      let items = []
      items.push({key: 'positions', label: 'Posiciones'})
      items.push({key: 'results', label: 'Resultados'})
      items.push({key: 'calendar', label: 'Calendario'})
      if (this.competition === '371') items.push({key: 'decline', label: 'Descenso'})
      if (this.competition === '625' || this.competition === '371') items.push({key: 'reclassification', label: 'Reclasificación'})
      if (this.competition === '371') items.push({key: 'scorers', label: 'Goleadores'})
      if (this.competition === '371') items.push({key: 'referees', label: 'Árbitros'})
      if (this.competition !== '625'  // torneo
          && this.competition !== '664'  // copa
          && this.competition !== '847' // femenino
          && this.competition !== '115' // Turca 
          && this.competition !== '369' // sudamericana 
      )
        items.push({key: 'season_standings', label: 'Curva de rendimiento'})
      if (this.competition !== '625'  // torneo
          && this.competition !== '664'  // copa
          && this.competition !== '847' // femenino
          && this.competition !== '369' // sudamericana 
      ) {
        items.push({key: 'team_ranking', label: 'Ranking de equipos'})
        items.push({key: 'player_ranking', label: 'Ranking de jugadores'})
      }
      if (this.competition === '371') items.push({key: 'player_compare', label: 'Duelo'})

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
      if (option_key === 'decline' || option_key === 'reclassification') {
        this.loadTable(option_key)
      } else {
        this.loadNewWidgets('#'+option_key)
      }
    },
    loadNewWidgets(dom) {
      var opta_widget_tags = jQuery(dom).find('opta-widget[load="false"]');
      if (opta_widget_tags.length) {
        opta_widget_tags.removeAttr('load');
        Opta.start();
      }
      var widget_containers = jQuery(dom).find('.Opta');
      if (widget_containers['0']) {
          var element = jQuery(widget_containers['0']),
              widget_id = element.attr('id'),
              Widget = Opta.widgets[widget_id];
          Widget.resume(Widget.live, Widget.first_time);
          setTimeout(()=>{Widget.resize()},1000)
      }
    },
    getParameterByName(name, url) {
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
    },
    loadTable(option) {
      let url = 'https://s3.amazonaws.com/optafeeds-prod/' + option + '/' + this.competition + '/' + this.season + '/all.json';
      this.loading++
      axios.get(url).then(
          ({data}) => {
            this.loading--
            this.teams = []
            let items = null
            if (data.teams) {
              items = Object.entries(data.teams)
              if (this.selected_option === 'decline') items.sort(function (a, b) { return b[1].pos - a[1].pos})
              else items.sort(function (a, b) { return a[1].pos - b[1].pos})
              let vm = this
              items.forEach(function (team) {
                vm.teams.push(team[1])
              })
            }
          }
      ).catch((error) => {this.loading--})
    },
  }
});