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
    matches: [],
    prevs: {},
    cronicles: {},
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
          if (data.matches) {
            let matches = []
            let count = 0
            let size = Object.entries(data.matches).length

            Object.entries(data.matches).forEach(function (match, key) {
              let day = moment(match[1].date)
              match[1].order = Number(day.format('YYYYMMDDHmm'))
              if(match[1].period === 'FullTime' || match[1].period === 'Full Time') count++
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
              if(count === size && key === size-1) match[1].playing = 1
              vm.matches.push(match[1])
              vm.loadCronicle(match[1].id)
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
    loadCronicle (match_id) {
      axios.get('/api/match/articles/' + match_id).then(
        ({data}) => {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].field_tipo_de_articulo === 'Crónica') {
                Vue.set(this.cronicles, match_id, data[i].nid)
              }
              else if (data[i].field_tipo_de_articulo === 'Previa') {
                Vue.set(this.prevs, match_id, data[i].nid)
              }
              Vue.set(this.urls, match_id, data[i].field_url)
              Vue.set(this.goals, match_id, data[i].field_url_goals)
              Vue.set(this.channels, match_id, data[i].field_canal)
            }
          }
        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )
    }
  }
});