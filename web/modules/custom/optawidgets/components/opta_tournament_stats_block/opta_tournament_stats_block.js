Vue.config.ignoredElements = ['opta-widget']
new Vue({
    el: '.opta-tournament-stats',
    data: {
        node: null,
        competition: '',
        season: '',
        selected_option: 'positions',
        teams: [],
    },
    beforeMount () {
        this.node = drupalSettings.pdb.contexts['entity:node'];
        this.competition = this.node['field_opta_id'][0]['value'];
        this.season = this.node['field_opta_season'][0]['value'];
    },
    computed:{
        options(){
            let items = []
            items.push({key: 'positions', label: 'Posiciones'})
            items.push({key: 'results', label: 'Resultados'})
            if (this.competition === '371') items.push({key: 'decline', label: 'Descenso'})
            if (this.competition === '625' || this.competition === '371') items.push({key: 'reclassification', label: 'Reclasificación'})
            items.push({key: 'calendar', label: 'Calendario'})
            if (this.competition !== '369')items.push({key: 'team_ranking', label: 'Ranking de equipos'})
            if (this.competition === '371') items.push({key: 'player_compare', label: 'Duelo'})
            if (this.competition !== '115' && this.competition !== '369')items.push({key: 'season_standings', label: 'Curva de rendimiento'})
            if (this.competition === '371') items.push({key: 'scorers', label: 'Goleadores'})
            if (this.competition === '371') items.push({key: 'referees', label: 'Árbitros'})
            if (this.competition !== '369')items.push({key: 'player_ranking', label: 'Ranking de jugadores'})
            return items
        }
    },
    methods:{
        selectOption (option_key) {
            this.selected_option = option_key
            if (option_key === 'decline' || option_key === 'reclassification') {
                this.loadTable(option_key)
            } else {
                this.loadNewWidgets('#'+option_key)
            }
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
            let url = 'https://s3.amazonaws.com/optafeeds-prod/' + option + '/' + this.competition + '/' + this.season + '/all.json';
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
    }
});