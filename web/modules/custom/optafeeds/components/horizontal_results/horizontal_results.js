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
    loading: 0,
    id_tournament: 371,
    active_round: '',
    season: 2020,
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
      this.loading++
      axios.get('https://s3.amazonaws.com/optafeeds-prod/summary/' + this.id_tournament + '/' + this.season + '/all.json').then(
          ({data}) => {
            this.loading--
            this.active_round = data.competition.active_round_id
            this.loadMatches()
          }
      ).catch(
          (error) => {
            console.log(error)
            this.loading--
          }
      )
    },
    loadMatches () {
      this.loading++
      axios.get('https://s3.amazonaws.com/optafeeds-prod/schedules/' + this.id_tournament + '/' + this.season + '/rounds/' + this.active_round + '.json').then(
          ({data}) => {
            if (data.matches) {
              let vm = this
              Object.entries(data.matches).sort((a, b) => new Date(a[1].date) - new Date(b[1].date)).forEach(function (match) {
                vm.matches.push(match[1])
                vm.loadCronicle(match[1].id)
              })
            }
            this.loading--
          }
      ).catch(
          (error) => {
            console.log(error)
            this.loading--
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
      ).catch()
    }
  }

});