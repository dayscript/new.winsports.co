new Vue({
  el: '.opta-feeds-reload',
  data: {
    timeout: null,
    show_stop: false
  },
  mounted () {
    console.log('Reloading...')
    this.timeout = setTimeout(function () {
      this.show_stop = false;
      document.location.reload();
    }.bind(this), 5000);
    this.show_stop = true
  },
  methods: {
    cancel () {
      clearTimeout(this.timeout);
    }
  }
});