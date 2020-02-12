Vue.config.ignoredElements = ['opta-widget']
new Vue({
    el: '.opta-tournament-stats',
    data: {
        competition: '',
        season: '',
        selected_option: 'team_ranking',
        options: [
            {key: 'positions', label: 'Posiciones'},
            {key: 'results', label: 'Resultados'},
            {key: 'calendar', label: 'Calendario'},
            {key: 'team_ranking', label: 'Ranking de equipos'},
            {key: 'player_compare', label: 'Duelo'},
            {key: 'season_standings', label: 'Estadísticas'},
            {key: 'scorers', label: 'Goleadores'},
            {key: 'referees', label: 'Árbitros'},
            {key: 'player_ranking', label: 'Ranking de jugadores'},
        ],
    },
    beforeMount () {
        if(drupalSettings.opta.competition) this.competition = drupalSettings.opta.competition
        if(drupalSettings.opta.season) this.season = drupalSettings.opta.season
    },
    methods:{
        selectOption (option_key) {
            this.selected_option = option_key
            // this.loadTable()
        },
    }
});