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
  el: '.opta-feeds-horizontal-results-int',
  data: {
    loading: true,
    tournaments: {},
    matches: []
  },
  beforeMount () {
    const id = this.$el.id
  },
  mounted () {
    this.loadTournaments()
  },
  methods: {
    goto (url) {
      document.location.href = url
    },
    loadTournaments () {
      //vm.loading++
      let vm = this
      let t = {}
      let cm = 0 
      let matches = []
      let countft = 0
      let countpm = 0
      let size = 0

      axios.get('/api/torneos-posinternacional/json').then(
          ({data}) => {
            //vm.loading--
  
            if (data.length > 0) {
              data.forEach(function(i, ik){
                i.field_opta_id = Number(i.field_opta_id)
                i.field_opta_season = Number(i.field_opta_season)
                let competition = Number(i.field_opta_id)
                let season = 2020//Number(i.field_opta_season)
                let tournament = i.title

                Vue.set(t, i.field_opta_id+'-'+i.field_opta_season, i)
                //if(ik == 1){
                   axios.get('https://optafeeds-produccion.s3-us-west-2.amazonaws.com/summary/' + competition + '/' + season + '/all.json').then(
                      ({data}) => {
                        //vm.loading = false
                        let round = data.competition.active_round_id
                        axios.get('https://optafeeds-produccion.s3-us-west-2.amazonaws.com/schedules/' + competition + '/' + season + '/rounds/' + round + '.json').then(
                          ({data}) => {
                           // if(data.round) vm.active_tournament = vm.roundName(data.round.number)
                            if (data.matches) {

                              size += Object.entries(data.matches).length

                              Object.entries(data.matches).forEach(function (match, key) {
                                let day = moment(match[1].date)
                                match[1].order = Number(day.format('YYYYMMDDmm'))
                                match[1].tournament = tournament
                                if(match[1].period === 'FullTime' || match[1].period === 'Full Time') countft++
                                if(match[1].period === 'PreMatch') countpm++
                                if(match[1].period === 'FullTime' || match[1].period === 'Full Time' || match[1].period === 'Postponed' || match[1].period === 'TBC' || match[1].period === 'Abandoned' || match[1].period === 'PreMatch') {
                                  match[1].playing = 0
                                }else {
                                  match[1].playing = 1
                                }
                                matches.push(match[1])
                              })

                              aux_matches = Object.entries(matches).sort((a, b) => new Date(a[1].order) - new Date(b[1].order))
                              vm.matches = []
                              aux_matches.forEach(function (match, key) {
                                if(countft === size && key === size-1) match[1].playing = 1
                                if(countft > 2 && (countft + countpm) === size && key === countft) match[1].playing = 1
                                vm.matches.push(match[1])
                              })
                            }
                            vm.loading = false
                          }
                        ).catch(
                          (error) => {
                            console.log(error)
                            //vm.loading = false
                          }
                        )
                      }
                  ).catch(
                      (error) => {
                        console.log(error)
                        //vm.loading = false
                      }
                  )
                //}
              });
              //vm.matches = matches
              vm.tournaments = t
              this.scrollLeftPhases()
            }
          }
      ).catch(() => {//vm.loading--
      })

      setInterval(function () {
        //vm.loadPlayoffs()
      }.bind(this), 60* 1000);
    },
    scrollLeftPhases(){
      setTimeout(function() {
          var active = document.getElementsByClassName("is-active","div",document.getElementById("horizontalresultsinternationals"));
          if(active.length >= 1) {        
            var pos = active[0].offsetLeft-240;
            var element = document.getElementsByClassName("opta-feeds-horizontal-results-int").scrollLeft = pos;
          }
        }, 1500, this);
    }
  }
});