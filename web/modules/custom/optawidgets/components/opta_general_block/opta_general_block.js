new Vue({
    el: '.opta-general-block',
    data: {
        competition: '',
        season: '',
        node: null
    },
    beforeMount () {
        const id = this.$el.id
        console.log(drupalSettings)
    }
});