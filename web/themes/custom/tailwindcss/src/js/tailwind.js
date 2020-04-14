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
     if($('#top-content #eplAdDivTop_Banner_NEW > a').length > 0){
       $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
     }else{
       $('#top-content').addClass('tw-hidden');
       $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
     }
     relocateView();
     $(window).resize(function() {
       relocateView();
     });
     function relocateView() {
       if($(window).width() < 640) {
        $('#block-envivo').addClass('tw-right-0 tw-absolute').insertAfter('#header-page .tw-flex.tw-items-center > div:first-child');
        $('#block-customadsblock').insertAfter('#block-views-block-goles-home-block-2');
        $('#block-customadsblock-4').insertAfter('#block-positionstableswidget');
        $('#block-blocktabswidgetprogramacion').insertAfter('#block-customadsblock-4');
        $('#block-customadsblock-5').insertAfter('#block-views-block-lo-ultimo-block-1');
        $('#block-views-block-opinion-block-1').insertBefore('#block-views-block-lo-ultimo-block-5');
        $('#block-customadsblock-9').addClass('tw-pb-8').insertAfter('#block-views-block-lo-ultimo-block-2');
        $('#block-customadsblock-10').addClass('tw-pb-8').insertAfter('#block-futbolred');
        $('#block-customadsblock-6').insertAfter('#block-views-block-lo-ultimo-block-4');
       }else{
       }
     }
   }
 };
})(jQuery, Drupal);