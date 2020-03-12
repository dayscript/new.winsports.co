(function($, Drupal, drupalSettings) {
  Drupal.behaviors.msplayer = {
    attach: function (context, settings) {
      var width = $('#mediastream-player-' + drupalSettings.mediastream_id).width();
      $('#mediastream-player-' + drupalSettings.mediastream_id + ' .image .play-icon', context).once('play-'+drupalSettings.mediastream_id).click(function() {
        var $this = $(this);
        $('.title-' + drupalSettings.node_id).hide();
        if (width === 0) width = 854;
        var height = width * 9 / 16;
        var mediaStreamOptions = {
          width: width,
          height: height,
          mse: true,
          type: "media",
          id: drupalSettings.mediastream_id,
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
