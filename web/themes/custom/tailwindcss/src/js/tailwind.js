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
            /*TopBanner Ads*/
            if ($('#top-content #eplAdDivTop_Banner_NEW').length > 0) {/*Home Principal*/
                $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
            }else {
                $('#top-content').addClass('tw-hidden');
                $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
            }

            if ($('#top-content #Internas_TopBanner_728x90_Variable').length > 0) {/*Internas*/
                $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
            }else {
                $('#top-content').addClass('tw-hidden');
                $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
            }

            if ($('#top-content #BILLBOARDGOLES2 > a').length > 0) {/*Videos*/
                $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
            }else {
                $('#top-content').addClass('tw-hidden');
                $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
            }

            if ($('#top-content #Top_Banner').length > 0) {/*Estadisticas*/
                $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
            }else {
                $('#top-content').addClass('tw-hidden');
                $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
            }

            if ($('#top-content #Home_Header_1260x150').length > 0) {/*Home Mobile*/
                $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
            }else {
                $('#top-content').addClass('tw-hidden');
                $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
            }
            if($('#block-futbolinternacional ul li a.is-active').length){
                console.log('entro');
                var x = $('#block-futbolinternacional ul li a.is-active').position();
                //alert("Top: " + x.top + " Left: " + x.left);
                var scrollLeft = x.left-100;
                $('#block-futbolinternacional ul').animate({
                  scrollLeft: scrollLeft
                }, 400);
            }
            /*TopBanner Ads*/
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
                    $('#block-customadsblock-5').insertAfter('#block-customadsblock-6');
                    $('#block-views-block-opinion-block-1').insertBefore('#block-views-block-lo-ultimo-block-5');
                    $('#block-customadsblock-9').addClass('tw-pb-8').insertAfter('#block-views-block-lo-ultimo-block-2');
                    $('#block-customadsblock-10').addClass('tw-pb-8').insertAfter('#block-futbolred');
                    $('#block-customadsblock-6').insertAfter('#block-views-block-lo-ultimo-block-4');
                    $('#block-customadsblock-25').insertAfter('.opta-tournament-stats');
                }else{
                    $('#block-positionstableswidget').find('.opta-feeds-widget-positions').find('.scrollbar-w-2').attr('style', 'max-height: 310px');
                }
            }
        }
    };
})(jQuery, Drupal);