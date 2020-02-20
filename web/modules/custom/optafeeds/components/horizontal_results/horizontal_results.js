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
  el: '.opta-feeds-horizontal-results .whitespace-no-wrap .overflow-y-hidden',
  data: {
    loading: 0,
    id_tournament: 371,
    active_round: '',
    season: 2020,
    matches: []
  },
  beforeMount () {
    const id = this.$el.id
  },
  mounted () {
    this.loadPhases()
  },
  methods: {
    loadPhases () {
      this.loading++
      axios.get('https://s3.amazonaws.com/optafeeds-prod/schedules/' + this.id_tournament + '/' + this.season + '/all.json').then(
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
    }
  }

});