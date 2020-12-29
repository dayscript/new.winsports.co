(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.programming_config = {
    attach: function(context, settings) {
      $('#owl-programming', context).once('programming_config').owlCarousel({
        items:2,
        itemsDesktop: [1199,1],
        itemsMobile: [479,2],
        pagination: false,
        navigation:true,
        navigationText: ['<', '>'],
      });
    }
  };

})(jQuery, Drupal, drupalSettings);
