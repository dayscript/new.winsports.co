new Vue({
    el: '.my-new-block',
    data: {
        message: 'Hello Vue! This will only work on a single Example 1 block per page.',
        text: ''
    },
    beforeMount () {
        const id = this.$el.id
        this.text = drupalSettings.pdb.configuration[id].textField
    }
});