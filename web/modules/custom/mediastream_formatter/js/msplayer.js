(function($, Drupal, drupalSettings) {
  Drupal.behaviors.msplayer = {
    attach: function (context, settings) {
      let type = "media", mediastream_id = drupalSettings.mediastream_id
      if(drupalSettings.mediastream_id.indexOf('-live') > -1){
          const regex = /-live/gi;
          type = "live"
          mediastream_id = drupalSettings.mediastream_id.replace(regex, '');
      }

      var width = $('#mediastream-player-' + drupalSettings.mediastream_id).width();
      $('#mediastream-player-' + drupalSettings.mediastream_id + ' .image .play-icon', context).once('play-'+drupalSettings.mediastream_id).click(function() {
        var $this = $(this);
        $('.title-' + drupalSettings.node_id).hide();
        if (width === 0 || width >= 854) width = 816;
        var height = width * 9 / 16;
        var mediaStreamOptions = {
          width: width,
          height: height,
          mse: true,
          type: type,
          id: mediastream_id,
          autoplay: drupalSettings.autoplay === '1',
          mute: drupalSettings.mute||false,
          events: { // Callbacks to be triggered when certain actions are executed by the player. All optional.
            onPlayerReady: function() {
              $(window).resize();
            }
          }
        };
        return new MediastreamPlayer('video-'+ drupalSettings.mediastream_id, mediaStreamOptions);
      });
    }
  }
})(jQuery, Drupal, drupalSettings);
