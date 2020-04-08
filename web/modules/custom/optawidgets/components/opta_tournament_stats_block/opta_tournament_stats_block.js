moment.locale('es')
Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.opta-tournament-stats',
  data: {
    node: null,
    competition: '',
    season: '',
    loading: 0,
    moment: moment,
    max_rows: 30,
    phases: [],
    teams: [],
    rounds: [],
    players: [],
    matches: [],
    selected_phase_id: '',
    selected_round_id: '',
    selected_option: '',
    positions: {
      Forward: 'Delantero',
      Striker: 'Delantero',
      Midfielder: 'Volante',
      Defender: 'Defensa',
    }
  },
  beforeMount () {
    this.node = drupalSettings.pdb.contexts['entity:node'];
    this.competition = this.node['field_opta_id'][0]['value'];
    this.season = this.node['field_opta_season'][0]['value'];
  },
  mounted () {
    this.loadTournaments()
  },
  computed: {
    options () {
      let items = []
      items.push({key: 'positions', label: 'Posiciones'})
      items.push({key: 'schedules', label: 'Resultados'})
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
    },
  },
  methods: {
    selectPhase (phase_id) {
      this.selected_phase_id = phase_id
      this.selectTableData()
    },
    selectOption (option_key) {
      this.selected_option = option_key
      if (option_key === 'schedules') {
        this.loadResults()
      }else if (this.selected_option === 'positions' || this.selected_option === 'decline') {
        this.loadTable()
      } else {
        this.loadNewWidgets('#'+option_key)
      }
    },
    loadResults () {
      this.phases = []
      let url = 'https://s3.amazonaws.com/optafeeds-prod/schedules/' + this.competition + '/' + this.season + '/all.json';
      this.loading++
      axios.get(url).then(
          ({data}) => {
            if(data.phases) this.phases = data.phases
            this.setRounds()
            this.loading--
            this.selected_phase_id = data.competition.active_phase_id

            this.setMatches(data.competition.active_round_id)
          })
    },
    setMatches(round_id){
      this.selected_round_id = round_id
      let matches = []
      let day = null
      let items = this.rounds[round_id][1].matches
      for (id in items) {
        day = moment(items[id].date)
        if (!matches[day.format('YYYYMMDD')]) {
          matches[day.format('YYYYMMDD')] = []
        }
        matches[day.format('YYYYMMDD')].push(items[id])
      }
      const ordered = {};
      Object.keys(matches).sort().forEach(function (key) {
        ordered[key] = matches[key];
      });
      this.matches = ordered
    },
    setRounds(){
      this.rounds = {}
      Object.entries(this.phases).forEach((item)=>{
        Object.entries(item[1].rounds).forEach((round)=>{
          this.rounds[round[1].round.id] = round
        })
      })
    },
    loadTournaments () {
      this. selected_option = 'positions';
      this.loadTable();
      /*axios.get('/api/torneos-colombia/json').then(
          ({data}) => {
            this.loading--
            this.tournaments = data;
            if (data.length > 0) {
              this.tournament_season = data[0].field_opta_id + '-' + data[0].field_opta_season
              this.selected_option = 'positions'
              // this.loadTable()
            }
          }
      ).catch(
          (error) => {
            this.loading--
          }
      )*/
    },
    selectTableData () {
      let teams = []
      let players = []
      let items = Object.entries(this.phases[this.selected_phase_id].teams)
      if (this.selected_option === 'decline') {
        items.sort(function (a, b) { return b[1].pos - a[1].pos})
      }
      else {
        items.sort(function (a, b) { return a[1].pos - b[1].pos})
      }
      if (this.selected_option === 'scorers') {
        items.forEach(function (player) {
          players.push(player[1])
        })
      }
      else {
        items.forEach(function (team) {
          teams.push(team[1])
        })
      }

      this.players = players
      this.teams = teams
    },
    loadTable () { 
      let url = 'https://s3.amazonaws.com/optafeeds-prod/' + this.selected_option + '/' + this.competition + '/' + this.season + '/all.json';
      this.loading++
      axios.get(url).then(
          ({data}) => {
            this.loading--
            let teams = []
            let phases = []
            let players = []
            let items = null
            if (typeof data.teams !== 'undefined') {
              items = Object.entries(data.teams)
            }
            else if (typeof data.scorers !== 'undefined') {
              items = Object.entries(data.scorers)
            }
            else {
              this.selected_phase_id = data.competition.active_phase_id
              if (typeof data.phases[this.selected_phase_id] === 'undefined') {
                this.selected_phase_id = Object.keys(data.phases).pop()
              }
              phases = data.phases
              if (this.selected_option === 'schedules') {
                items = Object.entries(data.phases[this.selected_phase_id].rounds)
              }
              else {
                items = Object.entries(data.phases[this.selected_phase_id].teams)
              }
            }
            if (this.selected_option === 'decline') {
              items.sort(function (a, b) { return b[1].pos - a[1].pos})
            }
            else if (this.selected_option === 'schedules') {
              items.sort(function (a, b) { return b[1].number - a[1].number})
            }
            else {
              items.sort(function (a, b) { return a[1].pos - b[1].pos})
            }
            if (this.selected_option === 'scorers') {
              items.forEach(function (player) {
                players.push(player[1])
              })
            }
            else {
              items.forEach(function (team) {
                teams.push(team[1])
              })
            }
            this.players = players
            this.teams = teams
            this.phases = phases
          }
      ).catch((error) => {this.loading--})
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
    gotoMatch (match_id) {
      document.location.href = '/matches/' + match_id
    },
    phaseName (string, number){
      let competition = this.competition
      string = (competition === 589 && string === 'Ronda' && number === '1' || competition === 589 && string === 'Round' && number === '1') ? 'Cuadrangulares' : string;
      string = (competition === 901 && string === 'Ronda' && number === '2' || competition === 901 && string === 'Round' && number === '2') ? 'Cuadrangulares' : string;
      string = (competition === 664 && string === 'Ronda' && number === '1' || competition === 664 && string === 'Round' && number === '1') ? 'Todos contra Todos' : string;
      switch(string){
        case 'All':
          return 'Todos contra Todos';
          break;
        case 'Semi-Finals':
          return 'Semifinales';
          break;
        case 'Quarter-Finals':
          return 'Cuartos de Final';
          break;
        case 'Round of 16':
          return 'Octavos de final';
          break;
        case 'Ronda de 16':
          return 'Octavos de final';
          break;
        case 'Ronda':
          return (number && number != 1)?'Ronda '+number:'Todos contra Todos';
          break;
        case 'Round':
          return 'Ronda '+number;
          break;
        default:
          return string;
          break;
      }
    },
    roundName (number){
      return 'Fecha ' + number
    }
  }
});
