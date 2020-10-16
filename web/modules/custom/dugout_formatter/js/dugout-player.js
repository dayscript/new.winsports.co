(function($, Drupal, drupalSettings) {
  Drupal.behaviors.dugout = {
    attach: function (context, settings) {
      var width = $('#dugout-player-' + drupalSettings.dugout_id).width();
      $('#dugout-player-' + drupalSettings.dugout_id + ' .image .play-icon', context).once('play-'+drupalSettings.dugout_id).click(function() {
        var $this = $(this);
        $('.title-' + drupalSettings.node_id).hide();
        if (width === 0 || width >= 928) width = 928;
        var height = width * 9 / 16;
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://embed.dugout.com/v2/?p="+drupalSettings.dugout_id);
        ifrm.setAttribute("width", width);
        ifrm.setAttribute("height", height);
        ifrm.setAttribute("frameborder", "0");
        ifrm.setAttribute("scrolling", "no");
        var item = document.getElementById('dugout-player-' + drupalSettings.dugout_id);
        item.replaceChild(ifrm, document.getElementById('video-' + drupalSettings.dugout_id));
      });
    }
  }
})(jQuery, Drupal, drupalSettings);