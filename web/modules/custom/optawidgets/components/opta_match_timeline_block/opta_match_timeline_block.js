Vue.config.ignoredElements = ['opta-widget']
new Vue({
    el: '.opta-match-timeline',
    data: {
        competition: '',
        season: '',
        match: '',
        node: null
    },
    beforeMount () {
        const id = this.$el.id
        this.node = drupalSettings.pdb.contexts['entity:node'];
        if(this.node['field_opta_id'][0]['value']) this.competition = this.node['field_opta_id'][0]['value']
        if(this.node['field_opta_season'][0]['value']) this.season = this.node['field_opta_season'][0]['value']
        if(this.node['field_opta_match_id'][0]['value']) this.match = this.node['field_opta_match_id'][0]['value']
    }
    // created() {
    //     let uri = window.location.href.split('?');
    //     if (uri.length === 2) {
    //         let vars = uri[1].split('&');
    //         let getVars = {};
    //         let tmp = '';
    //         vars.forEach(function (v) {
    //             tmp = v.split('=');
    //             if (tmp.length === 2){
    //                 getVars[tmp[0]] = tmp[1];
    //             }
    //         });
    //         console.log(getVars);
    //         // do 
    //     }
    // },
});