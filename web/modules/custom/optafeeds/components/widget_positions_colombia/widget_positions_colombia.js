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
    stages: [],
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
      return items
    },
  },
  methods: {
    loadTournaments () {
      let url = '/api/torneos-colombia/json'
      this.loading = true

      axios.get(url).then(({data}) => {
        this.tournaments = data;
        if (data.length > 0) {
          this.tournament_season = data[0].field_opta_id + '-' + data[0].field_opta_season
          this.selectOption('positions')
        }
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
      setInterval(function () {
          this.selectOption(this.selected_option)
      }.bind(this), 60* 1000);
    },
    loadResults () {
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/schedules/' + data[0] + '/' + data[1] + '/all.json';
      this.loading = true

      axios.get(url).then(({data}) => {
        if(data.phases) this.setPhases(data)
        this.setRounds(data.competition.active_phase_id)
        this.setMatches(this.selected_round_id !== '' ? this.selected_round_id : data.competition.active_round_id)
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    loadPositions () {
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/positions/' + data[0] + '/' + data[1] + '/all.json';
      let stages = []
      this.loading = true

      axios.get(url).then(({data}) => {
        if(data.phases) this.setPhases(data)
        Object.entries(data.phases).forEach(function(item) {
            if(typeof item[1].groups !== 'undefined' && Object.keys(item[1].groups).length > 0){
              let teams = []
              Object.entries(item[1].groups).forEach(function(group, key) {
                var teamsgroup = [];
                Object.entries(group[1]).forEach(function(team, key) {
                  teamsgroup.push(item[1].teams[team[1]])
                });
                teamsgroup.sort(function (a, b) { return a.pos - b.pos})
                teams.push(teamsgroup)
              });
              stages.push({
                  id: item[1].phase.id,
                  name: item[1].phase.type,
                  teams: teams
              });
            }else {
              let teams = []
              let group = []
              let teamsgroup = Object.entries(item[1].teams)
              if(teamsgroup.length > 0){
                teamsgroup.forEach(function (team) {
                  group.push(team[1])
                })
                group.sort(function (a, b) { return a.pos - b.pos})
              }
              teams.push(group);
              stages.push({
                  id: item[1].phase.id,
                  name: item[1].phase.type,
                  teams: teams
              });
           }
        });
        this.stages = stages
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    loadDecline () {
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/decline/' + data[0] + '/' + data[1] + '/all.json';
      this.loading = true
      
      axios.get(url).then(({data}) => {
        let teams = []
        let items = null
        
        if (typeof data.teams !== 'undefined') {
          items = Object.entries(data.teams)
          items.sort(function (a, b) { return b[1].pos - a[1].pos})
          items.forEach(function (team) {
            teams.push(team[1])
          })
        }
        this.teams = teams
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    loadReclassification () {
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/reclassification/' + data[0] + '/' + data[1] + '/all.json';
      this.loading = true

      axios.get(url).then(({data}) => {
        let teams = []
        let items = null
        
        if (typeof data.teams !== 'undefined') {
          items = Object.entries(data.teams)
          items.sort(function (a, b) { return a[1].pos - b[1].pos})
          items.forEach(function (team) {
            teams.push(team[1])
          })
        }
        this.teams = teams
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    loadScorers () {
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/scorers/' + data[0] + '/' + data[1] + '/all.json';
      this.loading = true

      axios.get(url).then(({data}) => {
        let players = []
        let items = null
        
        if (typeof data.scorers !== 'undefined') {
          items = Object.entries(data.scorers)
          items.sort(function (a, b) { return a[1].pos - b[1].pos})

          items.forEach(function (player) {
            players.push(player[1])
          })
        }
        this.players = players
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    selectPhase (phase_id) {
      this.selected_phase_id = phase_id
    },
    selectOption (option_key) {
      this.selected_option = option_key
      if (option_key === 'schedules') {
        this.loadResults()
      }else if (option_key === 'positions') {
        this.loadPositions()
      }else if (option_key === 'decline') {
        this.loadDecline()
      }else if (option_key === 'reclassification') {
        this.loadReclassification()
      }else if (option_key === 'scorers') {
        this.loadScorers()
      }
    },
    setMatches(round_id){
      let data = this.tournament_season.split('-')
      let url = 'https://s3.amazonaws.com/optafeeds-prod/schedules/' + data[0] + '/' + data[1] + '/rounds/'+round_id+'.json';
      let matches = []
      let day = null
      let items = []
      this.selected_round_id = round_id
      this.loading = true

      axios.get(url).then(({data}) => {
        Object.entries(data.matches).forEach(function (matches) {
          items.push(matches[1])
        })
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
        this.loading = false           
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    setPhases(data) {
      this.phases = {};
      this.selected_phase_id = data.competition.active_phase_id
      if (typeof data.phases[this.selected_phase_id] === 'undefined') {
        this.selected_phase_id = Object.keys(data.phases).pop()
      }
      let phases = Object.entries(data.phases).sort(function (a, b) { return a[1].phase.number - b[1].phase.number}) 
      let index = 0
      Object.entries(phases).forEach((phase)=>{
          Object.entries(phase[1]).forEach((item)=>{
          if(Object.keys(this.phases).length) {
             Object.entries(this.phases).forEach((ph)=>{
              if(ph.id === item[0]) {
                if(item[1].teams && Object.keys(item[1].teams).length) ph.teams = item[1].teams
                if(item[1].rounds && Object.keys(item[1].rounds).length) ph.rounds = item[1].rounds
              }else {
                if(item[1].teams && Object.keys(item[1].teams).length) item[1].phase.teams = item[1].teams
                if(item[1].rounds && Object.keys(item[1].rounds).length) item[1].phase.rounds = item[1].rounds
                if(typeof item[1].phase !== 'undefined') if(typeof item[1].phase.teams !== 'undefined' || typeof item[1].phase.rounds !== 'undefined') this.phases[index] = item[1].phase
              }
             })
           }else {
              if(item[1].teams && Object.keys(item[1].teams).length) item[1].phase.teams = item[1].teams
              if(item[1].rounds && Object.keys(item[1].rounds).length) item[1].phase.rounds = item[1].rounds
              if(typeof item[1].phase !== 'undefined') if(typeof item[1].phase.teams !== 'undefined' || typeof item[1].phase.rounds !== 'undefined') this.phases[index] = item[1].phase
           }
        })
        index++
      })
    },
    setRounds(phase_id) {
      this.rounds = {}
      this.selected_phase_id = phase_id
      let index = 0
      Object.entries(this.phases).forEach((item)=>{
        let rounds = Object.entries(item[1].rounds).sort(function (a, b) { return a[1].round.number - b[1].round.number}) 
        Object.entries(rounds).forEach((round)=>{
          Object.entries(round[1]).forEach((item)=>{
            if(item[1].matches && Object.keys(item[1].matches).length) item[1].round.matches = item[1].matches
            if(typeof item[1].round !== 'undefined') {
             this.rounds[index] = item[1].round
             index++
           }
          })
        })
      })
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
