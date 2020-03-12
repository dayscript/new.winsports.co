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
     if($('#top-content .top-banner').length > 0){
       if($(window).width() < 640){
         $('#top-content').addClass('tw-mt-16');
       }else{
         $('#top-content').addClass('tw-mt-32');
       }
       $('#horizontal-results').addClass('tw-mt-0');
     }else{
       if($(window).width() < 640){
         $('#horizontal-results').addClass('tw-mt-16');
       }else{
         $('#horizontal-results').addClass('tw-mt-32');
       }
     }
     relocateView();
     $(window).resize(function() {
       relocateView();
     });
     function relocateView() {
       var $publicidad1 = $('#block-publicidad1');
       var $widgetprogramacion = $('#block-blocktabswidgetprogramacion');
       if($(window).width() < 640) {
         //Block Programacion y publicidad
         $widgetprogramacion.add($publicidad1).insertAfter('#block-positionstableswidget');
         $('#block-publicidad1').addClass('tw-mt-4 tw-pt-8');
         $('#block-publicidad1-2').insertAfter('#block-views-block-lo-ultimo-block-1');
         $('#block-publicidad1-2').addClass('tw-mt-4 tw-pt-8');
         //Block Opinion
         $('#block-views-block-opinion-block-1').insertAfter('#block-futbolred');
         //Block En vivo
         $('#block-envivo').insertAfter('#block-tailwindcss-branding').addClass('tw-absolute tw-right-0');
       }else{
         //Block Programacion y publicidad
         $widgetprogramacion.add($publicidad1).insertBefore('#block-views-block-opinion-block-1');
         $('#block-publicidad1').removeClass('tw-mt-4 tw-pt-8');
         $('#block-publicidad1-2').insertAfter('#block-views-block-opinion-block-1');
         $('#block-publicidad1-2').removeClass('tw-mt-4 tw-pt-8');
         //Block Opinion
         $('#block-views-block-opinion-block-1').insertAfter('#block-publicidad1');
         //Block En vivo
         $('#block-envivo').insertAfter('#block-toplinks').removeClass('tw-absolute tw-right-0');
       }
     }
   }
 };
})(jQuery, Drupal);