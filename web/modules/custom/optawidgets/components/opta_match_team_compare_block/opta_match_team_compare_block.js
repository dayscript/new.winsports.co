Vue.config.ignoredElements = ['opta-widget']
new Vue({
    el: '.opta-match-team-compare',
    data: {
        competition: '',
        season: '',
        match: '',
        home_team: '',
        away_team: '',
        node: null
    },
    beforeMount () {
        const id = this.$el.id
        this.node = drupalSettings.pdb.contexts['entity:node'];
        // if(this.node['field_opta_home_id'] && this.node['field_opta_home_id'][0]['value']) this.home_team = this.node['field_opta_home_id'][0]['value']
        // if(this.node['field_opta_away_id'] && this.node['field_opta_away_id'][0]['value']) this.away_team = this.node['field_opta_away_id'][0]['value']
        if(this.node['field_opta_id'][0]['value']) this.competition = this.node['field_opta_id'][0]['value']
        if(this.node['field_opta_season'][0]['value']) this.season = this.node['field_opta_season'][0]['value']
        if(this.node['field_opta_match_id'][0]['value']) this.match = this.node['field_opta_match_id'][0]['value']
    }
});