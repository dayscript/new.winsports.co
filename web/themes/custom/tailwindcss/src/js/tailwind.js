/**
 * @file
 * Placeholder file for custom sub-theme behaviors.
 *
 */
(function ($, Drupal) {
  /**
   * Use this behavior as a template for custom Javascript.
   */
  Drupal.behaviors.tailwindcss = {
   attach: function (context, settings) {
     relocateView();
     $(window).resize(function() {
       relocateView();
     });
     function relocateView() {
       var $publicidad1 = $('#block-publicidad1');
       var $widgetprogramacion = $('#block-blocktabswidgetprogramacion');
       if($(window).width() < 640) {
         $widgetprogramacion.add($publicidad1).insertAfter('#block-positionstableswidget');
         $('#block-publicidad1').addClass('tw-mt-4 tw-pt-8');
         $('#block-publicidad1-2').insertAfter('#block-views-block-lo-ultimo-block-1');
         $('#block-publicidad1-2').addClass('tw-mt-4 tw-pt-8');
         //Block Opinion
         $('#block-views-block-opinion-block-1').insertAfter('#block-futbolred');
       }else{
         $widgetprogramacion.add($publicidad1).insertBefore('#block-views-block-opinion-block-1');
         $('#block-publicidad1').removeClass('tw-mt-4 tw-pt-8');
         $('#block-publicidad1-2').insertAfter('#block-views-block-opinion-block-1');
         $('#block-publicidad1-2').removeClass('tw-mt-4 tw-pt-8');
         //Block Opinion
         $('#block-views-block-opinion-block-1').insertAfter('#block-publicidad1');
       }
     }
   }
 };
})(jQuery, Drupal);