moment.locale('es')
Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MMMD');
  }
})
Vue.filter('formatHour', function (value) {
  if (value) {
    return moment(String(value)).format('h:mm a');
  }
})
Vue.filter('capitalize', function (value) {
      if (!value) {
        return ''
      }
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
)
new Vue({
  el: '.opta-feeds-horizontal-results',
  data: {
    loading: true,
    competition: 371,
    season: 2020,
    active_round: '',
    active_tournament: '',
    matches: [],
    urls: {},
    goals: {},
    channels: {}
  },
  beforeMount () {
    const id = this.$el.id
  },
  mounted () {
    this.loadPhases()
  },
  methods: {
    goto (url) {
      document.location.href = url
    },
    loadPhases () {
      this.loading = true
      axios.get('https://optafeeds-produccion.s3-us-west-2.amazonaws.com/summary/' + this.competition + '/' + this.season + '/all.json').then(
          ({data}) => {
            this.loading = false
            this.active_round = data.competition.active_round_id
            this.loadMatches()
            this.loadDataMatches()
          }
      ).catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
      )
      setInterval(function () {
        this.loadMatches()
      }.bind(this), 60* 1000);
    },
    loadMatches () {
      this.loading = true
      axios.get('https://optafeeds-produccion.s3-us-west-2.amazonaws.com/schedules/' + this.competition + '/' + this.season + '/rounds/' + this.active_round + '.json').then(
        ({data}) => {
          if(data.round) this.active_tournament = 'Liga BetPlay Dimayor 2020 - ' + this.roundName(data.round.number)
          if (data.matches) {
            let matches = []
            let countft = 0
            let countpm = 0
            let size = Object.entries(data.matches).length

            Object.entries(data.matches).forEach(function (match, key) {
              let day = moment(match[1].date)
              match[1].order = Number(day.format('YYYYMMDDHmm'))
              if(match[1].period === 'FullTime' || match[1].period === 'Full Time') countft++
              if(match[1].period === 'PreMatch') countpm++
              if(match[1].period === 'FullTime' || match[1].period === 'Full Time' || match[1].period === 'Postponed' || match[1].period === 'TBC' || match[1].period === 'Abandoned' || match[1].period === 'PreMatch') {
                match[1].playing = 0
              }else {
                match[1].playing = 1
              }
              matches.push(match[1])
            })

            matches = Object.entries(matches).sort((a, b) => new Date(a[1].order) - new Date(b[1].order))

            let vm = this
            vm.matches = []
            matches.forEach(function (match, key) {
              if(countft === size && key === size-1) match[1].playing = 1
              if(countft > 2 && (countft + countpm) === size && key === countft) match[1].playing = 1
              vm.matches.push(match[1])
            })
          }
          this.loading = false
        }
      ).catch(
        (error) => {
          console.log(error)
          this.loading = false
        }
      )
    },
    loadDataMatches() {
      axios.get('/api/matches/opta/' + this.competition + '/' + this.season).then(
        ({data}) => {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              Vue.set(this.urls, data[i].field_opta_match_id, data[i].field_url)
              Vue.set(this.goals, data[i].field_opta_match_id, data[i].field_url_goals)
              let ch = []
              if(data[i].field_canal){
                ch = data[i].field_canal.split(',')
              }
              Vue.set(this.channels, data[i].field_opta_match_id, ch)
            }
          }
        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )
    },
    roundName (number){
      var phases = {
        21:['Cuadrangulares - Fecha 1'],
        22:['Cuadrangulares - Fecha 2'],
        23:['Cuadrangulares - Fecha 3'],
        24:['Cuadrangulares - Fecha 4'],
        25:['Cuadrangulares - Fecha 5'],
        26:['Cuadrangulares - Fecha 6'],
        27:['Final - Ida'],
        28:['Final - Vuelta']
      }
      if(phases[number]){
        return phases[number][0]
      }else{
        return 'Fecha '+number
      }
    }
  }
});