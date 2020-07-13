/**
 * @file
 * Placeholder file for custom sub-theme behaviors.
 *
 */
(function($, Drupal) {
    /**
     * Use this behavior as a template for custom Javascript.
     */
    Drupal.behaviors.tailwindcss = {
        attach: function(context, settings) {
            window.onload = function(){
                $('.loading').hide(); // hide the .loading class with the loading animation gif
            };
            let path = window.location.pathname;
            if (path.indexOf('partidos') >= 0) {
                /*$('#block-contenidoprincipaldelapagina-3').hide();
                //$('.tw-p-4').attr('style', 'padding:0 !important;');
                $(window).scroll(function() {
                    let scroll = $(window).scrollTop();
                    //console.log(scroll);
                    if (scroll >= 550 && scroll <= ($('#block-matchmenu').innerHeight())) {
                        $('#block-matchmenu').find('.tw-bg-gray').find('div[class*="tw-pl-6"]').css({
                            'position': 'fixed',
                            'right': (screen.width > 1366) ? '18.5%' : '5.5%',
                            'top': '20%',
                            'max-width': '300px',
                        });
                    } else {
                        $('#block-matchmenu').find('.tw-bg-gray').find('div[class*="tw-pl-6"]').css({
                            'position': 'relative',
                            'right': 'unset',
                            'top': 'unset',
                        });
                    }
                });*/
            }
            if ($('#top-content #eplAdDivTop_Banner_NEW > a').length > 0) {
                $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
            } else {
                $('#top-content').addClass('tw-hidden');
                $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
            }
            relocateView();
            $(window).resize(function() {
                relocateView();
            });

            function relocateView() {
                if ($(window).width() < 640) {
                    $('#block-positionstableswidget').find('.opta-feeds-widget-positions').find('.scrollbar-w-2').attr('style', 'max-height: auto');
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
                    $('#block-positionstableswidget').find('.opta-feeds-widget-positions').find('.scrollbar-w-2').attr('style', 'max-height: 310px');
                }
            }
        }
    };
})(jQuery, Drupal);