moment.locale('es')
new Vue({
  el: '.opta-feeds-widget-positions-colombia',
  data: {
    loading: 0,
    moment: moment,
    max_rows: 30,
    tournament_season: '0-0',
    tournaments: [],
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
    const id = this.$el.id
  },
  mounted () {
    this.loadTournaments()
  },
  computed: {
    options () {
      let items = []
      items.push({key: 'positions', label: 'Posiciones'})
      items.push({key: 'schedules', label: 'Resultados'})
      if (this.tournament_season === '371-2020') items.push({key: 'decline', label: 'Descenso'})
      if (this.tournament_season === '625-2020' || this.tournament_season === '371-2020') items.push({key: 'reclassification', label: 'Reclasificación'})
      // {key: 'scorers', label: 'Goleadores'}
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
      }
      else {
        this.loadTable()
      }
    },
    loadResults () {
      this.phases = []
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/schedules/' + data[0] + '/' + data[1] + '/all.json';
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
      // for(let i=0; i<)
      console.log(Object.keys(this.phases).length)
      Object.entries(this.phases).forEach((item)=>{
        Object.entries(item[1].rounds).forEach((round)=>{
          this.rounds[round[1].round.id] = round
        })
      })
    },
    loadTournaments () {
      this.loading++
      axios.get('/api/torneos-colombia/json').then(
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
            console.log(error)
            this.loading--
          }
      )
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
    gotoMatch (match_id) {
      document.location.href = '/matches/' + match_id
    },
    phaseName (string, number){
      let data = this.tournament_season.split('-')
      let competition = data[0]
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
