(function($, Drupal, drupalSettings) {
  Drupal.behaviors.eplayer = {
    attach: function (context, settings) {
      var width = $('#eplayer-player-' + drupalSettings.eplayer_id).width();
      $('#eplayer-player-' + drupalSettings.eplayer_id + ' .image .play-icon', context).once('play-'+drupalSettings.eplayer_id).click(function() {
        var $this = $(this);
        $('.title-' + drupalSettings.node_id).hide();
        if (width === 0 || width >= 854) width = 816;
        var height = width * 9 / 16;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.class = "big";
        var item = document.getElementById('eplayer-player-' + drupalSettings.eplayer_id);
        item.replaceChild(script, document.getElementById('video-' + drupalSettings.eplayer_id))
        script.src = "//player.performgroup.com/eplayer.js#db138633409a56a65426f0b2c7.700me8jcguoi1fvdvcjdgv345$videoid="+drupalSettings.eplayer_id;
      });
    }
  }
})(jQuery, Drupal, drupalSettings);
