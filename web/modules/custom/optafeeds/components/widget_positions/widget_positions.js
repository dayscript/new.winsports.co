moment.locale('es')
new Vue({
  el: '.opta-feeds-widget-positions',
  data: {
    loading: true,
    moment: moment,
    max_rows: 30,
    tournament_season: '0-0',
    competition: 0,
    season: 0,
    tournaments: [],
    phases: [],
    rounds: [],
    teams: [],
    players: [],
    matches: [],
    stages: [],
    channels: {},
    selected_phase_id: '',
    selected_round_id: '',
    selected_option: 'positions',
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
      //if (this.tournament_season === '371-2020') items.push({key: 'scorers', label: 'Goleadores'})
      if (this.tournament_season === '625-2020' || this.tournament_season === '371-2020') items.push({key: 'reclassification', label: 'Reclasificación'})
      return items
    },
  },
  methods: {
    loadTournaments () {
      let url = '/api/torneos/json'
      let pos = 0
      this.loading = true

      axios.get(url).then(({data}) => {
        this.tournaments = data;
        if (data.length > 0) {
          data.forEach(function(item, key) {
            if(item.field_default_widget === 'True'){
              pos = key
            }
          });
          this.tournament_season = data[pos].field_opta_id + '-' + data[pos].field_opta_season
          this.competition = data[pos].field_opta_id
          this.season = data[pos].field_opta_season
          this.selectOption(this.selected_option)
          this.loadDataMatches()
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
      this.competition = data[0]
      this.season = data[1]
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/schedules/' + this.competition + '/' + this.season + '/all.json';
      this.loading = true

      axios.get(url).then(({data}) => {
        if(data.phases) this.setRounds(data)
        this.setMatches(this.selected_round_id)
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    loadPositions () {
      let data = this.tournament_season.split('-')
      this.competition = data[0]
      this.season = data[1]
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/positions/' + this.competition + '/' + this.season + '/all.json';
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
      this.competition = data[0]
      this.season = data[1]
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/decline/' + this.competition + '/' + this.season + '/all.json';
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
      this.competition = data[0]
      this.season = data[1]
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/reclassification/' + this.competition + '/' + this.season + '/all.json';
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
      this.competition = data[0]
      this.season = data[1]
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/scorers/' + this.competition + '/' + this.season + '/all.json';
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
    loadDataMatches () {
      let data = this.tournament_season.split('-')
      this.competition = data[0]
      this.season = data[1]
      let url = '/api/matches/opta/' + this.competition + '/' + this.season
      this.loading = true

      axios.get(url).then(({data}) => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let ch = []
            if(data[i].field_canal){
              ch = data[i].field_canal.split(',')
            }
            Vue.set(this.channels, data[i].field_opta_match_id, ch)
          }
        }
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    selectTournaments () {
      this.selected_phase_id = ''
      this.selected_round_id = ''
      this.selected_option = 'positions'
      this.phases = []
      this.rounds = []
      this.teams = []
      this.players = []
      this.matches = []
      this.stages = []
      this.loadDataMatches()
      this.selectOption(this.selected_option)
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
      this.scrollLeftPhases()
    },
    setMatches(round_id){
      let data = this.tournament_season.split('-')
      this.competition = data[0]
      this.season = data[1]
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/schedules/' + this.competition + '/' + this.season + '/rounds/'+round_id+'.json';
      let matches = {}
      let day = null
      this.selected_round_id = round_id
      this.loading = true

      axios.get(url).then(({data}) => {
        let datamatches = []
        Object.entries(data.matches).forEach(function (match) {
          hour = moment(match[1].date)
          match[1].order = Number(hour.format('Hmm'))
          datamatches.push(match[1])
        })
        datamatches = datamatches.sort(function (a, b) { return a.order - b.order})
        
        datamatches.forEach(function (match) {
          day = moment(match.date)
          if (!matches[day.format('YYYYMMDD')]) {
            matches[day.format('YYYYMMDD')] = []
          }
          matches[day.format('YYYYMMDD')].push(match)
        })

        this.matches = matches
        this.loading = false           
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    },
    setPhases(data) {
      this.phases = {};
      this.selected_phase_id = data.competition.active_phase_id
      let index = 0
      let phases = Object.entries(data.phases).sort(function (a, b) { return a[1].phase.number - b[1].phase.number}) 
      Object.entries(phases).forEach((phase)=>{
        Object.entries(phase[1]).forEach((item)=>{
          if(typeof item[1].phase !== 'undefined') {
            if(typeof item[1].teams !== 'undefined' && Object.keys(item[1].teams).length){
              this.phases[index] = item[1].phase
              if(Number(item[1].phase.id) !== Number(this.selected_phase_id) && Number(item[1].phase.active) === 1) {
                this.selected_phase_id = Number(item[1].phase.id)
              }
            }
          }
        })
        index++
      })
    },
    setRounds(data) {
      this.rounds = {}
      let validate_round_id = this.selected_round_id !== '' ? 0 : 1
      this.selected_round_id = this.selected_round_id !== '' ? this.selected_round_id : data.competition.active_round_id
      let index = 0
      let phases = Object.entries(data.phases).sort(function (a, b) { return a[1].phase.number - b[1].phase.number}) 
      phases.forEach((phase)=>{
        let rounds = Object.entries(phase[1].rounds).sort(function (a, b) { return a[1].round.number - b[1].round.number}) 
        Object.entries(rounds).forEach((round)=>{
          Object.entries(round[1]).forEach((item)=>{
            if(typeof item[1].round !== 'undefined') {
              if(typeof item[1].matches !== 'undefined' && Object.keys(item[1].matches).length) {
                this.rounds[index] = item[1].round
                if(Number(item[1].round.id) !== Number(this.selected_round_id) && Number(item[1].round.active) === 1 && Number(validate_round_id) === 1) {
                  this.selected_round_id = Number(item[1].round.id)
                }
               index++
              }
            }
          })
        })
      })
    },
    gotoMatch (match_id) {
      document.location.href = '/matches/' + match_id
    },
    phaseName (string, number){
      string = (string === 'Round') ? 'Ronda' : string;
      var idCompetition =  ['371','589','625','901'], phases = {};
      if (this.competition == '371' || this.competition == '589') {
        phases = {
          Ronda: {
            1: ['Todos'],
            2: ['Liguilla'],
            3: ['Liguilla - Semifinal'],
            4: ['Liguilla - Final'],
            5: ['Liguilla - Repechaje']
          }
        }
      }else if (this.competition == '625' || this.competition == '901') {
        phases = {
          Ronda: {
            1: ['Todos'],
            2: ['Cuadrangulares']
          }
        }
      }
      if( idCompetition.indexOf( this.competition ) >= 0 && typeof phases.Ronda[number] !== 'undefined'){
        return phases.Ronda[number][0]
      }else{
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
            return 'Ronda '+number;
            break;
          case 'Round':
            return 'Ronda '+number;
            break;
          default:
            return string;
            break;
        }
      }
    },
    roundName (number){
      var idCompetition =  ['371','589','625','901', '847', '664', '128'], rounds = {};
      if (this.competition == '371' || this.competition == '589') {
        if(this.season == '2020') {
          rounds = {
            21:['Liguilla - Fecha 1'],
            22:['Liguilla - Fecha 2'],
            23:['Liguilla - Fecha 3'],
            24:['Liguilla - Semifinales'],
            25:['Liguilla - Final'],
            26:['Liguilla - Repechaje'],
            27:['Cuartos de Final - Ida'],
            28:['Cuartos de Final - Vuelta'],
            29:['Semifinales - Ida'],
            30:['Semifinales - Vuelta'],
            31:['Final - Ida'],
            32:['Final - Vuelta']
          }
        }
      }else if (this.competition == '625' || this.competition == '901') {
        if(this.season == '2020') {
          rounds = {
            18:['Cuadrangulares - Fecha 1'],
            19:['Cuadrangulares - Fecha 2'],
            20:['Cuadrangulares - Fecha 3'],
            21:['Cuadrangulares - Fecha 4'],
            22:['Cuadrangulares - Fecha 5'],
            23:['Cuadrangulares - Fecha 6'],
            24:['Final - Ida'],
            25:['Final - Vuelta']
          }
        }
        if(this.season == '2021') {
          rounds = {
            16:['Cuadrangulares - Fecha 1'],
            17:['Cuadrangulares - Fecha 2'],
            18:['Cuadrangulares - Fecha 3'],
            19:['Cuadrangulares - Fecha 4'],
            20:['Cuadrangulares - Fecha 5'],
            21:['Cuadrangulares - Fecha 6']
          }
        }
      }else if (this.competition == '847') {
        rounds = {
          11:['Cuartos de Final - Ida'],
          12:['Cuartos de Final - Vuelta'],
          13:['Semifinales - Ida'],
          14:['Semifinales - Vuelta'],
          15:['Final - Ida'],
          16:['Final - Vuelta']
        }
      }else if (this.competition == '664') {
        if(this.season == '2020') {
          rounds = {
            7:['Octavos de Final'],
            8:['Cuartos de Final'],
            9:['Semifinal'],
            10:['Final']
          }
        }
        if(this.season == '2021') {
          rounds = {
            1:['Fase 1 - Ida'],
            2:['Fase 1 - Vuelta'],
            3:['Fase 2 - Ida'],
            4:['Fase 2 - Vuelta'],
          }
        }
      }else if (this.competition == '128') {
        rounds = {
          4:['Cuartos de final'],
          5:['Semifinal'],
          6:['3er y 4to'],
          7:['Final'],
        }
      } else  {
        rounds = {
          21:['Cuartos de final - Ida'],
          22:['Cuartos de final - Vuelta'],
          23:['Semifinal - Ida'],
          24:['Semifinal - Vuelta'],
          25:['Final - Ida'],
          26:['Final - Vuelta']
        }
      }
      if( idCompetition.indexOf( this.competition ) >= 0 && typeof rounds[number] !== 'undefined'){
        return rounds[number][0]
      }else{
        return 'Fecha '+number
      }
    },
    scrollLeftPhases(){
      setTimeout(function() {
          var active = document.getElementsByClassName("phase-active","div",document.getElementById("content-phases"));
          if(active.length == 1) {        
            var pos = active[0].offsetLeft-240;
            var element = document.getElementById("content-phases").scrollLeft = pos;
          }
        }, 1500, this);
    }
  }
});
