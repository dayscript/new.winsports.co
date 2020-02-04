Vue.config.ignoredElements = ['opta-widget']
new Vue({
    el: '.opta-tournament-scorers',
    data: {
        competition: '',
        season: '',
        node: null
    },
    beforeMount () {
        const id = this.$el.id
        console.log(drupalSettings)
        this.node = drupalSettings.pdb.contexts['entity:node'];
        if(this.node['field_id_equipo_opta'][0]['value']) this.competition = this.node['field_id_equipo_opta'][0]['value']
        if(this.node['field_opta_season'][0]['value']) this.season = this.node['field_opta_season'][0]['value']
    }
});