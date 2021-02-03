(function($, Drupal, drupalSettings) {

  Drupal.behaviors.msplayer = {
    attach: function (context, settings) {
      $('[id*=mediastream-player-]', context).click(function() {
        var type = "media";
        var id = this.id, params = {};

        id = id.replace('mediastream-player-', '');

        var mdm = drupalSettings.settings.mediastream_formatter;
        Object.keys(mdm).forEach(function (key) {
          if(mdm[key].mediastream_id == id) {
            params = mdm[key];
          }
        });

        var width = $('#mediastream-player-' + params.mediastream_id).width();
        if (width === 0 || width >= 854) width = 816;
        var height = width * 9 / 16;

        $('.title-' + params.node_id).hide();

        if(id.indexOf('-live') > -1){
          const regex = /-live/gi;
          type = "live"
          id = id.replace(regex, '');
        }

        var mediaStreamOptions = {
          width: width,
          height: height,
          mse: true,
          type: type,
          id: id,
          autoplay: (params.autoplay == 1) ? true : false||false,
          mute: params.mute||false,
          events: { // Callbacks to be triggered when certain actions are executed by the player. All optional.
            onPlayerReady: function() {
              $(window).resize();
            }
          }
        };
        return new MediastreamPlayer('video-'+ params.mediastream_id, mediaStreamOptions);
      });
    }
  }
})(jQuery, Drupal, drupalSettings);
