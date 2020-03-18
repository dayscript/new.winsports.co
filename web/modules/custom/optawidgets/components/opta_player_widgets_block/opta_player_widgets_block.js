Vue.config.ignoredElements = ['opta-widget']
new Vue({
    el: '.opta-player-widgets',
    data: {
        competition: '371',
        season: '2020',
        player: '',
        node: null
    },
    beforeMount () {
        const id = this.$el.id
        this.node = drupalSettings.pdb.contexts['entity:node'];
        if(this.node['field_opta_id'][0]['value']) this.player = this.node['field_opta_id'][0]['value']
    }
});