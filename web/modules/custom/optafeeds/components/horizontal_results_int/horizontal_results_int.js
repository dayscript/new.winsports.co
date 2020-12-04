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
    matches: [], 
    scroll: false,
    tlength: 0,
    tcount: 0, 
    result: false
  },
  beforeMount () {
    const id = this.$el.id
  },
  mounted () {
    this.load()
  },
  methods: {
    goto (url) {
      document.location.href = url
    },
    load(){
      this.loadTournaments()
      if(this.loading){
        this.scrollLeftMatches()
      }
      setInterval(function () {
        this.loadTournaments()
        this.scrollLeftMatches()
      }.bind(this), 60* 1000);
    },
    loadTournaments () {
      let vm = this
      let t = {}
      let matches = []
      let countft = 0
      let countpm = 0
      let size = 0
      let tlength = 0

      axios.get('/api/torneos-posinternacional/json').then(({data}) => {
        if (data.length > 0) {
          tlength = data.length
          vm.tlength = data.length
          data.forEach(function(i, ik){
          vm.tcount = ik
            i.field_opta_id = Number(i.field_opta_id)
            i.field_opta_season = Number(i.field_opta_season)
            
            Vue.set(t, i.field_opta_id+'-'+i.field_opta_season, i)

            let competition = Number(i.field_opta_id)
            let season = 2020//Number(i.field_opta_season)
            let tournament = ''
            let tournament_url = i.view_node
            
            var atitle = i.title.split(' ')
            for (var j=0; j < atitle.length; j++) {
              if(atitle[j].indexOf('-') == -1){
                if(Number(atitle[j]) && Number(atitle[j]) >= 2020){
                  atitle[j] = ''
                }
                tournament = tournament + ' ' + atitle[j]
              }
            }

            axios.get('https://optafeeds-produccion.s3-us-west-2.amazonaws.com/summary/' + competition + '/' + season + '/all.json').then(
              ({data}) => {
                let round = data.competition.active_round_id
                axios.get('https://optafeeds-produccion.s3-us-west-2.amazonaws.com/schedules/' + competition + '/' + season + '/rounds/' + round + '.json').then(({data}) => {
                  if (data.matches) {
                    size += Object.entries(data.matches).length

                    Object.entries(data.matches).forEach(function (match, key) {
                      let day = moment(match[1].date)
                      match[1].order = Number(day.format('YYYYMMDDHHmm'))
                      match[1].tournament = tournament
                      match[1].tournament_url = tournament_url
                      if(match[1].period === 'FullTime' || match[1].period === 'Full Time') countft++
                      if(match[1].period === 'PreMatch') countpm++
                      if(match[1].period === 'FullTime' || match[1].period === 'Full Time' || match[1].period === 'Postponed' || match[1].period === 'TBC' || match[1].period === 'Abandoned' || match[1].period === 'PreMatch') {
                        match[1].playing = 0
                      }else {
                        match[1].playing = 1
                      }
                      matches.push(match[1])
                    })
                    if (Number(ik+1) === Number(tlength)) {
                      aux_matches = Object.entries(matches).sort((a, b) => new Date(a[1].order) - new Date(b[1].order))
                      vm.matches = []
                      aux_matches.forEach(function (match, key) {
                        if(countft === size && key === size-1) match[1].playing = 1
                        if(countft > 2 && (countft + countpm) === size && key === countft) match[1].playing = 1
                        vm.matches.push(match[1])
                      })
                      vm.loading = false
                    }
                  }
                }).catch((error) => {console.log(error)})
            }).catch((error) => {console.log(error)})
          });
          vm.tournaments = t
        }
      }).catch((error) => {console.log(error)})
    },
    scrollLeftMatches(){
      setTimeout(function() {
        var active = document.getElementsByClassName("match-active","div",document.getElementById("content-matches"));
        this.result = active.length
        if(active.length > 0) {        
          var pos = active[0].offsetLeft-300;
          var element = document.getElementById("content-matches").scrollLeft = pos;
        }
          this.scroll = true
      }, 6000, this);
    }
  }
});