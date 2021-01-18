Vue.config.ignoredElements = ['opta-widget']
new Vue({
  el: '.opta-general-stats',
  data: {
    node: null,
    type: 'col',
    loading: 0,
    max_rows: 30,
    tournaments: {
      col: {},
      int: [],
    },
    teams: [],
    phases: [],
    stages: [],
    playoffs: {},
    competition: 0,
    season: 0,
    url_parameter: '',
    competition_selected: '',
    selected_option: 'positions',
    selected_phase_id: '',
    selected_playoffs: false, 
    competition_allowed: [371,589,625,901,664,847,747],
    path: ''
  },

  beforeMount () {
    this.node = drupalSettings.pdb.contexts['entity:node'];
    this.competition = Number(this.node['field_opta_id'][0]['value']);
    this.season = Number(this.node['field_opta_season'][0]['value']);
    this.path = this.node['path'][0]['alias'];
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
      if (this.competition === 371) items.push({key: 'decline', label: 'Descenso'})
      if (this.competition === 625 || this.competition === 371) items.push({key: 'reclassification', label: 'Reclasificación'})
      if (this.competition === 371) items.push({key: 'scorers', label: 'Goleadores'})
      if (this.competition === 371) items.push({key: 'referees', label: 'Árbitros'})
      if (this.competition !== 625  // torneo
          && this.competition !== 664  // copa
          && this.competition !== 847 // femenino
          && this.competition !== 115 // Turca 
          && this.competition !== 369 // sudamericana 
      )
        items.push({key: 'season_standings', label: 'Curva de rendimiento'})
      if (this.competition !== 625  // torneo
          && this.competition !== 664  // copa
          && this.competition !== 847 // femenino
          && this.competition !== 369 // sudamericana 
      ) {
        items.push({key: 'team_ranking', label: 'Ranking de equipos'})
        items.push({key: 'player_ranking', label: 'Ranking de jugadores'})
      }
      if (this.competition === 371) items.push({key: 'player_compare', label: 'Duelo'})

      return items
    }
  },
  methods: {
    loadTournaments () {
      let id = this.getParameterByName('id')
      let competition_id = 0
      let season_id = 0
      let selected_playoffs = false

      /*if (id) {
        let data = id.split('-')
        competition_id = Number(data[0])
        season_id = Number(data[1])
      }*/

      /* Selected option to show */
      var url_location = this.path;
      var url_segmented = url_location.split('/')
      //let option_tab = url_segmented[1];
      this.competition_selected = url_segmented[2];
      if(url_location !== null || url_location !== ""){
        if(url_location.indexOf("/posiciones/") >= 0){
          this.selected_option = 'positions'
        }else if(url_location.indexOf("/resultados/") >= 0){
          this.selected_option = 'results'
        }else if(url_location.indexOf("/calendario/") >= 0){
          this.selected_option = 'calendar'
        }else if(url_location.indexOf("/descenso/") >= 0){
          this.selected_option = 'decline'
        }else if(url_location.indexOf("/reclasificacion/") >= 0){
          this.selected_option = 'reclassification'
        }else if(url_location.indexOf("/goleadores/") >= 0){
          this.selected_option = 'scorers'
        }else if(url_location.indexOf("/arbiros/") >= 0){
          this.selected_option = 'referees'
        }else if(url_location.indexOf("/curva-de-rendimiento/") >= 0){
          this.selected_option = 'season_standings'
        }else if(url_location.indexOf("/ranking-de-equipos/") >= 0){
          this.selected_option = 'team_ranking'
        }else if(url_location.indexOf("/ranking-de-jugadores/") >= 0){
          this.selected_option = 'player_ranking'
        }else if(url_location.indexOf("/duelos/") >= 0){
          this.selected_option = 'player_compare'
        }
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
              i.view_node = i.view_node.replace(/estadisticas\//i, '')
              Vue.set(t.list, i.field_opta_id+'-'+i.field_opta_season, i)
              if(ik === 0){
                if(id === null || id === '') {
                  competition_id = i.field_opta_id
                  season_id = i.field_opta_season
                }
                t.path = i.view_node
              }
            });
            if (data.filter(function(item){
              return Number(item.field_opta_id) === competition_id && Number(item.field_opta_season) === season_id
            }.bind(this)).length > 0) {
              this.type = 'int'
            }
            this.tournaments.int = t
          }
          axios.get('/api/torneos-poscolombia/json').then(
            ({data}) => {
              this.loading--
              let t = {list: {}, path: ''}
              if (data.length > 0) {
                data.forEach(function(i, ik){
                  i.field_opta_id = Number(i.field_opta_id)
                  i.field_opta_season = Number(i.field_opta_season)
                  i.field_active_playoffs = Number(i.field_active_playoffs)
                  i.view_node = i.view_node.replace(/estadisticas\//i, '')
                  Vue.set(t.list, i.field_opta_id+'-'+i.field_opta_season, i)
                  if(ik === 0){
                    if(id === null || id === '') {
                      competition_id = i.field_opta_id
                      season_id = i.field_opta_season
                    }
                    t.path = i.view_node
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

              this.selected_playoffs = selected_playoffs
              if(selected_playoffs === true){
                this.loadPlayoffs()
              }
              if(this.selected_option === 'positions' && this.competition_allowed.indexOf( this.competition ) > -1){
                this.loadPositions()
              } else if (this.selected_option === 'decline' || this.selected_option === 'reclassification') {
                this.loadTable(this.selected_option)
              }else {
                this.loadNewWidgets('#'+this.selected_option)
              }
            }
          ).catch(() => {this.loading--})
        }
      ).catch(() => {this.loading--})

      setInterval(function () {
        if(selected_playoffs === true){
            this.loadPlayoffs()
        }
        if(this.selected_option === 'positions' && this.competition_allowed.indexOf( this.competition ) > -1){
          this.loadPositions()
        } else if (this.selected_option === 'decline' || this.selected_option === 'reclassification') {
          this.loadTable(this.selected_option)
        }else {
          this.loadNewWidgets('#'+this.selected_option)
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
    loadPositions () {
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
    loadPlayoffs(){
      let competition_id = this.competition, season_id = this.season
      let url = 'https://optafeeds-produccion.s3-us-west-2.amazonaws.com/playoff/'+ competition_id +'/'+ season_id +'/all.json';
      this.loading++

      axios.get(url).then(
          ({data}) => {
            this.loading--
            let response_playoff = data
              url = 'https://www.winsports.co/sites/default/files/playoffs/playoffs-config.json'
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
    selectOptionNew (option_key) {
      this.selected_option = option_key
      if (option_key === 'decline' || option_key === 'reclassification') {
        this.loadTable(option_key)
      } else {
        if(option_key === 'positions' && this.competition_allowed.indexOf( this.competition ) > -1){
          this.loadPositions()
        }
        this.loadNewWidgets('#'+option_key)
      }
      this.scrollLeftPhases()
    },

    selectOption (option_key) {
      this.selected_option = option_key

      if(option_key == "positions"){
        this.url_parameter = '/posiciones'
      }else if(option_key == "positions"){
        this.url_parameter = '/resultados'
      }else if(option_key == "results"){
        this.url_parameter = '/resultados'
      }else if(option_key == "calendar"){
        this.url_parameter = '/calendario'
      }else if(option_key == "decline"){
        this.url_parameter = '/descenso'
      }else if(option_key == "reclassification"){
        this.url_parameter = '/reclasificacion'
      }else if(option_key == "scorers"){
        this.url_parameter = '/goleadores'
      }else if(option_key == "referees"){
        this.url_parameter = '/arbiros'
      }else if(option_key == "season_standings"){
        this.url_parameter = '/curva-de-rendimiento'
      }else if(option_key == "team_ranking"){
        this.url_parameter = '/ranking-de-equipos'
      }else if(option_key == "player_ranking"){
        this.url_parameter = '/ranking-de-jugadores'
      }else if(option_key == "player_compare"){
        this.url_parameter = '/duelos'
      }
      var new_location = window.location.origin + this.url_parameter + '/' + this.competition_selected;
      window.location.href = new_location
    },
    selectPhase (phase_id) {
      this.selected_phase_id = phase_id
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
    phaseName (string, number){
      string = (string === 'Round') ? 'Ronda' : string;
      var idCompetition =  [371, 589, 625, 901], phases = {};
      if (this.competition == 371 || this.competition == 589) {
        phases = {
          Ronda: {
            1: ['Todos'],
            2: ['Liguilla'],
            3: ['Liguilla - Semifinal'],
            4: ['Liguilla - Final'],
            5: ['Liguilla - Repechaje']
          }
        }
      }else if (this.competition == 625 || this.competition == 901) {
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
    },
    validateCompetition(id){
      return (this.competition_allowed.indexOf(id) > -1) ? true : false
    },
    scrollLeftPhases(){
      setTimeout(function() {
          var active = document.getElementsByClassName("phase-active","div",document.getElementById("content-phases"));
          if(active.length == 1) {        
            var pos = active[0].offsetLeft-240;
            var element = document.getElementById("content-phases").scrollLeft = pos;
          }
        }, 1000, this);
    }
  }
});