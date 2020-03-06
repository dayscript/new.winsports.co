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
       if($(window).width() < 640) {
         $('#block-publicidad1').insertAfter('#block-positionstableswidget');
         $('#block-publicidad1').addClass('tw-mt-4 tw-pt-8');
         //$('.block-views-publicaciones-por-perfil-block').insertAfter(".node-perfil");
         //$('.contextual-links-region').css('position', 'unset');
         //$('.bloque-lateral').css({'width':'310px', 'float':'none', 'margin-left':'0'});
       }else{
         $('#block-publicidad1').insertBefore('#block-blocktabswidgetprogramacion');
         $('#block-publicidad1').removeClass('tw-mt-4 tw-pt-8');
         //$('.block-views-publicaciones-por-perfil-block').insertBefore(".node-perfil");
         //$('.contextual-links-region').attr('style', '');
         //$('.bloque-lateral').attr('style', '');
       }
     }
   }
 };
})(jQuery, Drupal);