moment.locale('es')
new Vue({
  el: '.opta-feeds-widget-positions',
  data: {
    loading: 0,
    tournament_season: '',
    tournaments: [],
    phases: [],
    teams: [],
    players: [],
    selected_phase_id: '',
    selected_option: '',
    options: [{key: 'positions', label: 'Posiciones'},
      // {key: 'results', label: 'Resultados'},
      {key: 'decline', label: 'Descenso'},
      {key: 'reclassification', label: 'Reclasificación'},
      {key: 'scorers', label: 'Goleadores'}
    ],
    positions:{
      Forward: 'Delantero',
      Striker: 'Delantero',
      Midfielder: 'Volante',
      Defender: 'Defensa',
    }
  },
  beforeMount () {
    const id = this.$el.id
  },
  mounted () {
    this.loadTournaments()
  },
  methods: {
    selectPhase (phase_id) {
      this.selected_phase_id = phase_id
    },
    selectOption (option_key) {
      this.selected_option = option_key
      this.loadTable()
    },
    loadTournaments () {
      this.loading++
      axios.get('/api/torneos/json').then(
          ({data}) => {
            this.loading--
            this.tournaments = data;
            if (data.length > 0) {
              this.tournament_season = data[0].field_id_equipo_opta + '-' + data[0].field_opta_season
              this.selected_option = 'positions'
              // this.loadTable()
            }
          }
      ).catch(
          (error) => {
            console.log(error)
            this.loading--
          }
      )
    },
    loadTable () {
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/' + this.selected_option + '/' + data[0] + '/' + data[1] + '/all.json';
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
            }else if (typeof data.scorers !== 'undefined') {
              items = Object.entries(data.scorers)
            } else {
              this.selected_phase_id = data.competition.active_phase_id
              if (typeof data.phases[this.selected_phase_id] === 'undefined') {
                this.selected_phase_id = Object.keys(data.phases).pop()
              }
              phases = data.phases
              items = Object.entries(data.phases[this.selected_phase_id].teams)
            }
            if(this.selected_option === 'decline'){
              items.sort(function (a, b) { return b[1].pos - a[1].pos})
            } else {
              items.sort(function (a, b) { return a[1].pos - b[1].pos})
            }
            if(this.selected_option === 'scorers'){
              items.forEach(function (player) {
                players.push(player[1])
              })
            } else {
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
  }
});
