Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.opta-general-stats',
  data: {
    node: null,
    type: 'col',
    loading: 0,
    tournaments: {
      col: {},
      int: [],
    },
    teams: [],
    competition: '0',
    season: '0',
    selected_option: 'positions',
    selected_phase_id: '',
    playoffs: {},
    selected_playoffs: false
  },
  mounted() {
    this.loadTournaments()
  },
  computed: {
    options(){
      let items = []
      items.push({key: 'positions', label: 'Posiciones'})
      items.push({key: 'results', label: 'Resultados'})
      items.push({key: 'calendar', label: 'Calendario'})
      if (this.competition === '371') items.push({key: 'decline', label: 'Descenso'})
      if (this.competition === '625' || this.competition === '371') items.push({key: 'reclassification', label: 'Reclasificación'})
      if (this.competition === '371') items.push({key: 'scorers', label: 'Goleadores'})
      if (this.competition === '371') items.push({key: 'referees', label: 'Árbitros'})
      if (this.competition !== '625'  // torneo
          && this.competition !== '664'  // copa
          && this.competition !== '847' // femenino
          && this.competition !== '115' // Turca 
          && this.competition !== '369' // sudamericana 
      )
        items.push({key: 'season_standings', label: 'Curva de rendimiento'})
      if (this.competition !== '625'  // torneo
          && this.competition !== '664'  // copa
          && this.competition !== '847' // femenino
          && this.competition !== '369' // sudamericana 
      ) {
        items.push({key: 'team_ranking', label: 'Ranking de equipos'})
        items.push({key: 'player_ranking', label: 'Ranking de jugadores'})
      }
      if (this.competition === '371') items.push({key: 'player_compare', label: 'Duelo'})

      return items
    }
  },
  methods: {
    loadTournaments () {
      let id = this.getParameterByName('id')
      let competition_id = 0
      let season_id = 0
      let selected_playoffs = false

      if (id) {
        let data = id.split('-')
        competition_id = Number(data[0])
        season_id = Number(data[1])
      }

      this.loading++
      axios.get('/api/torneos-posinternacional/json').then(
          ({data}) => {
            this.loading--
            let t = {list: {}, path: ''}
            if (data.length > 0) {
              data.forEach(function(i, ik){
                i.field_opta_id = Number(i.field_opta_id)
                i.field_opta_season = Number(i.field_opta_season)
                i.field_active_playoffs = Number(i.field_active_playoffs)
                Vue.set(t.list, i.field_opta_id+'-'+i.field_opta_season, i)
                if(ik === 0){
                  if(id === null || id === '') {
                    competition_id = i.field_opta_id
                    season_id = i.field_opta_season
                  }
                  t.path = '/posiciones?id='+i.field_opta_id + '-'+ i.field_opta_season
                }
              });
              if (data.filter(function(item){
                return Number(item.field_opta_id) === competition_id && Number(item.field_opta_season) === season_id
              }.bind(this)).length > 0) {
                this.type = 'int'
              }
              this.tournaments.int = t
            }
            this.competition = competition_id
            this.season = season_id
          }
      ).catch(() => {this.loading--})
      this.loading++
      axios.get('/api/torneos-poscolombia/json').then(
          ({data}) => {
            this.loading--
            let t = {list: {}, path: ''}
            if (data.length > 0) {
              data.forEach(function(i, ik){
                i.field_opta_id = Number(i.field_opta_id)
                i.field_opta_season = Number(i.field_opta_season)
                i.field_active_playoffs = Number(i.field_active_playoffs)
                Vue.set(t.list, i.field_opta_id+'-'+i.field_opta_season, i)
                if(ik === 0){
                  if(id === null || id === '') {
                    competition_id = i.field_opta_id
                    season_id = i.field_opta_season
                  }
                  t.path = '/posiciones?id='+i.field_opta_id + '-'+ i.field_opta_season
                }
                if(i.field_opta_id === competition_id && i.field_opta_season === season_id && i.field_active_playoffs === 1){
                  selected_playoffs = true;
                }
              });
              if (data.filter(function(item){
                return Number(item.field_opta_id) === competition_id && Number(item.field_opta_season) === season_id
              }.bind(this)).length > 0) {
                this.type = 'col'
              }
              this.tournaments.col = t
            }
           
            this.competition = competition_id
            this.season = season_id
            this.selected_playoffs = selected_playoffs
            if(selected_playoffs === true){
              this.loadPlayoffs()
            }
          }
      ).catch(() => {this.loading--})
      setInterval(function () {
        if(selected_playoffs === true){
            this.loadPlayoffs()
        }
      }.bind(this), 60* 1000);
    },
    loadNewWidgets(dom) {
      var opta_widget_tags = jQuery(dom).find('opta-widget[load="false"]');
      if (opta_widget_tags.length) {
        opta_widget_tags.removeAttr('load');
        Opta.start();
      }
      var widget_containers = jQuery(dom).find('.Opta');
      if (widget_containers['0']) {
          var element = jQuery(widget_containers['0']),
              widget_id = element.attr('id'),
              Widget = Opta.widgets[widget_id];
          Widget.resume(Widget.live, Widget.first_time);
          setTimeout(()=>{Widget.resize()},1000)
      }
    },
    loadTable(option) {
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/' + option + '/' + this.competition + '/' + this.season + '/all.json';
      this.loading++
      axios.get(url).then(
          ({data}) => {
            this.loading--
            this.teams = []
            let items = null
            if (data.teams) {
              items = Object.entries(data.teams)
              if (this.selected_option === 'decline') items.sort(function (a, b) { return b[1].pos - a[1].pos})
              else items.sort(function (a, b) { return a[1].pos - b[1].pos})
              let vm = this
              items.forEach(function (team) {
                vm.teams.push(team[1])
              })
            }
          }
      ).catch((error) => {this.loading--})
    },
    loadPlayoffs(){
      let competition_id = this.competition, season_id = this.season
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/playoff/'+ competition_id +'/'+ season_id +'/all.json';
      this.loading++

      axios.get(url).then(
          ({data}) => {
            this.loading--
            let response_playoff = data
              url = 'https://nuevo.winsports.co/sites/default/files/playoffs/playoffs-config.json'
              axios.get(url).then(
                  ({data}) => {
                    this.loading--
                    
                    let playoffs = {A: [], B: [], C: [], config: {}, r16: false, back: false}
                    Object.keys(response_playoff).forEach(function(r, rk) {
                      if(r !== 'champion'){
                        let response_config = data
                        playoffs.config = response_config
                        let configA = response_config.competition[competition_id][season_id].A
                        let configB = response_config.competition[competition_id][season_id].B
                        let pos = 0
                        if(r === 'ronda_de_16'){
                          playoffs.r16 = true;
                        }

                        playoffs.A.push({name: response_playoff[r].type, type: r, matches: {}, order: rk})
                        configA.forEach(function(c, ck) {
                          response_playoff[r].matches.go.forEach(function(m, mk) {
                            if(c.g.find(element => element == m.home_team_id) || c.g.find(element => element == m.away_team_id)){
                              if(typeof response_playoff[r].matches.back !== 'undefined'){
                                response_playoff[r].matches.back.forEach(function(mb, mbk) {
                                  if(c.g.find(element => element == mb.home_team_id) || c.g.find(element => element == mb.away_team_id)){
                                    m.back = mb
                                    playoffs.back = true
                                  }
                                });
                              }
                              Vue.set(playoffs.A[rk].matches, m.home_team_id+'-'+ m.away_team_id, m)
                              pos++
                            }
                          });
                        });
                        
                        if(r !== 'final') {
                          pos = 0
                          playoffs.B.push({name: response_playoff[r].type, type: r, matches: {}, order: rk})
                          configB.forEach(function(c, ck) {
                            response_playoff[r].matches.go.forEach(function(m, mk) {
                              if(c.g.find(element => element == m.home_team_id) || c.g.find(element => element == m.away_team_id)){
                                if(typeof response_playoff[r].matches.back !== 'undefined'){
                                  response_playoff[r].matches.back.forEach(function(mb, mbk) {
                                    if(c.g.find(element => element == mb.home_team_id) || c.g.find(element => element == mb.away_team_id)){
                                      m.back = mb
                                      playoffs.back = true
                                    }
                                  });
                                }
                                Vue.set(playoffs.B[rk].matches, m.home_team_id+'-'+ m.away_team_id, m)
                                pos++
                              }
                            });
                          });
                        }
                      }else if(r === 'champion') {
                         playoffs.C.push({name: '', id: 0})
                      }
                    });

                    let pos = 0, m = {match_id: 0, home_team_id: 0, home_team_name: "", home_score: '', home_pen_score: 0, away_team_id: 0, away_team_name: "", away_score: '', away_pen_score: 0, round_id: 0 }
                    if(!Object.keys(response_playoff).find(element => element == 'cuartos_de_final')){
                      pos = playoffs.A.length
                      if(playoffs.back) m.back = m                   

                      playoffs.A.push({name: 'Cuartos de final', type: 'cuartos_de_final', matches: {}, order: pos})
                      
                      Vue.set(playoffs.A[pos].matches, 0, m)
                      Vue.set(playoffs.A[pos].matches, 1, m)

                      playoffs.B.push({name: 'Cuartos de final', type: 'cuartos_de_final', matches: {}, order: pos})
                      Vue.set(playoffs.B[pos].matches, 0, m)
                      Vue.set(playoffs.B[pos].matches, 1, m)

                    }
                    if(!Object.keys(response_playoff).find(element => element == 'semifinal')){ 
                      pos = playoffs.A.length  
                      if(playoffs.back) m.back = m

                      playoffs.A.push({name: 'Semifinal', type: 'semifinal', matches: {}, order: pos})
                      Vue.set(playoffs.A[pos].matches, 0, m)

                      playoffs.B.push({name: 'Semifinal', type: 'semifinal', matches: {}, order: pos})
                      Vue.set(playoffs.B[pos].matches, 1, m)

                    }
                    if(!Object.keys(response_playoff).find(element => element == 'final')){
                      pos = playoffs.A.length
                      if(playoffs.back) m.back = m

                      playoffs.A.push({name: 'Final', type: 'final', matches: {}, order: pos})
                      Vue.set(playoffs.A[pos].matches, 0, m)

                      playoffs.C.push({name: '', id: 0})
                    }

                    playoffs.B = playoffs.B.sort(function (a, b) { return b.order - a.order})
                    this.playoffs = playoffs
                    this.loading++
                  }
              ).catch((error) => {this.loading--})

          }
      ).catch((error) => {this.loading--})
    },
    selectOption (option_key) {
      this.selected_option = option_key
      if (option_key === 'decline' || option_key === 'reclassification') {
        this.loadTable(option_key)
      } else {
        this.loadNewWidgets('#'+option_key)
      }
    },
    getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) {
        return null;
      }
      if (!results[2]) {
        return '';
      }
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }
});